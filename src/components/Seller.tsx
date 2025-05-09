import { useState } from "react";
import AbuseReport from "./forms/AbuseRebort";
import ModalCustom from "./ModalCustom";
import { Button } from "./ui/button";
import { Star, ShoppingBag, Clock, ShieldCheckIcon, Flag } from "lucide-react";

const Seller = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img className="w-12 h-12 rounded-full object-cover" src="/Rectangle 4172.png" alt="D-Jewellry" />
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900">d-jewellry</h3>
            <span className="text-sm text-gray-500">عمان</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" className="text-sm py-1 px-3 h-8 rounded-full text-white border-0">
            + تابع
          </Button>
          <ModalCustom
            onOpenChange={setOpen}  
            isOpen={open}
            btn={
              <Button
                variant="destructive"
                className="text-sm  !rounded-full flex items-center py-1 px-3 h-8  text-white"
              >
                <Flag />
                بلاغ عن البائع
              </Button>
            }
            content={<AbuseReport closeModal={() => setOpen(false)} />}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>عضو منذ 19-03-2023</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheckIcon className="w-4 h-4" />
            <span> تاجر معتمد</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>التقييم العام 5.0</span>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-4 h-4" />
            <span>عدد الطلبات المنفذة 27</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seller;
