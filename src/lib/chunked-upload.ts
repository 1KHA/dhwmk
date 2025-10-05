/**
 * Chunked File Upload Utility
 * 
 * This utility handles breaking large files into smaller chunks,
 * uploading them sequentially, and tracking progress.
 */

// Default chunk size: 5MB (smaller chunks are less likely to trigger 413 errors)
export const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Type definitions for chunked upload
export interface ChunkMetadata {
  id: string;         // Unique ID for the upload session
  filename: string;   // Original filename
  chunkIndex: number; // Index of this chunk (0-based)
  totalChunks: number; // Total number of chunks
  size: number;       // Size of the entire file in bytes
  mimeType: string;   // MIME type of the file
}

export interface UploadProgressInfo {
  uploadedChunks: number;
  totalChunks: number;
  uploadedBytes: number;
  totalBytes: number;
  percentComplete: number;
  currentChunkIndex: number;
}

export interface ChunkedUploadOptions {
  file: File;
  endpoint: string;  // API endpoint for chunk upload
  chunkSize?: number; // Optional custom chunk size
  additionalData?: Record<string, string>; // Additional form data to include
  onProgress?: (progress: UploadProgressInfo) => void;
  onError?: (error: Error, chunkIndex?: number) => void;
  onComplete?: (result: any) => void;
  retryAttempts?: number;
  sessionId?: string; // Optional existing session ID for resuming
}

/**
 * Split a file into chunks of specified size
 */
function splitFileIntoChunks(file: File, chunkSize: number = DEFAULT_CHUNK_SIZE): Blob[] {
  const chunks: Blob[] = [];
  let currentPosition = 0;
  
  while (currentPosition < file.size) {
    const endPosition = Math.min(currentPosition + chunkSize, file.size);
    chunks.push(file.slice(currentPosition, endPosition));
    currentPosition = endPosition;
  }
  
  return chunks;
}

/**
 * Generate a unique ID for the upload session
 */
function generateUploadId(): string {
  return `upload-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Upload a single chunk to the server
 */
async function uploadChunk(
  chunk: Blob, 
  metadata: ChunkMetadata, 
  endpoint: string,
  additionalData?: Record<string, string>,
  retryAttempt: number = 0,
  maxRetries: number = 3
): Promise<Response> {
  try {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('metadata', JSON.stringify(metadata));
    
    // Add any additional data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload chunk ${metadata.chunkIndex}. Server responded with ${response.status}: ${errorText}`);
    }
    
    return response;
  } catch (error) {
    // Retry logic for transient errors
    if (retryAttempt < maxRetries) {
      console.log(`Retrying chunk ${metadata.chunkIndex}, attempt ${retryAttempt + 1} of ${maxRetries}`);
      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = Math.pow(2, retryAttempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return uploadChunk(chunk, metadata, endpoint, additionalData, retryAttempt + 1, maxRetries);
    } else {
      throw error;
    }
  }
}

/**
 * Start or resume a chunked upload
 */
export async function startChunkedUpload(options: ChunkedUploadOptions): Promise<any> {
  const {
    file,
    endpoint,
    chunkSize = DEFAULT_CHUNK_SIZE,
    additionalData,
    onProgress,
    onError,
    onComplete,
    retryAttempts = 3,
    sessionId
  } = options;
  
  try {
    // Split file into chunks
    const chunks = splitFileIntoChunks(file, chunkSize);
    const totalChunks = chunks.length;
    const uploadId = sessionId || generateUploadId();
    
    // Initialize progress tracking
    let uploadedBytes = 0;
    let uploadedChunks = 0;
    
    // Upload chunks sequentially
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const metadata: ChunkMetadata = {
        id: uploadId,
        filename: file.name,
        chunkIndex: i,
        totalChunks,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
      };
      
      try {
        // Upload the chunk
        const response = await uploadChunk(
          chunk,
          metadata,
          endpoint,
          additionalData,
          0,
          retryAttempts
        );
        
        // Update progress
        uploadedBytes += chunk.size;
        uploadedChunks++;
        
        if (onProgress) {
          onProgress({
            uploadedChunks,
            totalChunks,
            uploadedBytes,
            totalBytes: file.size,
            percentComplete: Math.round((uploadedBytes / file.size) * 100),
            currentChunkIndex: i,
          });
        }
        
        // If this is the last chunk, parse the final result
        if (i === chunks.length - 1) {
          const result = await response.json();
          if (onComplete) {
            onComplete(result);
          }
          return result;
        }
      } catch (error) {
        // Call error callback with chunk index
        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)), i);
        }
        // Re-throw to stop the upload process
        throw error;
      }
    }
  } catch (error) {
    // Call error callback for general errors
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
    throw error;
  }
}

/**
 * Creates a new chunked upload session and uploads the first chunk
 */
export async function initiateChunkedUpload(
  file: File,
  endpoint: string,
  additionalData?: Record<string, string>
): Promise<{ sessionId: string; totalChunks: number }> {
  // Create a single chunk for initialization
  const chunks = splitFileIntoChunks(file);
  const uploadId = generateUploadId();
  const firstChunk = chunks[0];
  
  const metadata: ChunkMetadata = {
    id: uploadId,
    filename: file.name,
    chunkIndex: 0,
    totalChunks: chunks.length,
    size: file.size,
    mimeType: file.type || 'application/octet-stream',
  };
  
  // Upload first chunk to initiate the session
  await uploadChunk(firstChunk, metadata, endpoint, additionalData);
  
  return {
    sessionId: uploadId,
    totalChunks: chunks.length,
  };
}

/**
 * Resume a chunked upload from a specific chunk index
 */
export async function resumeChunkedUpload(
  options: ChunkedUploadOptions & { startFromChunk: number }
): Promise<any> {
  const { file, startFromChunk, ...restOptions } = options;
  
  try {
    // Split file into chunks
    const chunks = splitFileIntoChunks(file, options.chunkSize || DEFAULT_CHUNK_SIZE);
    const totalChunks = chunks.length;
    const uploadId = options.sessionId || generateUploadId();
    
    // Initialize progress tracking
    let uploadedBytes = 0;
    let uploadedChunks = 0;
    
    // Calculate already uploaded bytes for progress reporting
    for (let i = 0; i < startFromChunk; i++) {
      if (i < chunks.length) {
        uploadedBytes += chunks[i].size;
        uploadedChunks++;
      }
    }
    
    // Resume uploading from the specified chunk
    for (let i = startFromChunk; i < chunks.length; i++) {
      const chunk = chunks[i];
      const metadata: ChunkMetadata = {
        id: uploadId,
        filename: file.name,
        chunkIndex: i,
        totalChunks,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
      };
      
      try {
        // Upload the chunk
        const response = await uploadChunk(
          chunk,
          metadata,
          options.endpoint,
          options.additionalData,
          0,
          options.retryAttempts
        );
        
        // Update progress
        uploadedBytes += chunk.size;
        uploadedChunks++;
        
        if (options.onProgress) {
          options.onProgress({
            uploadedChunks,
            totalChunks,
            uploadedBytes,
            totalBytes: file.size,
            percentComplete: Math.round((uploadedBytes / file.size) * 100),
            currentChunkIndex: i,
          });
        }
        
        // If this is the last chunk, parse the final result
        if (i === chunks.length - 1) {
          const result = await response.json();
          if (options.onComplete) {
            options.onComplete(result);
          }
          return result;
        }
      } catch (error) {
        // Call error callback with chunk index
        if (options.onError) {
          options.onError(error instanceof Error ? error : new Error(String(error)), i);
        }
        // Re-throw to stop the upload process
        throw error;
      }
    }
  } catch (error) {
    // Call error callback for general errors
    if (options.onError) {
      options.onError(error instanceof Error ? error : new Error(String(error)));
    }
    throw error;
  }
}

/**
 * Helper function to check if a file requires chunked upload
 * based on file size threshold
 */
export function shouldUseChunkedUpload(file: File, sizeThreshold: number = DEFAULT_CHUNK_SIZE): boolean {
  return file.size > sizeThreshold;
}
