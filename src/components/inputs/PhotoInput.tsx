"use client";

import { useFormContext } from "react-hook-form";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";

export const PhotoInput = ({
  name,
  single = false,
  mediaType = "image",
}: {
  name: string;
  single?: boolean;
  mediaType?: "image" | "video";
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);

  // Determine if we should store as single string based on prop or field name
  const shouldStoreSingle = single || name === "photo" || name === "background";

  // Get current value from form
  const watchedValue = watch(name);

  // Normalize current images
  let currentImages: string[] = [];

  if (Array.isArray(watchedValue)) {
    currentImages = watchedValue;
  } else if (typeof watchedValue === "string" && watchedValue) {
    currentImages = [watchedValue];
  }
  console.log(watchedValue);
  const handleUpload = useCallback(
    async (files: FileList) => {
      try {
        setIsUploading(true);
        setValue("isUploading", true);

        const uploadPromises = Array.from(files).map(file);

        const results = await Promise.all(uploadPromises);
        const newImages = results.map((res) => res.url);

        if (shouldStoreSingle) {
          setValue(name, newImages[0]); // Store single image
        } else {
          setValue(name, [...currentImages, ...newImages]); // Append new images to array
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
        setValue("isUploading", false);
      }
    },
    [currentImages, name, setValue, shouldStoreSingle]
  );

  const handleDelete = (url: string) => {
    const filteredImages = currentImages.filter((imgUrl) => imgUrl !== url);
    setValue(name, shouldStoreSingle ? filteredImages[0] || "" : filteredImages);
  };

  return (
    <div className="space-y-4 w-full">
      <Input
        type="file"
        multiple={!shouldStoreSingle}
        accept={mediaType === "image" ? "image/*" : "video/*"}
        disabled={isUploading}
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
        className="cursor-pointer"
      />

      <div className="grid grid-cols-3 gap-4">
        {currentImages.length > 0 &&
          currentImages.map((url, index) => (
            <div key={url + index} className="relative w-full h-44 group">
              {mediaType === "image" ? (
                <img src={url} alt={`Upload ${index + 1}`} className="rounded-lg w-full object-cover aspect-square" />
              ) : (
                <video controls src={url} className="max-w-full h-full  absolute inset-0 object-cover rounded" />
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(url)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
      </div>

      {isUploading && <p className="text-sm text-muted-foreground">Uploading images...</p>}
    </div>
  );
};
