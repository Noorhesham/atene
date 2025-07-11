import { useFormContext } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Pencil, Trash2, PlusCircle, GripVertical } from "lucide-react";

interface ImageType {
  id: string;
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface ProductFormData {
  images: ImageType[];
}

const ImageUploader = () => {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ProductFormData>();
  const { fields, append, remove, update } = useFieldArray({ control, name: "images" });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const currentImages = getValues("images") || [];
      acceptedFiles.forEach((file) => {
        const isPrimary = currentImages.length === 0;
        const newImage = {
          id: `${file.name}-${Date.now()}`,
          file,
          preview: URL.createObjectURL(file),
          isPrimary,
        };
        append(newImage);
      });
    },
    [append, getValues]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg", ".svg"] },
  });

  const setPrimaryImage = (index: number) => {
    const currentImages = getValues("images");
    const updatedImages = currentImages.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const deleteImage = (index: number) => {
    const wasPrimary = fields[index].isPrimary;
    remove(index);
    // If the deleted image was primary, make the new first image primary
    const remainingImages = getValues("images");
    if (wasPrimary && remainingImages.length > 0) {
      setPrimaryImage(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel className="text-lg[18px]">الصور</FormLabel>
        <Button variant="link" className="text-sm p-0 h-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path
              d="M11.5 3.5C7.022 3.5 4.782 3.5 3.391 4.891C2 6.282 2 8.521 2 13.001C2 17.479 2 19.718 3.391 21.109C4.782 22.5 7.021 22.5 11.5 22.5C15.978 22.5 18.218 22.5 19.609 21.109C21 19.718 21 17.479 21 13C21 11.64 21 10.486 20.961 9.5"
              stroke="#406896"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.5 22C8.872 16.775 13.774 9.884 20.998 14.543M14 6.5C14 6.5 15 6.5 16 8.5C16 8.5 19.177 3.5 22 2.5"
              stroke="#406896"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>{" "}
          نصائح لإلتقاط صور جيدة
        </Button>
      </div>
      <p className="text-xs text-gray-500">يمكنك إضافة حتى (10) صور و (1) فيديو</p>

      <div className="p-4 bg-blue-50 border  border-blue-200 rounded-lg text-main text-sm flex items-center gap-2">
        <GripVertical className="w-5 h-5" />
        يمكنك سحب و افلات الصورة لإعادة ترتيب الصور
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {fields.map((item, index) => (
          <div key={item.id} className="relative group border rounded-lg overflow-hidden">
            <img src={item.preview} alt={`preview ${index}`} className="w-full h-28 object-cover" />
            <div className="p-2 bg-white border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="primaryImage"
                  id={`primary-${item.id}`}
                  checked={item.isPrimary}
                  onChange={() => setPrimaryImage(index)}
                  className="h-4 w-4 !text-main border-gray-300 focus:ring-main"
                />
                <label htmlFor={`primary-${item.id}`} className="text-xs text-main">
                  الصورة الأساسية
                </label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-red-200 p-2  rounded-md text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => deleteImage(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        <div
          {...getRootProps()}
          className={`flex flex-col  min-h-28   items-center justify-center w-full  h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : ""
          }`}
        >
          <input {...getInputProps()} />
          <PlusCircle className="w-8 h-8 text-main mb-2" />
          <p className="text-xs text-center text-gray-500">أضف أو اسحب صورة أو فيديو</p>
          <p className="text-xs text-gray-400">png, jpg, svg</p>
        </div>
      </div>
      {errors.images && (
        <p className="text-sm font-medium text-red-500">{errors.images.message || errors.images.root?.message}</p>
      )}
    </div>
  );
};

export default ImageUploader;
