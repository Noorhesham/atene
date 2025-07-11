import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, PlusCircle, Settings, Package, UploadCloud, Trash2 } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import FormInput from "@/components/inputs/FormInput";
import { Controller, useFieldArray } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import ModalCustom from "@/components/ModalCustom";
import { v4 as uuidv4 } from "uuid";

interface VariantImage {
  id: string;
  file: File;
  preview: string;
}

interface VariantErrors {
  variants?: {
    [key: number]: {
      color?: { message: string };
      size?: { message: string };
      price?: { message: string };
      images?: { message: string };
    };
  };
}

interface Variant {
  color?: string;
  size?: string;
  price: string;
  images: VariantImage[];
  isActive: boolean;
  [key: string]: string | boolean | VariantImage[] | undefined; // More specific type for dynamic attributes
}

const AddVariantAttributeModal = ({
  onConfirm,
  closeModal,
}: {
  onConfirm: (attributes: string[]) => void;
  closeModal: () => void;
}) => {
  const allAttributes = [
    { id: "color", label: "اللون" },
    { id: "size", label: "المقاس" },
    { id: "material", label: "الخامة" },
    { id: "screen_size", label: "حجم الشاشة" },
    { id: "attr_4", label: "سمة ٤" },
    { id: "attr_5", label: "سمة ٥" },
    { id: "attr_6", label: "سمة ٦" },
  ];

  const { watch } = useFormContext();
  const currentAttributes = watch("variantAttributes") || [];
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(currentAttributes);
  const [otherValue, setOtherValue] = useState("");

  const handleToggle = (id: string) => {
    setSelectedAttributes((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleConfirm = () => {
    let finalAttributes = [...selectedAttributes];
    if (selectedAttributes.includes("other") && otherValue.trim()) {
      finalAttributes = finalAttributes.filter((item) => item !== "other");
      finalAttributes.push(otherValue.trim());
    }
    onConfirm(finalAttributes);
    closeModal();
  };

  return (
    <div className="p-4" dir="rtl">
      <h3 className="text-lg font-bold text-center mb-4">اختر السمات لاستخدامها في الاختلافات</h3>
      <div className="relative mb-4">
        <Input placeholder="ابحث عن سمة" className="pl-10" aria-label="البحث عن سمة" title="البحث عن سمة" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {allAttributes.map((attr) => (
          <div
            key={attr.id}
            className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
              selectedAttributes.includes(attr.id)
                ? "bg-blue-50 border-main"
                : "bg-gray-50 border-transparent hover:bg-gray-100"
            }`}
            onClick={() => handleToggle(attr.id)}
          >
            <input
              type="checkbox"
              checked={selectedAttributes.includes(attr.id)}
              readOnly
              className="form-checkbox h-5 w-5 rounded text-main focus:ring-main"
              aria-label={`اختيار ${attr.label}`}
              title={`اختيار ${attr.label}`}
            />
            <span className="font-medium">{attr.label}</span>
          </div>
        ))}
        <div
          className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
            selectedAttributes.includes("other")
              ? "bg-blue-50 border-main"
              : "bg-gray-50 border-transparent hover:bg-gray-100"
          }`}
          onClick={() => handleToggle("other")}
        >
          <input
            type="checkbox"
            checked={selectedAttributes.includes("other")}
            readOnly
            className="form-checkbox h-5 w-5 rounded text-main focus:ring-main"
          />
          <span className="font-medium">اخرى</span>
        </div>
        {selectedAttributes.includes("other") && (
          <Input
            placeholder="قم بإدخال الصفة في حالة اختيار اخرى"
            className="mt-2"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
          />
        )}
      </div>
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">{selectedAttributes.length} سمات مختارة</p>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={closeModal} className="bg-gray-100">
            إلغاء
          </Button>
          <Button type="button" onClick={handleConfirm} className="bg-main text-white hover:bg-main/90">
            تأكيد
          </Button>
        </div>
      </div>
    </div>
  );
};

const VariantsForm = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasVariations = watch("hasVariations");
  const variantAttributes = watch("variantAttributes") || [];
  const variantErrors = errors as VariantErrors;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleImageUpload = (index: number, files: FileList | null) => {
    if (!files) return;

    const images = Array.from(files).map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
    }));

    const currentVariants = watch("variants") || [];
    const updatedVariants = [...currentVariants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      images,
    };
    setValue("variants", updatedVariants);
  };

  const handleConfirmAttributes = (attributes: string[]) => {
    setValue("variantAttributes", attributes);
    if (fields.length === 0 && attributes.length > 0) {
      // Initialize with empty values for all possible fields
      append({
        color: "",
        size: "",
        price: "",
        images: [],
        isActive: true,
      } as Variant);
    } else if (attributes.length === 0) {
      // Clear all variants if all attributes are removed
      setValue("variants", []);
    } else {
      // Update existing variants to match new attributes
      const currentVariants = watch("variants") || [];
      const updatedVariants = currentVariants.map((variant: Variant) => {
        const newVariant = { ...variant };
        // Remove fields that are no longer in attributes
        if (!attributes.includes("color")) delete newVariant.color;
        if (!attributes.includes("size")) delete newVariant.size;
        return newVariant;
      });
      setValue("variants", updatedVariants);
    }
  };

  const removeVariantAttribute = (attr: string) => {
    const current = watch("variantAttributes") || [];
    handleConfirmAttributes(current.filter((item: string) => item !== attr));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col items-start gap-4">
        <FormLabel className=" text-[18px] text-[#393939]">هل يوجد اختلافات للمنتج</FormLabel>

        <div className="flex items-center gap-4 ml-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasVariations"
              checked={hasVariations}
              onChange={() => setValue("hasVariations", true)}
              className="form-radio h-4 w-4 text-main focus:ring-main"
            />
            نعم
          </label>{" "}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasVariations"
              checked={!hasVariations}
              onChange={() => {
                setValue("hasVariations", false);
                setValue("variants", []);
                setValue("variantAttributes", []);
              }}
              className="form-radio h-4 w-4 text-main focus:ring-main"
            />
            لا
          </label>
        </div>
      </div>

      {!hasVariations && (
        <div className="text-center p-8 border-t">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="p-4 bg-gray-100 rounded-full text-gray-400">
              <Package size={32} />
            </div>
            <div className="p-4 bg-gray-100 rounded-full text-gray-400">
              <Settings size={32} />
            </div>
          </div>
          <p className="text-gray-500">لم يتم اضافة اي سمات بعد!</p>
        </div>
      )}

      {hasVariations && (
        <div className="space-y-4 border-t pt-6">
          <ModalCustom
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            btn={
              <Button
                type="button"
                variant="outline"
                size={"lg"}
                className=" justify-start text-base font-[500] bg-blue-100  w-fit "
              >
                <PlusCircle size={16} className="ml-2" /> إضافة سمة جديدة
              </Button>
            }
            content={
              <AddVariantAttributeModal onConfirm={handleConfirmAttributes} closeModal={() => setIsModalOpen(false)} />
            }
          />

          {variantAttributes.length > 0 && (
            <>
              <div className="flex flex-wrap gap-2 mt-2">
                {variantAttributes.map((attr: string, index: number) => (
                  <div
                    key={index}
                    className="bg-main  text-gray-50 text-sm font-medium pl-2 pr-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {attr === "color" ? "اللون" : attr === "size" ? "المقاس" : attr}
                    <button
                      type="button"
                      title="إزالة السمة"
                      onClick={() => removeVariantAttribute(attr)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex  justify-between items-center">
                <label className="text-[18px] font-[500] text-main">قيم الاختلاف</label>
                <Button
                  type="button"
                  variant="outline"
                  className=" justify-start text-base font-[500] bg-blue-100  w-fit "
                  onClick={() => append({ color: "", size: "", price: "", images: [], isActive: true })}
                >
                  <PlusCircle size={16} className="ml-2" /> قيمة جديدة
                </Button>
              </div>

              <div className="overflow-x-auto">
                <div className="grid grid-cols-[1fr_1fr_100px_150px_120px] gap-4 p-3 bg-[#F9FAFB] rounded-t-lg text-sm font-medium text-[#667085] min-w-[600px]">
                  {variantAttributes.map((attr: string) => (
                    <span key={attr}>{attr === "color" ? "اللون" : attr === "size" ? "المقاس" : attr}</span>
                  ))}
                  <span>السعر</span>
                  <span>الصور</span>
                  <span className="text-left">الاجراءات</span>
                </div>
                <div className="space-y-px min-w-[600px]">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-[1fr_1fr_100px_150px_120px] gap-4 items-center p-3 bg-white border border-[#E7EAEE] last:rounded-b-lg"
                    >
                      {variantAttributes.map((attr: string) => (
                        <div key={attr}>
                          <FormInput
                            name={`variants.${index}.${attr}`}
                            placeholder={attr === "color" ? "اسود" : attr === "size" ? "XL" : attr}
                            error={
                              variantErrors?.variants?.[index]?.[attr as keyof (typeof variantErrors.variants)[number]]
                                ?.message
                            }
                            className="h-10 text-sm placeholder:text-[#667085]"
                          />
                        </div>
                      ))}
                      <div>
                        <div className="relative">
                          <FormInput
                            name={`variants.${index}.price`}
                            type="text"
                            placeholder="150.00"
                            error={variantErrors?.variants?.[index]?.price?.message}
                            className="h-10 text-sm placeholder:text-[#667085]"
                          />
                          <span className="absolute left-3 top-[40%]  text-[#667085]">₪</span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e.target.files)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          aria-label="Upload variant images"
                          title="اختيار صور المنتج المتغير"
                          placeholder="اختر الصور"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-10 flex items-center justify-center bg-white border-[#E7EAEE] text-[#344054] text-sm hover:bg-gray-50"
                          title="قم برفع الصور"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M13 3.002C12.53 3.00067 12.03 3 11.5 3C7.022 3 4.782 3 3.391 4.391C2 5.782 2 8.021 2 12.5C2 16.978 2 19.218 3.391 20.609C4.782 22 7.021 22 11.5 22C15.978 22 18.218 22 19.609 20.609C20.947 19.27 20.998 17.147 20.999 13"
                              stroke="#406896"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M2 14.135C2.62 14.045 3.244 14.001 3.872 14.003C6.524 13.947 9.111 14.773 11.172 16.334C13.082 17.782 14.425 19.774 15 22"
                              stroke="#406896"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M21 16.896C19.825 16.301 18.609 15.999 17.386 16C15.535 15.993 13.702 16.673 12 18M17 4.5C17.491 3.994 18.8 2 19.5 2M19.5 2C20.2 2 21.509 3.994 22 4.5M19.5 2V10"
                              stroke="#406896"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          {watch(`variants.${index}.images`)?.length > 0
                            ? `${watch(`variants.${index}.images`).length} صور`
                            : "قم برفع الصور"}
                        </Button>
                        {watch(`variants.${index}.images`)?.length > 0 && (
                          <div className="absolute top-full left-0 mt-2 bg-white border border-[#E7EAEE] rounded-lg p-2 shadow-lg z-20">
                            <div className="flex gap-2 flex-wrap">
                              {watch(`variants.${index}.images`).map((img: VariantImage) => (
                                <div key={img.id} className="relative w-16 h-16 group">
                                  <img
                                    src={img.preview}
                                    alt="Variant preview"
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentImages = watch(`variants.${index}.images`);
                                      const filteredImages = currentImages.filter((i: VariantImage) => i.id !== img.id);
                                      setValue(`variants.${index}.images`, filteredImages);
                                    }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="حذف الصورة"
                                    title="حذف الصورة"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {variantErrors?.variants?.[index]?.images && (
                          <p className="text-sm text-red-500 mt-1">{variantErrors.variants[index]?.images?.message}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-end gap-3">
                        <Controller
                          name={`variants.${index}.isActive`}
                          control={control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-[#395A7D]"
                              aria-label={`تفعيل/تعطيل المنتج المتغير ${index + 1}`}
                            />
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="حذف المنتج المتغير"
                          aria-label="حذف المنتج المتغير"
                          className="w-8 h-8 text-[#F04438] hover:bg-[#FEE4E2] hover:text-[#D92D20]"
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VariantsForm;
