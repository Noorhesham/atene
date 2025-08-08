import { Edit, Trash, User } from "@/components/icons";
import { Mail, Phone } from "lucide-react";
import { ApiOrder } from "@/types";

export const OrdersList = ({
  orders,
  selectedOrderId,
  onSelectOrder,
}: {
  orders: ApiOrder[];
  selectedOrderId: number | null;
  onSelectOrder: (id: number) => void;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-bold text-main">جميع الطلبات ({orders.length})</h3>
    </div>
    <div className="flex-grow overflow-y-auto p-2">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onSelectOrder(order.id)}
          className={`p-3 rounded-lg mb-2 cursor-pointer ${
            selectedOrderId === order.id
              ? "bg-blue-50 border border-blue-300"
              : "border border-transparent hover:bg-gray-50"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="order-selection"
                checked={selectedOrderId === order.id}
                readOnly
                className="mt-1 form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-bold text-main">#{order.reference_id}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <User className="w-4 h-4" />
                  <span>{order.name}</span>
                </div>
              </div>
            </div>
            <p className="font-bold text-main">{order.total.toFixed(2)} ₪</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export const OrderDetails = ({ order, onEdit }: { order: ApiOrder; onEdit: (order: ApiOrder) => void }) => {
  const InfoRow = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">{icon}</span>
      <div>
        <span className="font-medium text-gray-500">{label}</span>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-main">تفاصيل الطلب</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(order)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-semibold hover:bg-blue-100"
          >
            <Edit className="w-4 h-4" /> تعديل الطلب
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm font-semibold hover:bg-red-100">
            <Trash className="w-4 h-4" /> حذف الطلب
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
        <img src={order.client.avatar_url} alt={order.name} className="w-12 h-12 rounded-full" />
        <div>
          <p className="font-bold text-gray-900">{order.name}</p>
          <p className="text-sm text-gray-500">{order.status}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-3 border rounded-lg">
          <h4 className="font-bold mb-2">معلومات عن العميل</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoRow label="البريد الالكتروني" value={order.email} icon={<Mail className="w-4 h-4 text-gray-600" />} />
            <InfoRow label="الهاتف" value={order.phone} icon={<Phone className="w-4 h-4 text-gray-600" />} />
            <InfoRow label="العنوان" value={order.address} icon={<User className="w-4 h-4 text-gray-600" />} />
          </div>
        </div>
        <div className="p-3 border rounded-lg">
          <h4 className="font-bold mb-2">تفاصيل المنتجات</h4>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-none">
              <div>
                <p className="font-semibold">{item.product?.name || `Product ID: ${item.product_id}`}</p>
                <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
              </div>
              <p className="font-semibold">{item.price.toFixed(2)} ₪</p>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t font-semibold flex justify-between">
            <span>الإجمالي:</span>
            <span>{order.total.toFixed(2)} ₪</span>
          </div>
        </div>
      </div>
    </div>
  );
};
