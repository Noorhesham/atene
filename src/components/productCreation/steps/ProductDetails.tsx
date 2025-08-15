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

const typeOptions = [{ value: "rings", label: "خواتم" }];

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
        <div className="flex relative items-center gap-2">
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
          <Button
            type="button"
            onClick={handleAddKeyword}
            className="bg-[#5B87B9] absolute left-0 text-white hover:bg-main/90 shrink-0"
          >
            إضافة
          </Button>
        </div>
        <div className="flex mt-2 flex-wrap gap-2 ">
          {keywordFields.map((field, index) => (
            <div
              key={field.id}
              className="border-main bg-[#5b87b921] border text-main text-sm font-medium pl-2 pr-3 py-1 rounded-full flex items-center gap-2"
            >
              {(field as { value: string }).value}
              <button type="button" onClick={() => removeKeyword(index)} className="text-main " title="حذف">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Product Attributes section */}
      <SpecificationsInput name="specifications" label="صفات المنتج" helpText="ماهي صفات المنتج" />{" "}
      <div className="space-y-1 ">
        <FormLabel className="text-[18px]">مميزات المتجر</FormLabel>
        <div className="grid px-4 bg-gray-100 grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <FormInput flex select name="type" className=" " label="النوع" options={typeOptions} placeholder="خواتم" />
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
          options={[{ value: "1", label: "أزياء - موضة نسائية" }]}
          placeholder="أزياء - موضة نسائية"
        />{" "}
        <FormInput
          select
          flex
          name="subCategory"
          label="القسم الفرعي"
          options={[{ value: "1", label: "اكسسوارات - مجوهرات" }]}
          placeholder="اكسسوارات - مجوهرات"
          className="col-span-2"
        />
      </div>
      {/* Categories Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  px-4 rounded-lg">
        <FormInput
          flex
          select
          name="city"
          label="المدينة"
          options={[{ value: "1", label: "القاهرة" }]}
          placeholder="القاهرة"
        />

        <FormInput
          select
          flex
          name="neighborhood"
          label="الحي / المنطقة"
          options={[{ value: "1", label: "المعادي" }]}
          placeholder="المعادي"
        />
      </div>
    </div>
  );
};

export default ProductDetails;
