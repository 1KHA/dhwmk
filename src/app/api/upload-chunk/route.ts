import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { mkdir, writeFile, readdir, readFile, unlink } from 'fs/promises';
import { uploadToStorage } from "@/lib/supabase-storage";
import { ChunkMetadata } from "@/lib/chunked-upload";
import { ALLOWED_FILE_TYPES } from "@/lib/constants";

// Directory for temporary storage of chunks
const TEMP_DIR = path.join(process.cwd(), 'tmp', 'chunks');

/**
 * Ensures the temp directory exists
 */
async function ensureTempDir(sessionId: string): Promise<string> {
  const sessionDir = path.join(TEMP_DIR, sessionId);
  
  try {
    await mkdir(sessionDir, { recursive: true });
  } catch (error) {
    console.error(`Failed to create temp directory: ${error}`);
    throw new Error('Failed to prepare storage for file upload');
  }
  
  return sessionDir;
}

/**
 * Saves a chunk to the temp directory
 */
async function saveChunk(chunk: Buffer, sessionDir: string, chunkIndex: number): Promise<void> {
  const chunkPath = path.join(sessionDir, `chunk-${chunkIndex}`);
  await writeFile(chunkPath, chunk);
}

/**
 * Checks if all chunks have been uploaded
 */
async function areAllChunksUploaded(sessionDir: string, totalChunks: number): Promise<boolean> {
  try {
    const files = await readdir(sessionDir);
    const chunkFiles = files.filter(file => file.startsWith('chunk-'));
    return chunkFiles.length === totalChunks;
  } catch (error) {
    console.error(`Error checking chunks: ${error}`);
    return false;
  }
}

/**
 * Reassembles chunks into the complete file
 */
async function reassembleFile(
  sessionDir: string, 
  totalChunks: number, 
  filename: string
): Promise<Buffer> {
  try {
    // Read and concatenate all chunks in order
    const buffers: Buffer[] = [];
    
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(sessionDir, `chunk-${i}`);
      const chunkData = await readFile(chunkPath);
      buffers.push(chunkData);
    }
    
    // Combine all buffers into one
    return Buffer.concat(buffers);
  } catch (error) {
    console.error(`Error reassembling file: ${error}`);
    throw new Error('Failed to reassemble file from chunks');
  }
}

/**
 * Cleans up temporary files
 */
async function cleanupTempFiles(sessionDir: string): Promise<void> {
  try {
    // Read all files in the session directory
    const files = await readdir(sessionDir);
    
    // Delete each file
    for (const file of files) {
      await unlink(path.join(sessionDir, file));
    }
    
    // Try to remove the directory (may fail if other processes are using it)
    try {
      fs.rmdirSync(sessionDir);
    } catch (e) {
      console.log(`Note: Could not remove session directory, it may be in use: ${e}`);
    }
  } catch (error) {
    console.error(`Error cleaning up temp files: ${error}`);
    // Don't throw here, this is a cleanup operation
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Request must be multipart/form-data" },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const chunkBlob = formData.get("chunk") as File;
    const metadataStr = formData.get("metadata") as string;
    
    if (!chunkBlob) {
      return NextResponse.json(
        { error: "No chunk provided" },
        { status: 400 }
      );
    }

    if (!metadataStr) {
      return NextResponse.json(
        { error: "No metadata provided" },
        { status: 400 }
      );
    }

    // Parse metadata
    let metadata: ChunkMetadata;
    try {
      metadata = JSON.parse(metadataStr);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid metadata format" },
        { status: 400 }
      );
    }

    // Basic validation
    if (!metadata.id || typeof metadata.chunkIndex !== 'number' || typeof metadata.totalChunks !== 'number') {
      return NextResponse.json(
        { error: "Invalid metadata" },
        { status: 400 }
      );
    }

    // For the first chunk, validate file type if we have that information
    if (metadata.chunkIndex === 0 && metadata.mimeType) {
      const isValidFileType = ALLOWED_FILE_TYPES.includes(metadata.mimeType);
      
      if (!isValidFileType && metadata.mimeType !== '') {
        return NextResponse.json(
          { error: "Unsupported file type" },
          { status: 400 }
        );
      }
    }

    // Get additional data if any
    const milestoneId = formData.get("milestoneId") as string;
    // Other additionalData would be parsed similarly

    // Ensure temp directory exists
    const sessionDir = await ensureTempDir(metadata.id);
    
    // Convert the Blob to a Buffer
    const arrayBuffer = await chunkBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Save the chunk
    await saveChunk(buffer, sessionDir, metadata.chunkIndex);
    
    // Check if this is the last chunk or if all chunks have now been uploaded
    const allUploaded = await areAllChunksUploaded(sessionDir, metadata.totalChunks);
    
    // If all chunks are uploaded, reassemble the file
    if (allUploaded) {
      try {
        console.log(`All chunks uploaded for session ${metadata.id}, reassembling file...`);
        
        // Create a metadata file with original filename and any additional data
        const fileMetadata = {
          filename: metadata.filename,
          mimeType: metadata.mimeType,
          size: metadata.size,
          milestoneId,
          uploadedAt: new Date().toISOString(),
        };
        
        await writeFile(
          path.join(sessionDir, 'metadata.json'), 
          JSON.stringify(fileMetadata)
        );
        
        // Reassemble the complete file
        const completeFile = await reassembleFile(sessionDir, metadata.totalChunks, metadata.filename);
        
        // Upload to final storage
        const timestamp = Date.now();
        const storageFileName = `${timestamp}_${metadata.filename}`;
        
        // Determine the folder based on the context
        let folder = 'uploads'; // Default folder
        if (milestoneId) {
          folder = 'milestones';
        } else if (formData.has('teamName')) {
          folder = 'teams';
        }
        
        // Upload the reassembled file to storage
        const filePath = await uploadToStorage(completeFile, storageFileName, folder);
        
        // Clean up temp files
        await cleanupTempFiles(sessionDir);
        
        // Return success response
        return NextResponse.json({
          success: true,
          message: "File uploaded successfully",
          filePath,
          originalName: metadata.filename,
          size: metadata.size,
        });
      } catch (error) {
        console.error("Error processing complete file:", error);
        return NextResponse.json(
          { 
            error: "Failed to process complete file",
            details: error instanceof Error ? error.message : String(error)
          },
          { status: 500 }
        );
      }
    } else {
      // This is not the last chunk or not all chunks are uploaded yet
      return NextResponse.json({
        success: true,
        message: `Chunk ${metadata.chunkIndex + 1} of ${metadata.totalChunks} received`,
        chunkIndex: metadata.chunkIndex,
        remainingChunks: metadata.totalChunks - (metadata.chunkIndex + 1),
      });
    }
  } catch (error) {
    console.error("Error processing chunk upload:", error);
    return NextResponse.json(
      { 
        error: "Failed to process chunk",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
