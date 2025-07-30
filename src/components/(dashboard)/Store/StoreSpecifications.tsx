import React from "react";
import SpecificationsInput from "@/components/inputs/SpecificationsInput";

const StoreSpecifications: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">مواصفات المتجر</h3>
        <p className="text-gray-600">
          قم بإضافة المواصفات التي تميز متجرك وتساعد العملاء على فهم ما يقدمه متجرك
        </p>
      </div>
      
      <SpecificationsInput
        name="specifications"
        label="مواصفات المتجر"
        helpText="ماهي المواصفات التي تميز متجرك"
        required={true}
      />
    </div>
  );
};

export default StoreSpecifications; 