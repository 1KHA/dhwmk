import { put, list, del } from '@vercel/blob';

/**
 * Uploads a file to the blob storage
 * @param file The file to upload
 * @param folder Optional folder path to organize files (e.g., 'teams', 'milestones')
 * @returns The URL of the uploaded file
 */
export async function uploadToBlob(file: File | Buffer, filename: string, folder: string = ''): Promise<string> {
  try {
    // Create a path with folder if provided
    const path = folder ? `${folder}/${filename}` : filename;
    
    // If file is a Buffer, we need to convert it to a Blob
    let blob: Blob;
    if (Buffer.isBuffer(file)) {
      // Convert Buffer to Uint8Array which is a valid BlobPart
      blob = new Blob([new Uint8Array(file)]);
    } else {
      // If it's already a File (which extends Blob), use it directly
      blob = file;
    }
    
    // Upload to blob storage
    const { url } = await put(path, blob, {
      access: 'public',
    });
    
    return url;
  } catch (error) {
    console.error('Error uploading to blob storage:', error);
    throw new Error('Failed to upload file to blob storage');
  }
}

/**
 * Lists all files in a folder in the blob storage
 * @param folder The folder to list files from
 * @returns Array of blob objects
 */
export async function listBlobFiles(folder: string = '') {
  try {
    const { blobs } = await list({ prefix: folder });
    return blobs;
  } catch (error) {
    console.error('Error listing blob files:', error);
    throw new Error('Failed to list files from blob storage');
  }
}

/**
 * Deletes a file from the blob storage
 * @param url The URL of the file to delete
 */
export async function deleteFromBlob(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting from blob storage:', error);
    throw new Error('Failed to delete file from blob storage');
  }
}
