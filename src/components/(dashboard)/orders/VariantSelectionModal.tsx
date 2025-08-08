import { ApiProduct } from "@/types/api";
import { useState } from "react";

export const VariantSelectionModal = ({
  product,
  onClose,
  onConfirm,
}: {
  product: ApiProduct;
  onClose: () => void;
  onConfirm: (product: ApiProduct, selectedVariants: Record<string, string>) => void;
}) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    if (product.variants) {
      for (const key in product.variants) {
        initialState[key] = product.variants[key][0]; // Default to the first option
      }
    }
    return initialState;
  });

  const handleSelect = (variantType: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantType]: value }));
  };

  const handleConfirm = () => {
    onConfirm(product, selectedVariants);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-2 text-right">اختر الاختلاف</h3>
        <p className="text-sm text-gray-500 mb-6 text-right">
          يحتوي هذا المنتج على اختلافات، يرجى اختيار أي اختلاف تريد
        </p>
        <div className="space-y-4 text-right">
          {product.variants &&
            Object.entries(product.variants).map(([type, options]) => (
              <div key={type}>
                <h4 className="font-semibold mb-2">{type}</h4>
                <div className="flex flex-wrap gap-2 justify-end">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(type, option)}
                      className={`px-4 py-1.5 rounded-md border text-sm font-medium ${
                        selectedVariants[type] === option
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <div className="mt-8 flex gap-3 justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 font-semibold">
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
};
