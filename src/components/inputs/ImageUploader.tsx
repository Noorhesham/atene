import { useFormContext } from "react-hook-form";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, CheckCircle, Circle, Trash2 } from "lucide-react";
import { API_ENDPOINTS, FetchFunction } from "@/constants/api";
const ImagePreview = ({ image, onRemove, onSetPrimary, isPrimary }) => (
  <div className="relative group w-[200px] border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
    <img
      src={image.preview}
      alt="Uploaded preview"
      width={200}
      height={109}
      className="w-full h-[109px] object-cover"
    />
    <div className="p-2 bg-white flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button onClick={onSetPrimary} className="text-gray-600">
          {isPrimary ? <CheckCircle className="w-5 h-5 text-blue-600" /> : <Circle className="w-5 h-5 text-gray-400" />}
        </button>
        <span className="text-sm font-medium text-gray-700">الصورة الاساسية</span>
      </div>
      <button
        onClick={onRemove}
        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);
interface ImageUploaderProps {
  name: string;
  previewName?: string; // Optional name for preview URL field
  className?: string;
  multiple?: boolean; // Support for multiple images
  maxFiles?: number; // Maximum number of files when multiple is true
}

interface MediaResponse {
  status: boolean;
  message: string;
  data: {
    url: string;
    src: string;
    file_name: string;
    title: string;
  };
}

const ImageUploader = ({
  name,
  previewName = `${name}_preview`,
  className = "",
  multiple = false,
  maxFiles = 10,
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // Watch the current value and preview
  const currentValue = watch(name);
  const previewUrl = watch(previewName);

  // Handle different data structures for single vs multiple
  const currentImages = multiple
    ? Array.isArray(currentValue)
      ? currentValue
      : []
    : currentValue
    ? [{ file_name: "single", preview: currentValue, isPrimary: true }]
    : [];

  const uploadToMediaCenter = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "gallery");

    try {
      const response = await FetchFunction<MediaResponse>(`${API_ENDPOINTS.MEDIA_CENTER}/add-new`, "POST", formData);

      if (response.status) {
        return { url: response.data.url, file_name: response.data.file_name };
      }
      throw new Error(response.message);
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setIsUploading(true);

      try {
        if (multiple) {
          // Handle multiple images
          const uploadPromises = acceptedFiles.map(async (file, index) => {
            const { url, file_name } = await uploadToMediaCenter(file);
            return {
              file_name: file_name,
              preview: url,
              isPrimary: currentImages.length === 0 && index === 0, // First image is primary if no images exist
            };
          });

          const newImages = await Promise.all(uploadPromises);
          const updatedImages = [...currentImages, ...newImages];

          // Limit to maxFiles
          const limitedImages = updatedImages.slice(0, maxFiles);
          setValue(name, limitedImages, { shouldValidate: true });
        } else {
          // Handle single image
          const file = acceptedFiles[0];
          const { url } = await uploadToMediaCenter(file);
          setValue(name, url, { shouldValidate: true });
          setValue(previewName, url, { shouldValidate: true });
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [setValue, name, previewName, multiple, currentImages, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    maxFiles: multiple ? maxFiles : 1,
    multiple,
  });

  const handleRemove = (imageIndex?: number) => {
    if (multiple && typeof imageIndex === "number") {
      // Remove specific image from array
      const updatedImages = currentImages.filter((_, index) => index !== imageIndex);
      setValue(name, updatedImages, { shouldValidate: true });
    } else {
      // Remove single image
      setValue(name, "", { shouldValidate: true });
      setValue(previewName, "", { shouldValidate: true });
    }
  };

  const handleSetPrimary = (imageIndex: number) => {
    if (multiple) {
      const updatedImages = currentImages.map((img, index) => ({
        ...img,
        isPrimary: index === imageIndex,
      }));
      setValue(name, updatedImages, { shouldValidate: true });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {multiple ? (
        /* Multiple Images Mode */
        <div className="space-y-4">
          {/* Existing Images Grid */}
          {currentImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentImages.map((image, index) => (
                <ImagePreview
                  key={image.file_name || index}
                  image={image}
                  isPrimary={image.isPrimary}
                  onRemove={() => handleRemove(index)}
                  onSetPrimary={() => handleSetPrimary(index)}
                />
              ))}
            </div>
          )}

          {/* Add More Images Dropzone */}
          {currentImages.length < maxFiles && (
            <div
              {...getRootProps()}
              className={`flex flex-col h-32 items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
                isDragActive ? "border-blue-500 bg-blue-50" : ""
              }`}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-sm text-center text-gray-500">
                    إضافة المزيد من الصور ({currentImages.length}/{maxFiles})
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Single Image Mode */
        <div>
          {previewUrl ? (
            <div className="relative group border w-48 rounded-lg overflow-hidden">
              <img src={previewUrl} alt="Uploaded preview" className="w-48 h-48 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-white hover:bg-gray-100"
                  onClick={() => handleRemove()}
                >
                  تغيير الصورة
                </Button>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`flex flex-col h-48 items-center justify-center w-56 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#F8F8F8] hover:bg-gray-100 transition-colors ${
                isDragActive ? "border-blue-500 bg-blue-50" : ""
              }`}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="43" viewBox="0 0 44 43" fill="none">
                    <path
                      d="M22.0002 14.3335V28.6668M29.1668 21.5002H14.8335M39.9168 21.5002C39.9168 11.6048 31.8955 3.5835 22.0002 3.5835C12.1048 3.5835 4.0835 11.6048 4.0835 21.5002C4.0835 31.3955 12.1048 39.4168 22.0002 39.4168C31.8955 39.4168 39.9168 31.3955 39.9168 21.5002Z"
                      stroke="#8E8E8E"
                      stroke-width="2.6875"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p className="text-sm text-center text-gray-500"> اضف او اسحب صورة او فيديو </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {errors[name] && <p className="text-sm font-medium text-red-500">{errors[name]?.message as string}</p>}
    </div>
  );
};

export default ImageUploader;
