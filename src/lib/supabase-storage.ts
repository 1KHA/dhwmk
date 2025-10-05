import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default bucket name - make sure this bucket exists in your Supabase project
const DEFAULT_BUCKET = 'uploads';

// Lazy-initialize Supabase client only when needed
function getSupabaseClient(): SupabaseClient {
  // Check for environment variables in various formats
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Supabase URL is not defined in environment variables. Please set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.');
  }

  if (!supabaseKey) {
    throw new Error('Supabase service role key is not defined in environment variables. Please set SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Uploads a file to Supabase storage
 * @param file The file to upload
 * @param filename The name to save the file as
 * @param folder Optional folder path to organize files (e.g., 'teams', 'milestones')
 * @returns The URL of the uploaded file
 */
export async function uploadToStorage(file: File | Buffer, filename: string, folder: string = ''): Promise<string> {
  try {
    // Initialize Supabase client when the function is called
    const supabase = getSupabaseClient();
    
    // Create a path with folder if provided
    const path = folder ? `${folder}/${filename}` : filename;
    
    // Convert file to appropriate format for Supabase
    let fileData: File | Blob | ArrayBuffer;
    
    if (Buffer.isBuffer(file)) {
      // Convert Buffer to Blob for Supabase storage
      fileData = new Blob([new Uint8Array(file)]);
    } else {
      // If it's already a File (which extends Blob), use it directly
      fileData = file;
    }
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .upload(path, fileData, {
        upsert: false, // Don't overwrite if exists (consistent with Vercel blob behavior)
        contentType: getContentType(filename), // Try to determine content type
      });
    
    if (error) {
      console.error('Error uploading to Supabase storage:', error);
      throw new Error(`Failed to upload file to storage: ${error.message}`);
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(DEFAULT_BUCKET)
      .getPublicUrl(path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase storage:', error);
    throw new Error('Failed to upload file to storage');
  }
}

/**
 * Lists all files in a folder in the storage
 * @param folder The folder to list files from
 * @returns Array of storage objects
 */
export async function listStorageFiles(folder: string = '') {
  try {
    // Initialize Supabase client when the function is called
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .list(folder);
    
    if (error) {
      console.error('Error listing storage files:', error);
      throw new Error(`Failed to list files from storage: ${error.message}`);
    }
    
    // Map to a format similar to the one used by Vercel blob
    return data.map(item => {
      const { data: { publicUrl } } = supabase.storage
        .from(DEFAULT_BUCKET)
        .getPublicUrl(`${folder}/${item.name}`);
      
      return {
        url: publicUrl,
        pathname: `${folder}/${item.name}`,
        size: item.metadata?.size,
        uploadedAt: new Date(item.created_at || Date.now()).toISOString(),
      };
    });
  } catch (error) {
    console.error('Error listing storage files:', error);
    throw new Error('Failed to list files from storage');
  }
}

/**
 * Deletes a file from the storage
 * @param url The URL or path of the file to delete
 */
export async function deleteFromStorage(url: string) {
  try {
    // Initialize Supabase client when the function is called
    const supabase = getSupabaseClient();
    
    // Extract path from URL
    const path = extractPathFromUrl(url);
    
    if (!path) {
      throw new Error('Invalid URL format');
    }
    
    // Delete from storage
    const { error } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting from storage:', error);
      throw new Error(`Failed to delete file from storage: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting from storage:', error);
    throw new Error('Failed to delete file from storage');
  }
}

/**
 * Extract the file path from a Supabase URL
 * @param url The URL of the file
 * @returns The path of the file
 */
function extractPathFromUrl(url: string): string | null {
  try {
    // Check if it's already a path
    if (!url.startsWith('http')) {
      return url;
    }
    
    // Parse the URL
    const urlObj = new URL(url);
    
    // Get the pathname
    const pathname = urlObj.pathname;
    
    // Remove the bucket name and '/object/' prefix if present
    const regex = new RegExp(`/storage/v1/object/public/${DEFAULT_BUCKET}/(.+)`);
    const match = pathname.match(regex);
    
    if (match && match[1]) {
      return match[1];
    }
    
    // Alternative format
    const altRegex = new RegExp(`/storage/v1/object/${DEFAULT_BUCKET}/(.+)`);
    const altMatch = pathname.match(altRegex);
    
    if (altMatch && altMatch[1]) {
      return altMatch[1];
    }
    
    // If we can't parse it, just use the pathname
    return pathname.startsWith('/') ? pathname.substring(1) : pathname;
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return null;
  }
}

/**
 * Helper function to determine content type based on filename
 * @param filename The name of the file
 * @returns The content type
 */
function getContentType(filename: string): string | undefined {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (!ext) return undefined;
  
  const contentTypeMap: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'zip': 'application/zip',
    'rar': 'application/vnd.rar',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
  };
  
  return contentTypeMap[ext];
}
