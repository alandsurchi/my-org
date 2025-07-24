import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, bucket: string = 'dashboard-images'): Promise<string | null> => {
    try {
      setUploading(true);
      console.log('📤 Uploading file:', file.name);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      // Upload to our backend API instead of Supabase
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      
      console.log('✅ File uploaded successfully:', url);
      
      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully",
      });

      return url;
    } catch (error) {
      console.error('🔴 Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting file:', filePath);

      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      console.log('✅ File deleted successfully');
      
      toast({
        title: "Delete successful",
        description: "File has been deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('🔴 Delete error:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
  };
};
