import React, { useState } from "react";
import { X, Info } from "lucide-react";
import { FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import FormInput from "@/components/inputs/FormInput";
import SpecificationsInput from "@/components/inputs/SpecificationsInput";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { QuestionMark } from "@/components/icons";

type FormValues = {
  tags: { value: string }[];
  specifications: { icon: string; title: string }[];
  hasDelivery: boolean;
  store_id: string;
  productType: string;
  mainCategory: string;
  subCategory: string;
  city: string;
  neighborhood: string;
};

// --- MOCK DATA ---
const typeOptions = [{ value: "rings", label: "خواتم" }];
const mainCategoryOptions = [{ value: "women-fashion", label: "أزياء - موضة نسائية" }];
const subCategoryOptions = [{ value: "accessories", label: "اكسسوارات - مجوهرات" }];
const cityOptions = [{ value: "cairo", label: "القاهرة" }];
const neighborhoodOptions = [{ value: "maadi", label: "المعادي" }];

// --- STEP 2: PRODUCT DETAILS COMPONENT ---
const ProductDetails = () => {
  const { control } = useFormContext<FormValues>();
  const [keywordInput, setKeywordInput] = useState("");
  const { data: stores = [], isLoading } = useAdminEntityQuery("stores", {});
  const storeOptions = stores.map((store) => ({ value: store.id.toString(), label: store.name }));
  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const handleAddKeyword = () => {
    if (keywordInput.trim() !== "") {
      appendKeyword({ value: keywordInput.trim() });
      setKeywordInput("");
    }
  };
  if (isLoading) return <div>Loading...</div>;
  console.log(keywordFields);
  return (
    <div className=" flex flex-col gap-4 p-6">
      <FormInput
        select
        name="store_id"
        label="إظهار المنتج في متجر"
        options={storeOptions}
        placeholder="المتجر الرئيسي"
      />

      {/* Keywords section */}
      <div>
        <div className="flex w-full items-center justify-between mt-4 gap-4 mb-2">
          <FormLabel>الكلمات المفتاحية</FormLabel>
          <p className="flex text-main items-center gap-2 text-sm">
            <QuestionMark /> ماهي الكلمات المفتاحية
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="اضف الوسم ثم اضغط على إضافة"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddKeyword();
              }
            }}
          />
          <Button type="button" onClick={handleAddKeyword} className="bg-main text-white hover:bg-main/90 shrink-0">
            إضافة
          </Button>
        </div>
        <div className="flex mt-2 flex-wrap gap-2 ">
          {keywordFields.map((field, index) => (
            <div
              key={field.id}
              className="bg-gray-200 text-gray-800 text-sm font-medium pl-2 pr-3 py-1 rounded-full flex items-center gap-2"
            >
              {(field as { value: string }).value}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="text-gray-500 hover:text-gray-800"
                title="حذف"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Attributes section */}
      <SpecificationsInput name="specifications" label="صفات المنتج" helpText="ماهي صفات المنتج" />
    </div>
  );
};

export default ProductDetails;
