import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

const StorePreview = () => {
  const { watch } = useFormContext();
  const storeName = watch("name");
  const storeDescription = watch("description");
  const storeLogo = watch("logo");
  const storeCover = watch("cover");
  console.log(storeCover);
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">معاينة صفحة المتجر</h3>
      <div className="border rounded-lg p-4 space-y-4">
        <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
          {storeCover[0] ? (
            <img
              src={storeCover?.[0]?.startsWith("http") ? storeCover[0] : `https://aatene.com/storage/${storeCover[0]}`}
              alt="Store Cover"
              className="w-full h-full object-top object-cover"
            />
          ) : (
            <ImageIcon className="w-10 h-10 text-gray-400" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {storeLogo ? (
              <img
                src={
                  typeof storeLogo === "string"
                    ? storeLogo.startsWith("http")
                      ? storeLogo
                      : `https://aatene.com/storage/${storeLogo}`
                    : URL.createObjectURL(storeLogo)
                }
                alt="Store Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <h4 className="text-xl font-bold">{storeName || "اسم المتجر"}</h4>
        </div>
        <p className="text-sm text-gray-600">{storeDescription || "وصف المتجر سيظهر هنا..."}</p>
      </div>
    </Card>
  );
};

export default StorePreview;
