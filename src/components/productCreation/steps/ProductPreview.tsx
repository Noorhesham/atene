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
  const primaryImage = images.length > 0 ? images[0] : null;

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex justify-center mb-6">
        <div className="p-1 rounded-lg flex items-center gap-1">
          <Button
            onClick={() => setActiveTab("page")}
            variant={activeTab === "page" ? "ghost" : "default"}
            className={`px-6 py-2 text-sm font-semibold ${
              activeTab === "page" ? "text-gray-500" : "bg-white text-blue-600 shadow-sm"
            }`}
          >
            صفحة المنتج
          </Button>
          <Button
            onClick={() => setActiveTab("card")}
            variant={activeTab === "card" ? "ghost" : "default"}
            className={`px-6 py-2 text-sm font-semibold ${
              activeTab === "card" ? "text-gray-500" : "bg-white text-blue-600 shadow-sm"
            }`}
          >
            بطاقة المنتج
          </Button>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center text-center">
        {hasContent ? (
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4">
            <div className="relative">
              {primaryImage ? (
                <img
                  src={
                    typeof primaryImage === "string"
                      ? primaryImage.startsWith("http")
                        ? primaryImage
                        : `${STORAGE_URL}/${primaryImage}`
                      : URL.createObjectURL(primaryImage)
                  }
                  alt={productName || "Product"}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 left-2 space-y-2">
                <Button size="icon" className="w-8 h-8 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white">
                  <Heart size={16} />
                </Button>
                <Button size="icon" className="w-8 h-8 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white">
                  <Share2 size={16} />
                </Button>
              </div>
            </div>
            <div className="text-right mt-4">
              <h4 className="font-bold text-gray-800 truncate">{productName || "اسم المنتج..."}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{shortDescription || "وصف المنتج..."}</p>
              <p className="text-gray-500 font-semibold mt-2">${price ? price : "0.00"}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">ميزة معاينة المنتج</h3>
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
