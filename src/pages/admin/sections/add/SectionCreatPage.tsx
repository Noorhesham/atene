import React from "react";
import { useParams } from "react-router-dom";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import SectionCreation from "./SectionCreation";
import type { Section } from "@/types/product";

const SectionCreatPage: React.FC = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const {
    data: sections = [],
    isLoading,
    error,
  } = useAdminEntityQuery("sections", {
    enabled: isEditMode,
  });

  // Find the specific section if editing
  const section = isEditMode ? sections.find((sec: Section) => sec.id === Number(id)) : null;

  if (isEditMode && isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">جاري تحميل بيانات القسم...</div>
        </div>
      </div>
    );
  }

  if (isEditMode && error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">خطأ في تحميل بيانات القسم: {error}</p>
        </div>
      </div>
    );
  }

  if (isEditMode && !section) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">القسم المطلوب غير موجود</p>
        </div>
      </div>
    );
  }

  return <SectionCreation section={section} />;
};

export default SectionCreatPage; 