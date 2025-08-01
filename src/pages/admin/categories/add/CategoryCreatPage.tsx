import React from "react";
import { useParams } from "react-router-dom";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { Loader2 } from "lucide-react";
import CategoryCreation from "./CategoryCreation";

const CategoryCreatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Fetch categories
  const { data: categories, isLoading, error } = useAdminEntityQuery("categories");
  console.log(categories);
  // Find the specific category if editing
  const category = isEditMode && id ? categories?.find((cat) => cat.id === parseInt(id)) : null;

  if (isLoading) {
    return (
      <div className="p-6 mx-auto w-full" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-main" />
            <p className="text-gray-600">جاري تحميل بيانات التصنيفات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mx-auto w-full" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600">حدث خطأ أثناء تحميل التصنيفات: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isEditMode && !category) {
    return (
      <div className="p-6 mx-auto w-full" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600">لم يتم العثور على التصنيف المطلوب</p>
          </div>
        </div>
      </div>
    );
  }

  return <CategoryCreation category={category} />;
};

export default CategoryCreatePage;
