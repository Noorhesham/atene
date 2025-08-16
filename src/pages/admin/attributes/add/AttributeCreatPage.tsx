import React from "react";
import { useParams } from "react-router-dom";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiAttribute } from "@/types";
import AttributeCreation from "./AttributeCreation";

const AttributeCreatPage: React.FC = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const {
    data: attributes = [],
    isLoading,
    error,
  } = useAdminEntityQuery("attributes", {
    enabled: isEditMode,
  });

  // Find the specific attribute if editing
  const attribute = isEditMode ? attributes.find((attr: ApiAttribute) => attr.id === Number(id)) : null;

  if (isEditMode && isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">جاري تحميل بيانات الخاصية...</div>
        </div>
      </div>
    );
  }

  if (isEditMode && error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">خطأ في تحميل بيانات الخاصية: {error}</p>
        </div>
      </div>
    );
  }

  if (isEditMode && !attribute) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">الخاصية المطلوبة غير موجودة</p>
        </div>
      </div>
    );
  }

  return <AttributeCreation attribute={attribute} />;
};

export default AttributeCreatPage;
