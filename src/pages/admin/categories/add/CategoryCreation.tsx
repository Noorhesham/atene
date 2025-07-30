import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiCategory } from "@/hooks/useUsers";
import FormInput from "@/components/inputs/FormInput";
import { PlusCircle, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Schema for subcategory
const subCategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "اسم التصنيف الفرعي مطلوب"),
  image: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]),
  parent_id: z.number(),
});

// Main category schema
const categorySchema = z.object({
  name: z.string().min(1, "اسم التصنيف مطلوب"),
  image: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]),
  parent_id: z.number().nullable(),
  subCategories: z.array(subCategorySchema),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryCreationProps {
  category?: ApiCategory | null;
}

const CategoryCreation: React.FC<CategoryCreationProps> = ({ category }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id && !!category;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks for data fetching
  const { data: categories, create: createCategory, update: updateCategory } = useAdminEntityQuery("categories");

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: null,
      status: "active" as const,
      parent_id: null,
      subCategories: [],
    },
    mode: "onChange",
  });

  const {
    fields: subCategories,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "subCategories",
  });

  // Populate form when editing
  useEffect(() => {
    if (category && isEditMode) {
      form.reset({
        name: category.name || "",
        image: category.image || null,
        status: (category.status as "active" | "inactive") || "active",
        parent_id: category.parent_id || null,
        subCategories: [], // Will be populated separately if needed
      });
    }
  }, [category, isEditMode, form]);

  const addSubCategory = () => {
    append({
      name: "",
      image: null,
      status: "active" as const,
      parent_id: 0, // Will be set when parent is created
    });
  };

  const removeSubCategory = (index: number) => {
    remove(index);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Category Data to submit:", data);

      // Prepare main category data
      const mainCategoryData = {
        name: data.name,
        image: data.image,
        status: data.status,
        parent_id: data.parent_id,
      };

      let savedCategory: ApiCategory;

      if (isEditMode && category) {
        savedCategory = await updateCategory(category.id, mainCategoryData);
        toast.success("تم تحديث التصنيف بنجاح!");
      } else {
        savedCategory = await createCategory(mainCategoryData);
        toast.success("تم إنشاء التصنيف بنجاح!");
      }

      // Create subcategories if any
      if (data.subCategories && data.subCategories.length > 0) {
        for (const subCategory of data.subCategories) {
          const subCategoryData = {
            ...subCategory,
            parent_id: savedCategory.id,
          };
          await createCategory(subCategoryData);
        }
        toast.success("تم إنشاء التصنيفات الفرعية بنجاح!");
      }

      // Navigate back to categories page
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error submitting category:", error);
      if (isEditMode) {
        toast.error("حدث خطأ أثناء تحديث التصنيف");
      } else {
        toast.error("حدث خطأ أثناء إنشاء التصنيف");
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  // Get parent categories (categories without parent_id)
  const parentCategories = categories.filter((cat) => cat.parent_id === null);

  return (
    <div className="p-6  mx-auto w-full" dir="rtl">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "تعديل التصنيف" : "إنشاء تصنيف جديد"}</h1>
              <p className="text-gray-600">
                {isEditMode ? "تعديل بيانات التصنيف" : "إنشاء تصنيف جديد مع التصنيفات الفرعية"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/categories")}>
                إلغاء
              </Button>
              <Button type="submit" className="bg-main hover:bg-main/90" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "جاري التحديث..."
                    : "جاري الحفظ..."
                  : isEditMode
                  ? "تحديث التصنيف"
                  : "حفظ التصنيف"}
              </Button>
            </div>
          </div>

          {/* Main Category Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">بيانات التصنيف الأساسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Name */}
              <FormInput
                control={form.control}
                name="name"
                label="اسم التصنيف"
                placeholder="مثال: إلكترونيات"
                error={form.formState.errors.name?.message}
              />

              {/* Status */}
              <FormInput
                control={form.control}
                name="status"
                label="الحالة"
                select
                options={[
                  { value: "active", label: "نشط" },
                  { value: "inactive", label: "غير نشط" },
                ]}
              />

              {/* Parent Category */}
              <div className="space-y-2">
                <FormInput
                  control={form.control}
                  name="parent_id"
                  label="التصنيف الأب (اختياري)"
                  select
                  optional
                  options={[
                    { value: "null", label: "بدون تصنيف أب" },
                    ...parentCategories.map((cat: ApiCategory) => ({
                      value: cat.id.toString(),
                      label: cat.name,
                    })),
                  ]}
                />
              </div>

              {/* Category Image */}
              <FormInput control={form.control} name="image" label="صورة التصنيف" photo optional />
            </div>
          </Card>

          {/* Subcategories Section */}
          {!isEditMode && form.watch("parent_id") === null && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">التصنيفات الفرعية</h2>
                <Button type="button" variant="outline" onClick={addSubCategory} className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  إضافة تصنيف فرعي
                </Button>
              </div>

              {subCategories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>لا توجد تصنيفات فرعية</p>
                  <p className="text-sm">يمكنك إضافة تصنيفات فرعية لتنظيم المنتجات بشكل أفضل</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subCategories.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-medium text-gray-900">التصنيف الفرعي {index + 1}</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSubCategory(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Subcategory Name */}
                        <FormInput
                          control={form.control}
                          name={`subCategories.${index}.name`}
                          label="اسم التصنيف الفرعي"
                          placeholder="مثال: هواتف ذكية"
                          error={form.formState.errors.subCategories?.[index]?.name?.message}
                        />

                        {/* Subcategory Status */}
                        <FormInput
                          control={form.control}
                          name={`subCategories.${index}.status`}
                          label="الحالة"
                          select
                          options={[
                            { value: "active", label: "نشط" },
                            { value: "inactive", label: "غير نشط" },
                          ]}
                        />

                        {/* Subcategory Image */}
                        <FormInput
                          control={form.control}
                          name={`subCategories.${index}.image`}
                          label="صورة التصنيف الفرعي"
                          photo
                          optional
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/categories")}>
              إلغاء
            </Button>
            <Button type="submit" className="bg-main hover:bg-main/90" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "جاري التحديث..."
                  : "جاري الحفظ..."
                : isEditMode
                ? "تحديث التصنيف"
                : "حفظ التصنيف"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CategoryCreation;
