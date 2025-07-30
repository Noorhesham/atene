import React, { useState } from "react";
import { X, Info } from "lucide-react";
import { FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import FormInput from "@/components/inputs/FormInput";
import SpecificationsInput from "@/components/inputs/SpecificationsInput";

type FormValues = {
  keywords: { value: string }[];
  productAttributes: { icon: string; title: string }[];
  hasDelivery: boolean;
  storeVisibility: string;
  productType: string;
  mainCategory: string;
  subCategory: string;
  city: string;
  neighborhood: string;
};

// --- MOCK DATA ---
const storeOptions = [{ value: "main", label: "المتجر الرئيسي" }];
const typeOptions = [{ value: "rings", label: "خواتم" }];
const mainCategoryOptions = [{ value: "women-fashion", label: "أزياء - موضة نسائية" }];
const subCategoryOptions = [{ value: "accessories", label: "اكسسوارات - مجوهرات" }];
const cityOptions = [{ value: "cairo", label: "القاهرة" }];
const neighborhoodOptions = [{ value: "maadi", label: "المعادي" }];



// --- STEP 2: PRODUCT DETAILS COMPONENT ---
const ProductDetails = () => {
  const { control } = useFormContext<FormValues>();
  const [keywordInput, setKeywordInput] = useState("");

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control,
    name: "keywords",
  });

  const handleAddKeyword = () => {
    if (keywordInput.trim() !== "") {
      appendKeyword({ value: keywordInput.trim() });
      setKeywordInput("");
    }
  };

  return (
    <div className=" flex flex-col gap-4 p-6">
      <FormInput
        select
        name="storeVisibility"
        label="إظهار المنتج في متجر"
        options={storeOptions}
        placeholder="المتجر الرئيسي"
      />

      {/* Keywords section */}
      <div>
        <div className="flex w-full items-center justify-between mt-4 gap-4 mb-2">
          <FormLabel>الكلمات المفتاحية</FormLabel>
          <p className="flex text-main items-center gap-2 text-sm">
            <Info size={16} /> ماهي الكلمات المفتاحية
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
      <SpecificationsInput
        name="productAttributes"
        label="صفات المنتج"
        helpText="ماهي صفات المنتج"
      />

      {/* Product Features Section */}
      <div className="space-y-4">
        <FormLabel className="text-[18px]">مميزات المنتج</FormLabel>
        <div className="grid px-4 bg-gray-100 grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <FormInput
              flex
              select
              name="productType"
              className=" "
              label="النوع"
              options={typeOptions}
              placeholder="خواتم"
            />
          </div>
          <FormField
            control={control}
            name="hasDelivery"
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-lg">
                <span className="font-medium text-gray-700">هل لديك خدمة توصيل؟</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => field.onChange(false)}
                    className={`rounded-full px-6 ${!field.value ? "bg-main text-white" : "bg-white text-gray-700"}`}
                  >
                    لا
                  </Button>
                  <Button
                    type="button"
                    onClick={() => field.onChange(true)}
                    className={`rounded-full px-6 ${field.value ? "bg-main text-white" : "bg-white text-gray-700"}`}
                  >
                    نعم
                  </Button>
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
        <FormInput
          select
          flex
          name="mainCategory"
          label="القسم الرئيسي"
          options={mainCategoryOptions}
          placeholder="أزياء - موضة نسائية"
        />{" "}
        <FormInput
          select
          flex
          name="subCategory"
          label="القسم الفرعي"
          options={subCategoryOptions}
          placeholder="اكسسوارات - مجوهرات"
          className="col-span-2"
        />
      </div>
      {/* Categories Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  px-4 rounded-lg">
        <FormInput flex select name="city" label="المدينة" options={cityOptions} placeholder="القاهرة" />

        <FormInput
          select
          flex
          name="neighborhood"
          label="الحي / المنطقة"
          options={neighborhoodOptions}
          placeholder="المعادي"
        />
      </div>
    </div>
  );
};

export default ProductDetails;
