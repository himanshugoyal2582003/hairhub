'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CloudinaryUploadResult } from '@/types';
import { api } from '@/lib/api';

interface ImageUploaderProps {
  onUploadComplete: (results: CloudinaryUploadResult[]) => void;
  maxFiles?: number;
  className?: string;
}

interface UploadedImage extends CloudinaryUploadResult {
  preview: string;
  uploading?: boolean;
}

export default function ImageUploader({ onUploadComplete, maxFiles = 5, className }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<CloudinaryUploadResult> => {
    return api.upload.single(file);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    const newPreviews: UploadedImage[] = acceptedFiles.map((file) => ({
      url: '',
      publicId: '',
      preview: URL.createObjectURL(file),
      uploading: true,
    }));

    setImages((prev) => [...prev, ...newPreviews]);

    const results: CloudinaryUploadResult[] = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      try {
        const result = await uploadFile(acceptedFiles[i]);
        results.push(result);
        setImages((prev) =>
          prev.map((img, idx) =>
            idx === images.length + i
              ? { ...img, url: result.url, publicId: result.publicId, uploading: false }
              : img
          )
        );
      } catch {
        setImages((prev) =>
          prev.filter((_, idx) => idx !== images.length + i)
        );
      }
    }

    setUploading(false);
    onUploadComplete([...images.filter((i) => !i.uploading), ...results]);
  }, [images, maxFiles, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: maxFiles - images.length,
    disabled: images.length >= maxFiles || uploading,
  });

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      onUploadComplete(updated.filter((i) => !i.uploading));
      return updated;
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop zone */}
      {images.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', isDragActive ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-slate-100 dark:bg-slate-800')}>
              {uploading ? (
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {isDragActive ? 'Drop images here…' : 'Drag & drop images or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                JPG, PNG, WebP &bull; Max {maxFiles} photos &bull; {images.length}/{maxFiles} uploaded
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 group">
              <Image
                src={img.preview}
                alt={`Upload ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              {img.uploading ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-blue-600 text-white">
                  Main
                </span>
              )}
            </div>
          ))}

          {images.length < maxFiles && (
            <div
              {...getRootProps()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
            >
              <input {...getInputProps()} />
              <ImagePlus className="w-5 h-5 text-slate-400" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
