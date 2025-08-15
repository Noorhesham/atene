import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Camera, ImageIcon } from "lucide-react";

const StorePreview = () => {
  const { watch } = useFormContext();
  const storeName = watch("name");
  const storeDescription = watch("description");
  const storeLogo = watch("logo");
  const storeCover = watch("cover");
  console.log(storeCover);
  return (
    <Card className="p-6  bg-white rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-center text-main">معاينة صفحة المتجر</h3>
      {/* Browser-like frame */}
      <div className="bg-white border max-w-md min-h-[400px] border-gray-200 rounded-xl shadow-sm p-3 mx-auto  w-full">
        {/* Browser top bar */}
        <div className="flex items-center justify-between bg-[#FFDADA] rounded-t-xl gap-1.5 py-2 ">
          <div className="flex items-center gap-0.5 px-2">
            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
            <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
            <span className="w-1 h-1 bg-green-400 rounded-full"></span>
          </div>
          <img src="/Frame 1871278206.svg" alt="" />
        </div>

        {/* Store Content */}
        <div className="relative ">
          {/* Cover Image */}
          <div className="w-full h-28 bg-gray-100  flex items-center justify-center overflow-hidden">
            {storeCover?.[0] ? (
              <img
                src={
                  storeCover?.[0]?.startsWith("http")
                    ? storeCover?.[0]
                    : `https://aatene.com/storage/${storeCover?.[0]}`
                }
                alt="Store Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-10 h-10 text-gray-400" />
            )}
          </div>

          {/* Logo Image - Overlapping */}
          <div className="flex  items-center absolute top-20 right-5 justify-center">
            <div className="  w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
              {storeLogo ? (
                <img
                  src={
                    typeof storeLogo === "string"
                      ? storeLogo?.startsWith("http")
                        ? storeLogo
                        : `https://aatene.com/storage/${storeLogo}`
                      : URL.createObjectURL(storeLogo)
                  }
                  alt="Store Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h4 className="text-[8.96px]  pt-5 mr-4 font-bold text-gray-800">{storeName || "اسم المتجر"}</h4>
          </div>
        </div>

        {/* Store Details */}
        <div className="text-center pt-7 px-4">
          <p className="text-sm  pb-20  border-input text-gray-600 mt-4 text-right  border rounded-md p-3 min-h-[60px]">
            {storeDescription || "هنا مثال لوصف المتجر"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StorePreview;
