import { Store } from "@/types/product";
import { Button } from "./ui/button";
import { Star } from "lucide-react";

interface SellerProps {
  store: Store;
}

const Seller = ({ store }: SellerProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {store.logo && <img src={store.logo} alt={store.name} className="w-16 h-16 rounded-full object-cover" />}
          <div>
            <h3 className="text-lg font-semibold">{store.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < (store.review_rate || 0) ? "text-yellow-500" : "text-gray-300"}`}
                    fill={i < (store.review_rate || 0) ? "oklch(79.5% 0.184 86.047)" : "#d1d5dc"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({store.review_count || 0} تقييم)</span>
            </div>
            {store.address && <p className="text-sm text-gray-600 mt-1">{store.address}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full">
            زيارة المتجر
          </Button>
          {store.whats_app && (
            <Button variant="outline" className="w-full">
              واتساب
            </Button>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold">{store.orders_count || 0}</div>
          <div className="text-sm text-gray-600">الطلبات</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold">{store.review_count || 0}</div>
          <div className="text-sm text-gray-600">التقييمات</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold">{store.review_rate?.toFixed(1) || 0}</div>
          <div className="text-sm text-gray-600">متوسط التقييم</div>
        </div>
      </div>
    </div>
  );
};

export default Seller;
