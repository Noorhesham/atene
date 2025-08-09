import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiAttribute, ApiAttributeOption } from "@/types";
import FormInput from "@/components/inputs/FormInput";
import { PlusCircle, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Schema for attribute option
const attributeOptionSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().min(1, "عنوان الخيار مطلوب"),
  attribute_id: z.number().optional(),
});

// Main attribute schema
const attributeSchema = z.object({
  title: z.string().min(1, "عنوان الخاصية مطلوب"),
  status: z.enum(["active", "inactive"]),
  options: z.array(attributeOptionSchema),
});

type AttributeFormData = z.infer<typeof attributeSchema>;

interface AttributeCreationProps {
  attribute?: ApiAttribute | null;
}

const AttributeCreation: React.FC<AttributeCreationProps> = ({ attribute }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id && !!attribute;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks for data operations
  const { create: createAttribute, update: updateAttribute } = useAdminEntityQuery("attributes");

  const form = useForm<AttributeFormData>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      title: "",
      status: "active",
      options: [{ title: "" }],
    },
  });

  const {
    fields: options,
    append: addOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: "options",
  });

  // Set form data when editing
  useEffect(() => {
    if (isEditMode && attribute) {
      form.reset({
        title: attribute.title,
        status: attribute.status,
        options:
          attribute.options && attribute.options.length > 0
            ? attribute.options.map((option: ApiAttributeOption) => ({
                id: option.id.toString(),
                title: option.title,
                attribute_id: option.attribute_id,
              }))
            : [{ title: "" }],
      });
    }
  }, [isEditMode, attribute, form]);

  const addNewOption = () => {
    addOption({ title: "" });
  };

  const removeOptionAtIndex = (index: number) => {
    if (options.length > 1) {
      removeOption(index);
    } else {
    }
  };

  const onSubmit = async (data: AttributeFormData) => {
    setIsSubmitting(true);
    try {
      // Filter out empty options
      const validOptions = data.options.filter((option) => option.title.trim() !== "");

      if (validOptions.length === 0) {
        setIsSubmitting(false);
        return;
      }

      const attributeData = {
        ...data,
        options: validOptions.map((option) => ({
          ...option,
          id: option.id?.toString() || undefined, // Only include id if it exists
        })),
      };

      if (isEditMode) {
        await updateAttribute(Number(id), attributeData as unknown as Partial<ApiAttribute>);
      } else {
        await createAttribute(attributeData as unknown as Partial<ApiAttribute>);
      }

      navigate("/admin/attributes");
    } catch (error: unknown) {
      console.error("Error saving attribute:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log(form.formState.errors);
  return (
    <div className="p-6 w-full mx-auto" dir="rtl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "تعديل الخاصية" : "إضافة خاصية جديدة"}</h1>
            <p className="text-gray-600">
              {isEditMode ? "قم بتعديل بيانات الخاصية وخياراتها" : "أضف خاصية جديدة مثل اللون، الحجم، الوزن وغيرها"}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/attributes")}>
            إلغاء
          </Button>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Main Attribute Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">معلومات الخاصية الأساسية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attribute Title */}
                <FormInput
                  control={form.control as any}
                  name="title"
                  label="عنوان الخاصية"
                  placeholder="مثل: اللون، الحجم، الوزن..."
                />

                {/* Status */}
                <FormInput
                  control={form.control as any}
                  name="status"
                  label="حالة الخاصية"
                  select
                  options={[
                    { value: "active", label: "نشط" },
                    { value: "inactive", label: "غير نشط" },
                  ]}
                />
              </div>
            </Card>

            {/* Options Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">خيارات الخاصية</h2>
                <Button type="button" variant="outline" onClick={addNewOption} className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  إضافة خيار جديد
                </Button>
              </div>

              <div className="space-y-4">
                {options.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-3">
                    <div className="flex-1">
                      <FormInput
                        control={form.control as any}
                        name={`options.${index}.title`}
                        label={`الخيار ${index + 1}`}
                        placeholder="مثل: أحمر، كبير، 1كغ..."
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOptionAtIndex(index)}
                      className="text-red-600 hover:text-red-700 mb-2"
                      disabled={options.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {options.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>لا توجد خيارات</p>
                  <p className="text-sm">يجب إضافة خيار واحد على الأقل للخاصية</p>
                </div>
              )}
            </Card>

            {/* Preview Section */}
            <Card className="p-6 bg-gray-50">
              <h2 className="text-lg font-semibold mb-4">معاينة الخاصية</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">عنوان الخاصية: </span>
                  <span className="text-gray-700">{form.watch("title") || "لم يتم إدخال عنوان بعد"}</span>
                </div>
                <div>
                  <span className="font-medium">الحالة: </span>
                  <span className="text-gray-700">{form.watch("status") === "active" ? "نشط" : "غير نشط"}</span>
                </div>
                <div>
                  <span className="font-medium">الخيارات المتاحة: </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form
                      .watch("options")
                      ?.filter((option) => option.title.trim() !== "")
                      .map((option, index) => (
                        <span key={index} className="px-2 py-1 bg-white border rounded text-sm">
                          {option.title}
                        </span>
                      ))}
                    {form.watch("options")?.filter((option) => option.title.trim() !== "").length === 0 && (
                      <span className="text-gray-500 text-sm">لا توجد خيارات صالحة</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Submit Buttons */}
            <Card className="p-6">
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate("/admin/attributes")}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-main hover:bg-main/90">
                  {isSubmitting ? "جاري الحفظ..." : isEditMode ? "تحديث الخاصية" : "إنشاء الخاصية"}
                </Button>
              </div>
            </Card>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AttributeCreation;
