import { ApiProduct } from "@/types";
import { useMemo, useState } from "react";

export const VariantSelectionModal = ({
  product,
  onClose,
  onConfirm,
}: {
  product: ApiProduct;
  onClose: () => void;
  onConfirm: (product: ApiProduct, selectedVariants: Record<string, string>) => void;
}) => {
  // Build attribute -> options map from product.variations[].attributeOptions
  const attributesMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    const variations = (product as unknown as any)?.variations as any[] | undefined;
    if (Array.isArray(variations)) {
      variations.forEach((variation) => {
        const attrOpts = variation?.attributeOptions || [];
        attrOpts.forEach((ao: any) => {
          const attrName = ao?.attribute?.title || ao?.attribute?.name || "";
          const optTitle = ao?.option?.title || ao?.option?.name || "";
          if (!attrName || !optTitle) return;
          if (!map.has(attrName)) map.set(attrName, new Set<string>());
          map.get(attrName)!.add(optTitle);
        });
      });
    }
    return map;
  }, [product]);

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    attributesMap.forEach((options, key) => {
      const first = Array.from(options)[0];
      if (first) initialState[key] = first;
    });
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
          {Array.from(attributesMap.entries()).map(([type, options]) => (
            <div key={type}>
              <h4 className="font-semibold mb-2">{type}</h4>
              <div className="flex flex-wrap gap-2 justify-end">
                {Array.from(options).map((option) => (
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
