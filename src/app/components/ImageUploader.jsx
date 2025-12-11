'use client';
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

// IMPORTANT: Replace with your Cloudinary details
const CLOUDINARY_CLOUD_NAME = "your_cloud_name";
const CLOUDINARY_UPLOAD_PRESET = "your_upload_preset";

export default function ImageUploader({ onUploadComplete, uploadedImages, onRemoveImage, maxFiles = 5, uploaderId = "image-uploader" }) {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleFiles = useCallback(async (files) => {
        if (uploadedImages.length + files.length > maxFiles) {
            toast.error(`You can only upload a maximum of ${maxFiles} files.`);
            return;
        }

        setIsUploading(true);
        const uploadPromises = Array.from(files).map(file => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            return fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            }).then(res => res.json());
        });

        try {
            const results = await Promise.all(uploadPromises);
            const urls = results.map(result => result.secure_url).filter(Boolean);
            onUploadComplete(urls);
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Image upload failed. Please check your Cloudinary settings and try again.");
        } finally {
            setIsUploading(false);
        }
    }, [maxFiles, onUploadComplete, uploadedImages.length]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    return (
        <div className="space-y-4">
            <div 
                onDragEnter={handleDrag} 
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    id={uploaderId}
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />
                <label htmlFor={uploaderId} className="cursor-pointer">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </label>
                 {isUploading && (
                    <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Uploading...</span>
                    </div>
                )}
            </div>
           
            {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {uploadedImages.map((url, index) => (
                        <div key={index} className="relative aspect-square group">
                            <img src={url} alt={`Uploaded preview ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-sm" />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onRemoveImage(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}