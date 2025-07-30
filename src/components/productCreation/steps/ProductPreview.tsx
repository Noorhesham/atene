import { Heart, ImageIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

// Mock products data (same as in AdvancedSettings.tsx)
const mockProducts = [
  {
    id: "prod1",
    name: "بنطلون جينز و",
    category: "ملابس و اكسسوارات",
    price: 927.0,
    image: "https://placehold.co/40x40/E2E8F0/4A5568?text=P1",
    stock: 10,
  },
  {
    id: "prod2",
    name: "اسم المنتج",
    category: "ملابس و اكسسوارات",
    price: 117.0,
    image: "https://placehold.co/40x40/E2E8F0/4A5568?text=P2",
    stock: 10,
  },
  // ... other mock products
];

interface ProductImage {
  id: string;
  file: File;
  preview: string;
  isPrimary?: boolean;
}

const ProductPreview = () => {
  const { watch } = useFormContext();
  const [activeTab, setActiveTab] = useState("card");

  const productName = watch("productName");
  const price = watch("price");
  const imagesData = watch("images");
  const images = Array.isArray(imagesData) ? imagesData : [];
  const shortDescription = watch("shortDescription");
  const relatedProductsData = watch("relatedProducts");
  const relatedProducts = Array.isArray(relatedProductsData) ? relatedProductsData : [];

  const hasContent = productName || price || images.length > 0;
  const primaryImage =
    images.length > 0 ? images.find((img: ProductImage) => img.isPrimary)?.preview || images[0]?.preview : null;

  // Get related product details from mock data
  const selectedRelatedProducts = mockProducts.filter((product) => relatedProducts.includes(product.id));

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
                  src={primaryImage}
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

            {/* Related Products Section */}
            {selectedRelatedProducts.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h5 className="text-right font-semibold text-gray-800 mb-3">منتجات مرتبطة</h5>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRelatedProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      <div className="text-right flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">${product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
