import { Heart, ImageIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { STORAGE_URL } from "@/constants/api";

const ProductPreview = () => {
  const { watch } = useFormContext();
  const [activeTab, setActiveTab] = useState("card");

  const productName = watch("productName");
  const price = watch("price");
  const imagesData = watch("images");
  const images = Array.isArray(imagesData) ? imagesData : [];
  const shortDescription = watch("shortDescription");

  const hasContent = productName || price || images.length > 0;
  const primaryImage = images.length > 0 ? `${STORAGE_URL}/${images[0]}` : null;

  return (
    <Card dir="rtl" className="p-6 h-full flex flex-col bg-[#F9FAFB] rounded-xl">
      {/* Top Toggle Buttons */}
      <div className="flex justify-center mb-10">
        <div className="p-1 rounded-lg flex items-center gap-1 bg-[#EBF0F5]">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("page");
            }}
            variant={activeTab === "page" ? "primary" : "ghost"}
            className={`px-6 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
              activeTab === "page" ? "bg-[#5A7A9D] text-white shadow-sm" : "bg-transparent text-[#5A7A9D]"
            }`}
          >
            صفحة المنتج
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("card");
            }}
            variant={activeTab === "card" ? "primary" : "ghost"}
            className={`px-6 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
              activeTab === "card" ? "bg-[#5A7A9D] text-white shadow-sm" : "bg-transparent text-[#5A7A9D]"
            }`}
          >
            بطاقة المنتج
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        {hasContent ? (
          // Product Card View
          <div className="w-full max-w-[280px] bg-[#F7F7F7] rounded-2xl shadow-sm p-4">
            <div className="relative">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={productName || "Product"}
                  className="w-full h-56 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-3 left-3 space-y-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  size="icon"
                  className="w-8 h-8 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white rounded-full"
                >
                  <Heart size={16} />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  size="icon"
                  className="w-8 h-8 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white rounded-full"
                >
                  <Share2 size={16} />
                </Button>
              </div>
            </div>
            <div className="text-center mt-4">
              <h4 className="font-bold text-gray-800 truncate">{productName || "اسم المنتج..."}</h4>
              <p className="text-gray-600 font-semibold mt-2">
                {price
                  ? `${price.toLocaleString("ar-SA", {
                      minimumFractionDigits: 2,
                    })} ر.س`
                  : "0.00 ر.س"}
              </p>
            </div>
          </div>
        ) : (
          // Placeholder View
          <>
            <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">ميزة معاينة المنتج</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              توفر لك هذه الميزة معاينة مسبقة للمنتج لتتمكن من مشاهدته كما يظهر على الموقع الخاص بنا
            </p>
          </>
        )}
      </div>
    </Card>
  );
};

export default ProductPreview;
