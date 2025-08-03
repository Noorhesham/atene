import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import FormInput from "@/components/inputs/FormInput";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { Section } from "@/types/product";

// Section schema
const sectionSchema = z.object({
  name: z.string().min(1, "اسم القسم مطلوب"),
});

type SectionFormData = z.infer<typeof sectionSchema>;

interface SectionCreationProps {
  section?: Section | null;
}

const SectionCreation: React.FC<SectionCreationProps> = ({ section }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id && !!section;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks for data operations
  const { create: createSection, update: updateSection } = useAdminEntityQuery("sections");

  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
    },
  });

  // Set form data when editing
  useEffect(() => {
    if (isEditMode && section) {
      form.reset({
        name: section.name,
      });
    }
  }, [isEditMode, section, form]);

  const onSubmit = async (data: SectionFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && section) {
        await updateSection(section.id, data);
        toast.success("تم تحديث القسم بنجاح");
      } else {
        await createSection(data);
        toast.success("تم إنشاء القسم بنجاح");
      }
      navigate("/admin/sections");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "حدث خطأ أثناء حفظ القسم";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 w-full" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/sections")} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          العودة للأقسام
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "تعديل القسم" : "إضافة قسم جديد"}</h1>
          <p className="text-gray-600">{isEditMode ? "تعديل بيانات القسم" : "إضافة قسم جديد للمنتجات"}</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6 max-w-2xl">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section Name */}
            <FormInput
              name="name"
              label="اسم القسم"
              placeholder="مثال: الإلكترونيات، الملابس، المجوهرات"
              description="اسم القسم كما سيظهر للمستخدمين"
            />

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="bg-main hover:bg-main/90">
                <Save className="w-4 h-4 ml-2" />
                {isSubmitting ? "جاري الحفظ..." : isEditMode ? "تحديث القسم" : "إنشاء القسم"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/sections")}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default SectionCreation;
