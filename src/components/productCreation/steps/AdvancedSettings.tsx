import { Input } from "@/components/ui/input";
import { Package, Search, Trash2, PlusCircle, Info, Shirt } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import ModalCustom from "@/components/ModalCustom";
import { Button } from "@/components/ui/button";

type RelatedProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
};

const mockProducts: RelatedProduct[] = [
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
  {
    id: "prod3",
    name: "اسم المنتج",
    category: "ملابس و اكسسوارات",
    price: 637.0,
    image: "https://placehold.co/40x40/E2E8F0/4A5568?text=P3",
    stock: 2,
  },
  {
    id: "prod4",
    name: "اسم المنتج",
    category: "ملابس و اكسسوارات",
    price: 431.0,
    image: "https://placehold.co/40x40/E2E8F0/4A5568?text=P4",
    stock: 3,
  },
  {
    id: "prod5",
    name: "اسم المنتج",
    category: "ملابس و اكسسوارات",
    price: 164.0,
    image: "https://placehold.co/40x40/E2E8F0/4A5568?text=P5",
    stock: 1,
  },
  {
    id: "prod6",
    name: "اسم المنتج",
    category: "ملابس و اكسسوارات",
    price: 839.0,
    image: "https://placehold.co/40x40/E2E8F0/4A5568?text=P6",
    stock: 5,
  },
];

const SelectRelatedProductsModal = ({
  onConfirm,
  closeModal,
}: {
  onConfirm: (productIds: string[]) => void;
  closeModal: () => void;
}) => {
  const { watch } = useFormContext();
  const currentlyRelated = watch("relatedProducts") || [];
  const [selectedProducts, setSelectedProducts] = useState<string[]>(currentlyRelated);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const filteredProducts = mockProducts.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
          const isSelected = selectedProducts.includes(product.id);
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
              <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
              <div className="flex-grow">
                <p className="font-semibold text-gray-800">{product.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{product.category}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <Package size={12} />
                  <span>{product.stock}</span>
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

  const { replace } = useFieldArray({
    control,
    name: "relatedProducts",
  });

  const relatedProductIds = watch("relatedProducts") || [];
  const selectedProducts = mockProducts.filter((product) => relatedProductIds.includes(product.id));

  const handleConfirmSelection = (productIds: string[]) => {
    replace(productIds);
  };

  const handleRemoveAll = () => {
    replace([]);
  };

  const handleRemoveProduct = (productId: string) => {
    const newIds = relatedProductIds.filter((id: string) => id !== productId);
    replace(newIds);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-700">قم باختيار منتجات لترشيحها في قائمة المنتج</p>
        <ModalCustom
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          btn={
            <Button type="button" variant="outline" className="border-dashed bg-white">
              <PlusCircle size={16} className="ml-2" /> اختيار منتجات
            </Button>
          }
          content={
            <SelectRelatedProductsModal onConfirm={handleConfirmSelection} closeModal={() => setIsModalOpen(false)} />
          }
        />
      </div>

      {selectedProducts.length === 0 ? (
        <div className="text-center p-8 border-t">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="p-4 bg-gray-100 rounded-full text-gray-400">
              <Shirt size={32} />
            </div>
          </div>
          <p className="text-gray-500">لم يتم اختيار اي منتجات بعد!</p>
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
                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                <div>
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{product.category}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <Package size={12} />
                    <span>{product.stock}</span>
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
