import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadPreviewProps {
  currentImageUrl?: string;
  onImageSelected: (file: File | null) => void;
  id?: string;
}

export function ImageUploadPreview({ 
  currentImageUrl, 
  onImageSelected,
  id = "image-upload" 
}: ImageUploadPreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Clean up object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onImageSelected(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    onImageSelected(null);
    // Reset file input
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div className="space-y-4">
      <Input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="cursor-pointer"
      />
      
      {(preview || currentImageUrl) && (
        <div className="relative border rounded-lg p-2 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              {file ? 'New Image Preview' : 'Current Image'}
            </span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleClear}
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              {file ? 'Remove' : 'Clear'}
            </Button>
          </div>
          
          <img
            src={preview || currentImageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md border"
          />
          
          {file && (
            <div className="mt-2 text-xs text-gray-500">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
