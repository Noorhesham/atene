import { useFormContext, useFieldArray } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Trash2, PlusCircle } from "lucide-react";

// --- Type Definitions ---
interface ImageType {
  id: string; // Must be unique for useFieldArray
  file: File;
  preview: string;
  isPrimary: boolean;
  name: string;
}

interface ProductFormData {
  images: ImageType[];
  // Add other form fields as needed
}

// --- Main ImageUploader Component ---
const ImageUploader = ({ name, isMultiple = true }: { name: string; isMultiple?: boolean }) => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  // Using 'update' from useFieldArray for safer state changes
  const { fields, append, remove, update } = useFieldArray({
    control,
    name,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const currentImages = getValues(name) || [];

      if (!isMultiple) {
        // Only allow one image: replace existing images
        const file = acceptedFiles[0];
        if (!file) return;

        // Clean up previous preview URL if exists
        currentImages.forEach((img) => {
          URL.revokeObjectURL(img.preview);
        });

        const newImage: ImageType = {
          id: `${file.name}-${Date.now()}`,
          file,
          preview: URL.createObjectURL(file),
          isPrimary: true,
          name: file.name,
        };

        // Remove all current images and append the new one
        remove();
        append(newImage);
        return;
      }

      // If multiple allowed, proceed as before
      acceptedFiles.forEach((file) => {
        if (currentImages.length + fields.length >= 10) {
          console.warn("Cannot upload more than 10 images.");
          return;
        }

        const isPrimary = currentImages.length === 0 && fields.length === 0;
        const newImage: ImageType = {
          id: `${file.name}-${Date.now()}`,
          file,
          preview: URL.createObjectURL(file),
          isPrimary,
          name: file.name,
        };
        append(newImage);
      });
    },
    [append, getValues, name, fields.length, isMultiple, remove]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg", ".svg"] },
  });

  // --- Memory Leak Cleanup ---
  // This effect cleans up the created object URLs when the component unmounts
  // or when the `fields` array changes.
  useEffect(() => {
    const currentFields = fields;
    return () => {
      // This function runs on cleanup
      currentFields.forEach((field) => {
        // Revoke URLs for fields that are no longer in the array
        if (!fields.find((f) => f.id === field.id)) {
          URL.revokeObjectURL(field.preview);
        }
      });
    };
  }, [fields]);

  // --- Image Management Functions ---
  const setPrimaryImage = (selectedIndex: number) => {
    fields.forEach((field, index) => {
      // Use the 'update' function for safer, more reliable state updates
      update(index, {
        ...field,
        isPrimary: index === selectedIndex,
      });
    });
  };

  const deleteImage = (index: number) => {
    const imageToRemove = fields[index];

    // 1. Revoke URL to prevent memory leaks
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // 2. Check if the deleted image was the primary one
    const wasPrimary = imageToRemove?.isPrimary;

    // 3. Remove the image from the form state
    remove(index);

    // 4. If it was primary and there are images left, set a new primary
    // We need to wait for the state to update, so we check the length *after* removal.
    if (wasPrimary && fields.length > 1) {
      // length will be one less than before
      setPrimaryImage(0); // The new first image becomes primary
    }
  };

  return (
    <div className="space-y-4">
      {/* --- Header --- */}
      {/* <div className="flex justify-between items-center">
        <FormLabel className="text-lg[18px]">الصور</FormLabel>
        <Button variant="link" className="text-sm p-0 h-auto text-main hover:text-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            className="w-5 h-5 mr-2"
          >
            <path
              d="M11.5 3.5C7.022 3.5 4.782 3.5 3.391 4.891C2 6.282 2 8.521 2 13.001C2 17.479 2 19.718 3.391 21.109C4.782 22.5 7.021 22.5 11.5 22.5C15.978 22.5 18.218 22.5 19.609 21.109C21 19.718 21 17.479 21 13C21 11.64 21 10.486 20.961 9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.5 22C8.872 16.775 13.774 9.884 20.998 14.543M14 6.5C14 6.5 15 6.5 16 8.5C16 8.5 19.177 3.5 22 2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          نصائح لإلتقاط صور جيدة
        </Button>
      </div>
      <p className="text-xs text-gray-500">يمكنك إضافة حتى (10) صور و (1) فيديو</p> */}

      {/* --- Image Grid and Uploader --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {fields.map((item, index) => (
          <div key={item.id} className="relative group border rounded-lg overflow-hidden h-full flex flex-col">
            <img src={item.preview} alt={`preview ${index}`} className="w-full h-28 object-cover" />
            <div className="p-2 bg-white border-t flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  // Use a unique name for the radio group to ensure only one can be selected
                  name={`${name}-primary-radio`}
                  id={`primary-${item.id}`}
                  checked={item.isPrimary}
                  onChange={() => setPrimaryImage(index)}
                  className="h-4 w-4 text-main border-gray-300 focus:ring-main"
                />
                <label htmlFor={`primary-${item.id}`} className="text-xs text-main">
                  الصورة الأساسية
                </label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-red-100 p-2 rounded-md text-red-500 hover:text-red-700 hover:bg-red-200"
                onClick={() => deleteImage(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* --- Dropzone Uploader Box --- */}
        {fields.length < 10 && (
          <div
            {...getRootProps()}
            className={`flex flex-col min-h-28 items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : ""
            }`}
          >
            <input {...getInputProps()} />
            <PlusCircle className="w-8 h-8 text-main mb-2" />
            <p className="text-xs text-center text-gray-500">أضف أو اسحب صورة أو فيديو</p>
            <p className="text-xs text-gray-400">png, jpg, svg</p>
          </div>
        )}
      </div>

      {/* --- Error Message Display --- */}
      {/* Correctly access errors using the name prop */}
      {errors[name] && (
        <p className="text-sm font-medium text-red-500">
          {(errors[name] as any).message || (errors[name] as any).root?.message}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
