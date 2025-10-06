import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client using anon key (safe for browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file directly to Supabase Storage from the browser
 * @param file The file to upload
 * @param folder The folder to upload to (e.g., 'milestones')
 * @returns Object containing the file path and public URL
 */
export async function uploadFileToSupabase(
  file: File,
  folder: string = 'milestones'
): Promise<{ filePath: string; publicUrl: string }> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`فشل رفع الملف: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return {
      filePath: data.path,
      publicUrl
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param filePath The path of the file to delete
 */
export async function deleteFileFromSupabase(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('uploads')
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`فشل حذف الملف: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
