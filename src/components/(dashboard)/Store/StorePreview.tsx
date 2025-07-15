
import React from "react";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

const StorePreview = () => {
  const { watch } = useFormContext();
  const storeName = watch("storeName");
  const storeDescription = watch("storeDescription");

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">معاينة صفحة المتجر</h3>
      <div className="border rounded-lg p-4 space-y-4">
        <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h4 className="text-xl font-bold">{storeName || "اسم المتجر"}</h4>
        <p className="text-sm text-gray-600">{storeDescription || "وصف المتجر سيظهر هنا..."}</p>
      </div>
    </Card>
  );
};

export default StorePreview;