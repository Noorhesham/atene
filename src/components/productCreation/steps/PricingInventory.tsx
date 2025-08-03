import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, PlusCircle, Settings, Package, Trash2 } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import FormInput from "@/components/inputs/FormInput";
import { Controller, useFieldArray } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import ModalCustom from "@/components/ModalCustom";
import { useAuth } from "@/context/AuthContext";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import Loader from "@/components/Loader";

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
  images: string[]; // Changed to string[] to be compatible with FormInput
  isActive: boolean;
  [key: string]: string | boolean | string[] | undefined; // More specific type for dynamic attributes
}

const AddVariantAttributeModal = ({
  onConfirm,
  closeModal,
}: {
  onConfirm: (attributes: string[]) => void;
  closeModal: () => void;
}) => {
  const { data: attributes, isLoading: isLoadingAttributes } = useAdminEntityQuery("attributes");
  console.log(attributes);

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
  if (isLoadingAttributes) return <Loader />;
  return (
    <div className="p-4" dir="rtl">
      <h3 className="text-lg font-bold text-center mb-4">اختر السمات لاستخدامها في الاختلافات</h3>
      <div className="relative mb-4">
        <Input placeholder="ابحث عن سمة" className="pl-10" aria-label="البحث عن سمة" title="البحث عن سمة" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {attributes.map((attr) => (
          <div
            key={attr.id}
            className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
              selectedAttributes.includes(attr.id.toString())
                ? "bg-blue-50 border-main"
                : "bg-gray-50 border-transparent hover:bg-gray-100"
            }`}
            onClick={() => handleToggle(attr.id.toString())}
          >
            <input
              type="checkbox"
              checked={selectedAttributes.includes(attr.id.toString())}
              readOnly
              className="form-checkbox h-5 w-5 rounded text-main focus:ring-main"
              aria-label={`اختيار ${attr.id}`}
              title={`اختيار ${attr.title}`}
            />
            <span className="font-medium">{attr.title}</span>
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
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasVariations = watch("hasVariations");
  const variantAttributes = watch("variantAttributes") || [];
  const variantErrors = errors as VariantErrors;

  // Get attributes data for select options
  const { data: attributes = [], isLoading: isLoadingAttributes } = useAdminEntityQuery("attributes");

  // Check if user is admin to show status field
  const isAdmin = user?.user?.user_type === "admin";

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Show loading state if attributes are still loading
  if (isLoadingAttributes) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-center items-center h-32">
          <Loader />
        </div>
      </div>
    );
  }

  const handleConfirmAttributes = (attributes: string[]) => {
    setValue("variantAttributes", attributes);
    if (fields.length === 0 && attributes.length > 0) {
      // Initialize with empty values for all possible fields
      append({
        color: "",
        size: "",
        price: "",
        images: [] as string[],
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
        // Ensure images is always an array
        if (!Array.isArray(newVariant.images)) {
          newVariant.images = [];
        }
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
  console.log("PricingInventory debugging:", {
    variantAttributes,
    attributes,
    attributesLength: attributes.length,
    firstAttribute: attributes[0],
    firstAttributeOptions: attributes[0]?.options,
  });

  // Debug variant attributes with titles
  const variantAttributesWithTitles = variantAttributes.map((attr: string) => {
    const attribute = attributes.find((attrData: any) => attrData.id.toString() === attr);
    return {
      id: attr,
      title: attribute?.title || attr,
      attribute,
    };
  });
  console.log("Variant attributes with titles:", variantAttributesWithTitles);
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
                {variantAttributes.map((attr: string, index: number) => {
                  // Find the attribute title from the attributes data
                  const attribute = attributes.find((attrData: any) => attrData.id.toString() === attr);
                  const attributeTitle = attribute?.title || attr;

                  return (
                    <div
                      key={index}
                      className="bg-main  text-gray-50 text-sm font-medium pl-2 pr-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {attributeTitle}
                      <button
                        type="button"
                        title="إزالة السمة"
                        onClick={() => removeVariantAttribute(attr)}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex  justify-between items-center">
                <label className="text-[18px] font-[500] text-main">قيم الاختلاف</label>
                <Button
                  type="button"
                  variant="outline"
                  className=" justify-start text-base font-[500] bg-blue-100  w-fit "
                  onClick={() => append({ color: "", size: "", price: "", images: [] as string[], isActive: true })}
                >
                  <PlusCircle size={16} className="ml-2" /> قيمة جديدة
                </Button>
              </div>

              <div className="overflow-x-auto">
                <div
                  className={`grid ${
                    isAdmin ? "grid-cols-[1fr_1fr_100px_150px_120px_80px]" : "grid-cols-[1fr_1fr_100px_150px_120px]"
                  } gap-4 p-3 bg-[#F9FAFB] rounded-t-lg text-sm font-medium text-[#667085] min-w-[600px]`}
                >
                  {variantAttributes.map((attr: string) => {
                    // Find the attribute title from the attributes data
                    const attribute = attributes.find((attrData: any) => attrData.id.toString() === attr);
                    const attributeTitle = attribute?.title || attr;

                    return <span key={attr}>{attributeTitle}</span>;
                  })}
                  <span>السعر</span>
                  <span>الصور</span>
                  {isAdmin && <span>الحالة</span>}
                  <span className="text-left">الاجراءات</span>
                </div>
                <div className="space-y-px min-w-[600px]">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`grid ${
                        isAdmin ? "grid-cols-[1fr_1fr_100px_150px_120px_80px]" : "grid-cols-[1fr_1fr_100px_150px_120px]"
                      } gap-4 items-center p-3 bg-white border border-[#E7EAEE] last:rounded-b-lg`}
                    >
                      {variantAttributes.map((attr: string) => {
                        const attribute = attributes.find(
                          (attribute) => attribute.title === attr || attribute.id.toString() === attr
                        );
                        console.log(attribute?.options);
                        return (
                          <div key={attr}>
                            <FormInput
                              name={`variants.${index}.${attr}`}
                              placeholder={attr === "color" ? "اسود" : attr === "size" ? "XL" : attr}
                              error={
                                variantErrors?.variants?.[index]?.[
                                  attr as keyof (typeof variantErrors.variants)[number]
                                ]?.message
                              }
                              className="h-10 text-sm placeholder:text-[#667085]"
                              select
                              options={
                                attribute?.options?.map((option) => ({
                                  value: option.id.toString(),
                                  label: option.title,
                                })) || []
                              }
                            />
                          </div>
                        );
                      })}
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
                        <FormInput
                          grid={1}
                          name={`variants.${index}.images`}
                          photo
                          multiple
                          maxFiles={5}
                          placeholder="اختر صور للمنتج المتغير"
                        />
                      </div>
                      {isAdmin && (
                        <div className="flex items-center justify-center">
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
                        </div>
                      )}
                      <div className="flex items-center justify-end gap-3">
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
