// File upload hook for Node.js backend
import { useMutation } from '@tanstack/react-query';

export const useFileUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      console.log('Uploading file to backend:', file.name);
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      
      return { 
        url: data.imageUrl || data.url || data.filePath 
      };
    },
  });
};
