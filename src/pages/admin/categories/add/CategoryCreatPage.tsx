import React from "react";
import { useParams } from "react-router-dom";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import CategoryCreation from "./CategoryCreation";

const CategoryCreatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Fetch single category if editing
  const { data: categories, isLoading } = useAdminEntityQuery("categories", {
    enabled: true,
  });

  // Find the specific category if editing
  const category = isEditMode && id ? categories.find((cat) => cat.id === parseInt(id)) : null;

  if (isEditMode && isLoading) {
    return (
      <div className="p-6 mx-auto w-full" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل بيانات التصنيف...</p>
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
