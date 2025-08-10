import { Input } from "@/components/ui/input";
import { Package, Search, Trash2, PlusCircle, Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import ModalCustom from "@/components/ModalCustom";
import { Button } from "@/components/ui/button";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiProduct } from "@/types";
import { EmptyProps } from "@/components/icons";

const SelectRelatedProductsModal = ({
  onConfirm,
  closeModal,
  products,
}: {
  onConfirm: (productIds: string[]) => void;
  closeModal: () => void;
  products: ApiProduct[];
}) => {
  const { watch } = useFormContext();
  const currentlyRelated = watch("upSells") || [];
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    currentlyRelated
      .filter((id: string | number) => typeof id === "string" || typeof id === "number")
      .map((id: string | number) => id.toString())
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = (productId: number) => {
    const productIdStr = productId.toString();
    setSelectedProducts((prev) =>
      prev.includes(productIdStr) ? prev.filter((id) => id !== productIdStr) : [...prev, productIdStr]
    );
  };

  const filteredProducts = products.filter((p: ApiProduct) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-right w-full border-b-1  mb-4 border-gray-800  pb-2">
        إضافة منتجات مرتبطة
      </h3>
      <div className="relative mb-4">
        <Input
          placeholder="ابحث عن منتج"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="البحث عن منتج"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {filteredProducts.map((product) => {
          const isSelected = selectedProducts.includes(product.id.toString());
          return (
            <div
              key={product.id}
              className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                isSelected ? "bg-blue-50 border-main" : "bg-gray-50 border-transparent hover:bg-gray-100"
              }`}
              onClick={() => handleToggle(product.id)}
            >
              {" "}
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="form-checkbox h-5 w-5 rounded text-main focus:ring-main"
                aria-label={`اختيار ${product.name}`}
                title={`اختيار ${product.name}`}
              />
              <img
                src={product.cover_url || product.cover || ""}
                alt={product.name}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div className="flex-grow">
                <p className="font-semibold text-gray-800">{product.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{product.category?.name || "غير محدد"}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <Package size={12} />
                  <span>متوفر</span>
                </div>
              </div>
              <div className="font-bold text-gray-700">₪ {product.price.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center mt-6">
        <p className="text-base text-gray-800">{selectedProducts.length} منتجات مختارة</p>
        <div className="flex gap-3">
          {" "}
          <Button
            type="button"
            size={"lg"}
            onClick={() => {
              onConfirm(selectedProducts);
              closeModal();
            }}
            className="bg-main text-white hover:bg-main/90"
          >
            تأكيد
          </Button>
          <Button type="button" variant="outline" size={"lg"} onClick={closeModal} className="bg-gray-100">
            إلغاء
          </Button>
        </div>
      </div>
    </div>
  );
};

const RelatedProducts = () => {
  const { control, watch } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: products = [], isLoading } = useAdminEntityQuery("products", {});
  const { replace } = useFieldArray({
    control,
    name: "upSells",
  });

  const relatedProductIds = watch("upSells") || [];
  const selectedProducts = products.filter((product) => relatedProductIds.includes(product.id));
  console.log("AdvancedSettings debugging:", {
    relatedProductIds,
    selectedProducts,
    productsLength: products.length,
    upSellsFromForm: watch("upSells"),
    formValues: watch(),
  });
  const handleConfirmSelection = (productIds: string[]) => {
    // Convert string IDs to numbers
    const cleanIds = productIds
      .filter((id) => id !== "[object Object]" && id !== "undefined" && id !== "null")
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));
    replace(cleanIds);
  };

  const handleRemoveAll = () => {
    replace([]);
  };

  const handleRemoveProduct = (productId: number) => {
    const newIds = relatedProductIds.filter((id: number) => id !== productId);
    replace(newIds);
  };

  // Clean up upSells field on mount to remove any bad data
  useEffect(() => {
    if (relatedProductIds.length > 0) {
      const cleanIds = relatedProductIds.filter((id: number) => typeof id === "number" && !isNaN(id) && id > 0);
      if (cleanIds.length !== relatedProductIds.length) {
        replace(cleanIds);
      }
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  console.log(products);
  return (
    <div className="space-y-6 p-3">
      <div className="flex justify-between items-center">
        <p className="text-[#393939] text-lg">قم باختيار منتجات لترشيحها في قائمة المنتج</p>
      </div>

      {selectedProducts.length === 0 ? (
        <div className="text-center flex flex-col items-center justify-center ">
          {" "}
          <ModalCustom
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            btn={
              <button
                style={{
                  backgroundColor: "rgba(91, 135, 185, 0.10)",
                }}
                className="flex ml-auto border border-main py-2 px-4 rounded-lg items-center gap-2 text-main"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4V20M4 12H20"
                    stroke="#2D496A"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                اختار منتجات{" "}
              </button>
            }
            content={
              <SelectRelatedProductsModal
                products={products}
                onConfirm={handleConfirmSelection}
                closeModal={() => setIsModalOpen(false)}
              />
            }
          />
          <EmptyProps />
          <p className="text-[#555] font-semibold text-xl">لم يتم اضافة اي سمات بعد!</p>
        </div>
      ) : (
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="flex text-main items-center gap-2 text-sm">
              <Info size={16} /> ماهي منتجات مرتبطة
            </p>
            <Button type="button" variant="link" className="text-red-600" onClick={handleRemoveAll}>
              حذف الكل
            </Button>
          </div>
          {selectedProducts.map((product) => (
            <div key={product.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={product.cover_url || product.cover || ""}
                  alt={product.name}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{product.category?.name || "غير محدد"}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <Package size={12} />
                    <span>متوفر</span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-red-500 bg-red-50 hover:bg-red-100"
                onClick={() => handleRemoveProduct(product.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
