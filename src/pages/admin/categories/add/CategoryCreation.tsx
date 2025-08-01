import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import CategoryTreeView from "./CategoryTreeView";
import toast from "react-hot-toast";
import FormInput from "@/components/inputs/FormInput";
import { ApiCategory } from "@/hooks/useUsersQuery";

const categorySchema = z.object({
  name: z.string().min(1, "اسم التصنيف مطلوب"),
  image: z.string().nullable().optional(),
  status: z.enum(["active", "inactive"], { required_error: "حالة التصنيف مطلوبة" }),
  parent_id: z.string().nullable().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryCreationProps {
  category?: ApiCategory | null;
  onSuccess?: () => void;
}

const CategoryCreation: React.FC<CategoryCreationProps> = ({ category, onSuccess }) => {
  const navigate = useNavigate();
  const isEditMode = !!category;
  const [showTreeView, setShowTreeView] = useState(false);

  // Fetch categories for parent selection and tree view
  const {
    data: categories,
    isLoading: categoriesLoading,
    create,
    update,
    isCreating,
    isUpdating,
    isUpdatingParent,
    refetch,
  } = useAdminEntityQuery("categories");

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: null,
      status: "active",
      parent_id: "null",
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (category && isEditMode) {
      form.reset({
        name: category.name || "",
        image: category.image || null,
        status: category.status || "active",
        parent_id: category.parent_id ? category.parent_id.toString() : "null",
      });
    }
  }, [category, isEditMode, form]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const formattedData = {
        ...data,
        parent_id: data.parent_id && data.parent_id !== "null" ? Number(data.parent_id) : null,
      };

      if (isEditMode && category) {
        await update(category.id, formattedData);
        onSuccess?.();
      } else {
        await create(formattedData);
        form.reset();
      }
      refetch();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("حدث خطأ أثناء حفظ التصنيف");
    }
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container sticky top-0 w-full flex flex-col gap-4" dir="rtl">
      <h1 className="text-2xl font-bold">{isEditMode ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</h1>

      <div className=" flex flex-col w-full  gap-6">
        {/* Category Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{isEditMode ? "تعديل بيانات التصنيف" : "بيانات التصنيف الجديد"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/*   <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم التصنيف</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: إلكترونيات" {...field} className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormInput name="name" label="اسم التصنيف" />
                <FormInput photo={true} name="image" label="صورة التصنيف" />
                <FormInput
                  select={true}
                  name="status"
                  label="حالة التصنيف"
                  options={[
                    { value: "active", label: "نشط" },
                    { value: "inactive", label: "غير نشط" },
                  ]}
                />

                <FormInput
                  select={true}
                  name="parent_id"
                  label="التصنيف الأب"
                  options={[
                    { value: "null", label: "بدون تصنيف أب" },
                    ...(categories?.map((cat) => ({ label: cat.name, value: cat.id.toString() })) || []),
                  ]}
                />

                <div className="flex gap-4">
                  <Button type="submit" disabled={isCreating || isUpdating} className="flex-1">
                    {isCreating || isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin ml-2" />
                        {isEditMode ? "جاري التحديث..." : "جاري الإنشاء..."}
                      </>
                    ) : (
                      <>{isEditMode ? "تحديث التصنيف" : "إنشاء التصنيف"}</>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTreeView(!showTreeView)}
                    className="flex-1"
                  >
                    {showTreeView ? "إخفاء الشجرة" : "إدارة الهيكل"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Category Tree View */}
        {showTreeView && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>هيكل التصنيفات</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryTreeView isUpdating={isUpdatingParent} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CategoryCreation;
