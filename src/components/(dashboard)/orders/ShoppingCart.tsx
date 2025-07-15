import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash } from "@/components/icons";
import { Plus, Minus, X } from "lucide-react";

export const ShoppingCartComponent = ({
  items,
  onUpdateQuantity,
  onClearCart,
}: {
  items: any[];
  onUpdateQuantity: (productId: any, newQuantity: any) => void;
  onClearCart: () => void;
}) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-main">سلة الطلب ({items.length} قطع)</h3>
        <Button variant="destructive" className="bg-red-50 text-red-600 px-2 py-1 h-auto text-xs" onClick={onClearCart}>
          <X /> تفريغ السلة
        </Button>
      </div>
      {items.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <img src="/cart.png" alt="" className="w-32 h-32" />
          </div>
          <h3 className="text-xl font-bold text-main mb-1">لم يتم اختيار منتج</h3>
          <p className="text-[#AAA] lg:text-base text-sm">يمكنك إضافة أول منتج للسلة بالضغط عليه من القائمة</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-grow">
                <p className="font-semibold text-main">{item.name}</p>
                <p className="font-bold text-main text-lg">₪ {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={14} />
                </Button>
                <span className="px-3 font-semibold">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="border-t pt-4 mt-4 space-y-3">
        <div className="flex justify-between font-semibold text-lg">
          <span>الاجمالي:</span>
          <span>₪ {total.toFixed(2)}</span>
        </div>
        <Button className="w-full bg-main text-white hover:bg-main/90 py-3 text-base">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path
              d="M12.5 8.5L8.5 12.5M8.5 12.5L12.5 16.5M8.5 12.5H16.5M22.5 12.5C22.5 18.0228 18.0228 22.5 12.5 22.5C6.97715 22.5 2.5 18.0228 2.5 12.5C2.5 6.97715 6.97715 2.5 12.5 2.5C18.0228 2.5 22.5 6.97715 22.5 12.5Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>{" "}
          استكمال الطلب
        </Button>
      </div>
    </div>
  );
};

export default ShoppingCartComponent;
