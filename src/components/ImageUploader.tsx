"use client";

import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void;
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFiles = useCallback((files: FileList) => {
    if (files?.[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPreview(base64String);
          onImageSelect(base64String);
          setTimeout(() => {
            setPreview(null);
          }, 1000);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImageSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging ? 'border-orange-500 bg-orange-500/10' : 'border-gray-600 hover:border-orange-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
          accept="image/*"
        />
        
        <div className="flex flex-col items-center justify-center gap-4">
          {preview ? (
            <div className="relative w-full max-w-md mx-auto">
              <Image
                src={preview}
                alt="Preview"
                width={500}
                height={500}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                <p className="text-white text-sm">Click or drag to change image</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-full bg-orange-500/10">
                <Upload className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-center">
                <p className="text-gray-300 text-lg font-medium">
                  Drop your image here, or click to select
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Supports: JPG, PNG, GIF
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 