import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, PlusCircle, Trash2, Shirt, Package } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import ModalCustom from "@/components/ModalCustom";
import FormInput from "@/components/inputs/FormInput";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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

const SelectUpsellProductsModal = ({
  onConfirm,
  closeModal,
  currentSelection,
}: {
  onConfirm: (products: RelatedProduct[]) => void;
  closeModal: () => void;
  currentSelection: RelatedProduct[];
}) => {
  const [selectedProducts, setSelectedProducts] = useState<RelatedProduct[]>(currentSelection);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = (product: RelatedProduct) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id) ? prev.filter((p) => p.id !== product.id) : [...prev, product]
    );
  };

  const filteredProducts = mockProducts.filter((p: RelatedProduct) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4" dir="rtl">
      <h3 className="text-lg font-bold text-center mb-4">إضافة منتجات مكملة</h3>
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
        {filteredProducts.map((product: RelatedProduct) => {
          const isSelected = selectedProducts.some((p) => p.id === product.id);
          return (
            <div
              key={product.id}
              className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                isSelected ? "bg-blue-50 border-main" : "bg-gray-50 border-transparent hover:bg-gray-100"
              }`}
              onClick={() => handleToggle(product)}
            >
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
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="form-checkbox h-5 w-5 rounded text-main focus:ring-main"
                aria-label={`اختيار ${product.name}`}
                title={`اختيار ${product.name}`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">{selectedProducts.length} منتجات مختارة</p>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={closeModal} className="bg-gray-100">
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm(selectedProducts);
              closeModal();
            }}
            className="bg-main text-white hover:bg-main/90"
          >
            تأكيد
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddDiscountModal = ({
  onConfirm,
  closeModal,
  products,
}: {
  onConfirm: (data: { price: number; date: string }) => void;
  closeModal: () => void;
  products: RelatedProduct[];
}) => {
  const originalPrice = products.reduce((sum, p) => sum + p.price, 0);
  const { control } = useFormContext();

  return (
    <div className="p-6" dir="rtl">
      <h3 className="text-xl font-bold text-center mb-2">إضافة خصم علي الكوليكشن</h3>
      <p className="text-center text-gray-500 mb-6">قم بإضافة السعر المخفض وتاريخ انتهاء العرض</p>
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500">السعر الاصلي</p>
        <p className="text-3xl font-bold text-gray-800">₪ {originalPrice.toFixed(2)}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="temp_discount_price"
          label="السعر المخفض"
          type="number"
          placeholder="800.00"
        />
        <FormInput
          control={control}
          name="temp_end_date"
          label="تاريخ انتهاء العرض"
          type="text"
          placeholder="مايو 25, 2025 12:00 م"
          icon={<Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2 text-right">يجب ان يكون اقل من السعر الاصلي</p>
      <div className="flex justify-between items-center mt-8">
        <p className="text-sm text-gray-600">الخصم علي {products.length} من المنتجات</p>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={closeModal} className="bg-gray-100">
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={() => {
              const discountPrice = control._formValues.temp_discount_price;
              const endDate = control._formValues.temp_end_date;
              onConfirm({ price: Number(discountPrice), date: endDate });
              closeModal();
            }}
            className="bg-main text-white hover:bg-main/90"
          >
            تأكيد
          </Button>
        </div>
      </div>
    </div>
  );
};

const UpSell = () => {
  const { control, setValue } = useFormContext();
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  const { fields, remove, replace } = useFieldArray({
    control,
    name: "upsellProducts",
  });

  const handleConfirmSelection = (products: RelatedProduct[]) => {
    replace(products);
  };

  const handleConfirmDiscount = ({ price, date }: { price: number; date: string }) => {
    setValue("upsellDiscountPrice", price);
    setValue("upsellDiscountEndDate", date);
  };

  const handleRemoveAll = () => {
    replace([]);
    setValue("upsellDiscountPrice", undefined);
    setValue("upsellDiscountEndDate", undefined);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-700">قم باختيار منتجات مكملة لترشيحها</p>
        <ModalCustom
          isOpen={isSelectModalOpen}
          onOpenChange={setIsSelectModalOpen}
          btn={
            <Button type="button" variant="outline" className="border-dashed bg-white">
              <PlusCircle size={16} className="ml-2" /> اختيار منتجات
            </Button>
          }
          content={
            <SelectUpsellProductsModal
              currentSelection={fields as RelatedProduct[]}
              onConfirm={handleConfirmSelection}
              closeModal={() => setIsSelectModalOpen(false)}
            />
          }
        />
      </div>

      {fields.length === 0 ? (
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
          <div className="flex justify-end items-center">
            <Button type="button" variant="link" className="text-red-600" onClick={handleRemoveAll}>
              حذف الكل
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={(field as RelatedProduct).image}
                  alt={(field as RelatedProduct).name}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{(field as RelatedProduct).name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{(field as RelatedProduct).category}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <Package size={12} />
                    <span>{(field as RelatedProduct).stock}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-700">₪ {(field as RelatedProduct).price.toFixed(2)}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-red-500 bg-red-50 hover:bg-red-100"
                  onClick={() => remove(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          <ModalCustom
            isOpen={isDiscountModalOpen}
            onOpenChange={setIsDiscountModalOpen}
            btn={
              <Button type="button" variant="outline" className="w-full border-dashed bg-white">
                <Tag size={16} className="ml-2" /> تخفيض على المنتجات المختارة
              </Button>
            }
            content={
              <AddDiscountModal
                products={fields as RelatedProduct[]}
                onConfirm={handleConfirmDiscount}
                closeModal={() => setIsDiscountModalOpen(false)}
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export default UpSell;
