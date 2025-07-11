import React, { useState } from "react";
import { Home, Settings, Package, Search, X, Edit, Trash2, PlusCircle, Rocket, Sparkles, Info } from "lucide-react";
import { FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import FormInput from "@/components/inputs/FormInput";
import ModalCustom from "@/components/ModalCustom";
import toast from "react-hot-toast";

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

type ProductAttribute = {
  icon: string;
  title: string;
};

const AddAttributeModalContent = ({
  onAdd,
  closeModal,
  attribute,
}: {
  onAdd: (attribute: ProductAttribute) => void;
  closeModal: () => void;
  attribute?: ProductAttribute;
}) => {
  const [iconSearch, setIconSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(attribute?.icon || "Rocket");
  const [attributeTitle, setAttributeTitle] = useState(attribute?.title || "");

  const icons = [
    { name: "Rocket", el: <Rocket /> },
    { name: "Sparkles", el: <Sparkles /> },
    { name: "Home", el: <Home /> },
    { name: "Settings", el: <Settings /> },
    { name: "Package", el: <Package /> },
  ];

  const handleAddAttribute = () => {
    if (attributeTitle && selectedIcon) {
      onAdd({ icon: selectedIcon, title: attributeTitle });
      closeModal();
    } else {
      toast.error("يرجى اختيار أيقونة وإدخال عنوان للصفة");
    }
  };

  return (
    <div className="p-4" dir="rtl">
      <h3 className="text-lg font-bold text-center mb-4">{attribute ? "تعديل صفة المنتج" : "إضافة صفة للمنتج"}</h3>
      <div className="mb-4">
        <p className="font-medium mb-2">اختر أيقونة</p>
        <div className="relative">
          <Input
            placeholder="ابحث عن أيقونة"
            value={iconSearch}
            onChange={(e) => setIconSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-8 gap-2 mt-4 max-h-32 overflow-y-auto p-1">
          {icons
            .filter((i) => i.name.toLowerCase().includes(iconSearch.toLowerCase()))
            .map((icon) => (
              <button
                key={icon.name}
                type="button"
                onClick={() => setSelectedIcon(icon.name)}
                className={`p-2 border rounded-md flex items-center justify-center transition-colors ${
                  selectedIcon === icon.name ? "bg-blue-100 border-blue-500 text-main" : "hover:bg-[#F0F7FF]"
                }`}
              >
                {React.cloneElement(icon.el, { className: "w-5 h-5" })}
              </button>
            ))}
        </div>
      </div>
      <div className="mb-6">
        <Input
          placeholder="أدخل عنوان الصفة"
          value={attributeTitle}
          onChange={(e) => setAttributeTitle(e.target.value)}
          className="w-full"
        />
        <FormLabel className="text-[18px] mb-2">عنوان الصفة *</FormLabel>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={closeModal} className="bg-[#F0F7FF]">
          إلغاء
        </Button>
        <Button type="button" onClick={handleAddAttribute} className="bg-main text-white hover:bg-main/90">
          {attribute ? "تحديث" : "تأكيد"}
        </Button>
      </div>
    </div>
  );
};

// --- STEP 2: PRODUCT DETAILS COMPONENT ---
const ProductDetails = () => {
  const { control } = useFormContext<FormValues>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<ProductAttribute | undefined>();
  const [keywordInput, setKeywordInput] = useState("");

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control,
    name: "keywords",
  });

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: "productAttributes",
  });

  const handleAddKeyword = () => {
    if (keywordInput.trim() !== "") {
      appendKeyword({ value: keywordInput.trim() });
      setKeywordInput("");
    }
  };

  const getIconElement = (iconName: string) => {
    switch (iconName) {
      case "Rocket":
        return <Rocket className="w-5 h-5 text-main" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-main" />;
      default:
        return <Home className="w-5 h-5 text-main" />;
    }
  };

  const handleAttributeAction = (attribute: ProductAttribute) => {
    if (editingAttribute) {
      // Update existing attribute
      const index = attributeFields.findIndex(
        (field) =>
          (field as unknown as ProductAttribute).icon === editingAttribute.icon &&
          (field as unknown as ProductAttribute).title === editingAttribute.title
      );
      if (index !== -1) {
        removeAttribute(index);
        appendAttribute(attribute);
      }
    } else {
      // Add new attribute
      appendAttribute(attribute);
    }
    setEditingAttribute(undefined);
    setIsModalOpen(false);
  };

  const handleEditAttribute = (attribute: ProductAttribute) => {
    setEditingAttribute(attribute);
    setIsModalOpen(true);
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

      {/* Attributes section */}
      <div>
        <div className="flex w-full items-center justify-between gap-2 mb-2">
          <FormLabel>صفات المنتج</FormLabel>
          <p className="flex text-main items-center gap-2 text-sm">
            <Info size={16} /> ماهي صفات المنتج
          </p>
        </div>
        <ModalCustom
          isOpen={isModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditingAttribute(undefined);
            }
            setIsModalOpen(open);
          }}
          btn={
            <Button type="button" variant="outline" className="w-full justify-start mt-2 border-dashed bg-white">
              <PlusCircle size={16} className="ml-2" /> إضافة صفة جديدة
            </Button>
          }
          content={
            <AddAttributeModalContent
              attribute={editingAttribute}
              onAdd={handleAttributeAction}
              closeModal={() => {
                setEditingAttribute(undefined);
                setIsModalOpen(false);
              }}
            />
          }
        />
        <div className="mt-4">
          {attributeFields.length > 0 && (
            <div className="grid grid-cols-3 p-3 bg-[#F0F7FF] rounded-t-lg text-sm font-semibold text-gray-500">
              <span>أيقونة</span>
              <span>عنوان الصفة</span>
              <span className="text-left">الاجراءات</span>
            </div>
          )}
          <div className="space-y-px">
            {attributeFields.map((field, index) => {
              const fieldData = field as unknown as ProductAttribute;
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-3 items-center p-3  border-x border-b border-gray-200 last:rounded-b-lg"
                >
                  <div className="flex items-center gap-3">{getIconElement(fieldData.icon)}</div>
                  <span className="font-medium">{fieldData.title}</span>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-gray-500 bg-[#F0F7FF] hover:bg-gray-200"
                      onClick={() => handleEditAttribute(fieldData)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-red-500 bg-red-50 hover:bg-red-100"
                      onClick={() => removeAttribute(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
