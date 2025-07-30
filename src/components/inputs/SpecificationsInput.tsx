import React, { useState } from "react";
import { Home, Settings, Package, Search, X, Edit, Trash2, PlusCircle, Rocket, Sparkles, Info } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext, useFieldArray } from "react-hook-form";
import ModalCustom from "@/components/ModalCustom";
import toast from "react-hot-toast";

type Specification = {
  icon: string;
  title: string;
};

interface SpecificationsInputProps {
  name: string;
  label?: string;
  helpText?: string;
  required?: boolean;
}

const AddSpecificationModalContent = ({
  onAdd,
  closeModal,
  specification,
}: {
  onAdd: (specification: Specification) => void;
  closeModal: () => void;
  specification?: Specification;
}) => {
  const [iconSearch, setIconSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(specification?.icon || "Rocket");
  const [specificationTitle, setSpecificationTitle] = useState(specification?.title || "");

  const icons = [
    { name: "Rocket", el: <Rocket /> },
    { name: "Sparkles", el: <Sparkles /> },
    { name: "Home", el: <Home /> },
    { name: "Settings", el: <Settings /> },
    { name: "Package", el: <Package /> },
  ];

  const handleAddSpecification = () => {
    if (specificationTitle && selectedIcon) {
      onAdd({ icon: selectedIcon, title: specificationTitle });
      closeModal();
    } else {
      toast.error("يرجى اختيار أيقونة وإدخال عنوان للمواصفة");
    }
  };

  return (
    <div className="p-4" dir="rtl">
      <h3 className="text-lg font-bold text-center mb-4">{specification ? "تعديل المواصفة" : "إضافة مواصفة جديدة"}</h3>
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
        <FormLabel className="text-[18px] mb-2">عنوان المواصفة *</FormLabel>
        <Input
          placeholder="أدخل عنوان المواصفة"
          value={specificationTitle}
          onChange={(e) => setSpecificationTitle(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={closeModal} className="bg-[#F0F7FF]">
          إلغاء
        </Button>
        <Button type="button" onClick={handleAddSpecification} className="bg-main text-white hover:bg-main/90">
          {specification ? "تحديث" : "تأكيد"}
        </Button>
      </div>
    </div>
  );
};

const SpecificationsInput: React.FC<SpecificationsInputProps> = ({
  name,
  label = "المواصفات",
  helpText = "ماهي المواصفات",
  required = false,
}) => {
  const { control } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecification, setEditingSpecification] = useState<Specification | undefined>();

  const {
    fields: specificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name,
  });

  const getIconElement = (iconName: string) => {
    switch (iconName) {
      case "Rocket":
        return <Rocket className="w-5 h-5 text-main" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-main" />;
      case "Home":
        return <Home className="w-5 h-5 text-main" />;
      case "Settings":
        return <Settings className="w-5 h-5 text-main" />;
      case "Package":
        return <Package className="w-5 h-5 text-main" />;
      default:
        return <Home className="w-5 h-5 text-main" />;
    }
  };

  const handleSpecificationAction = (specification: Specification) => {
    if (editingSpecification) {
      // Update existing specification
      const index = specificationFields.findIndex(
        (field) =>
          (field as unknown as Specification).icon === editingSpecification.icon &&
          (field as unknown as Specification).title === editingSpecification.title
      );
      if (index !== -1) {
        removeSpecification(index);
        appendSpecification(specification);
      }
    } else {
      // Add new specification
      appendSpecification(specification);
    }
    setEditingSpecification(undefined);
    setIsModalOpen(false);
  };

  const handleEditSpecification = (specification: Specification) => {
    setEditingSpecification(specification);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex w-full items-center justify-between gap-2 mb-2">
        <FormLabel className="text-[18px]">
          {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
        <p className="flex text-main items-center gap-2 text-sm">
          <Info size={16} /> {helpText}
        </p>
      </div>
      <ModalCustom
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSpecification(undefined);
          }
          setIsModalOpen(open);
        }}
        btn={
          <Button type="button" variant="outline" className="w-full justify-start mt-2 border-dashed bg-white">
            <PlusCircle size={16} className="ml-2" /> إضافة مواصفة جديدة
          </Button>
        }
        content={
          <AddSpecificationModalContent
            specification={editingSpecification}
            onAdd={handleSpecificationAction}
            closeModal={() => {
              setEditingSpecification(undefined);
              setIsModalOpen(false);
            }}
          />
        }
      />
      <div className="mt-4">
        {specificationFields.length > 0 && (
          <div className="grid grid-cols-3 p-3 bg-[#F0F7FF] rounded-t-lg text-sm font-semibold text-gray-500">
            <span>أيقونة</span>
            <span>عنوان المواصفة</span>
            <span className="text-left">الاجراءات</span>
          </div>
        )}
        <div className="space-y-px">
          {specificationFields.map((field, index) => {
            const fieldData = field as unknown as Specification;
            return (
              <div
                key={field.id}
                className="grid grid-cols-3 items-center p-3 border-x border-b border-gray-200 last:rounded-b-lg"
              >
                <div className="flex items-center gap-3">{getIconElement(fieldData.icon)}</div>
                <span className="font-medium">{fieldData.title}</span>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-gray-500 bg-[#F0F7FF] hover:bg-gray-200"
                    onClick={() => handleEditSpecification(fieldData)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-red-500 bg-red-50 hover:bg-red-100"
                    onClick={() => removeSpecification(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {required && specificationFields.length === 0 && (
        <p className="text-red-500 text-sm mt-2">يجب إضافة مواصفة واحدة على الأقل</p>
      )}
    </div>
  );
};

export default SpecificationsInput;
