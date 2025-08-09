import { Edit, Trash, User as UserIcon, Mail, Phone } from "lucide-react";
import { ApiOrder } from "@/types";
import { useState } from "react";
import ModalCustom from "@/components/ModalCustom";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import toast from "react-hot-toast";

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
                aria-label={`اختيار الطلب ${order.reference_id}`}
                title={`اختيار الطلب ${order.reference_id}`}
              />
              <div>
                <p className="font-bold text-main">#{order.reference_id}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <UserIcon className="w-4 h-4" />
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
  const [orderToDelete, setOrderToDelete] = useState<ApiOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { remove: deleteOrder, refetch } = useAdminEntityQuery("orders");

  const handleDelete = async (orderToDelete: ApiOrder) => {
    setIsDeleting(true);
    try {
      await deleteOrder(orderToDelete.id);
      refetch();
      setOrderToDelete(null);
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const InfoRow = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">{icon}</span>
      <div>
        <span className="font-medium text-gray-500">{label}</span>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );

  console.log(order);
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
          <ModalCustom
            isOpen={!!orderToDelete}
            onOpenChange={(isOpen: boolean) => !isOpen && setOrderToDelete(null)}
            btn={
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm font-semibold hover:bg-red-100"
                onClick={() => setOrderToDelete(order)}
              >
                <Trash className="w-4 h-4" /> حذف الطلب
              </button>
            }
            title="تأكيد حذف الطلب"
            content={
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                  <Trash size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">هل أنت متأكد من حذف هذا الطلب؟</h3>
                {orderToDelete && (
                  <p className="text-gray-600 text-center mb-2">
                    سيتم حذف الطلب: <span className="font-medium">#{orderToDelete.reference_id}</span>
                  </p>
                )}
                <p className="text-red-600 text-sm text-center mb-8">
                  لا يمكن التراجع عن هذا الإجراء وسيتم حذف الطلب نهائياً
                </p>
                <div className="flex gap-3 w-full max-w-sm">
                  <button
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-300"
                    onClick={() => orderToDelete && handleDelete(orderToDelete)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
                  </button>
                  <button
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300"
                    onClick={() => setOrderToDelete(null)}
                    disabled={isDeleting}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            }
          />
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
            <InfoRow label="العنوان" value={order.address} icon={<UserIcon className="w-4 h-4 text-gray-600" />} />
          </div>
        </div>
        <div className="p-3 border rounded-lg">
          <h4 className="font-bold mb-2">تفاصيل المنتجات</h4>
          {order.items.map((item) => {
            const productData = item.product as { cover?: string; cover_url?: string } | undefined;
            const cover = productData?.cover || productData?.cover_url || "";
            return (
              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-none">
                <div className="flex items-center gap-3">
                  <img
                    src={cover}
                    alt={item.product?.name || String(item.product_id)}
                    className="w-12 h-12 rounded object-cover bg-gray-100"
                  />
                  <div>
                    <p className="font-semibold">{item.product?.name || `Product ID: ${item.product_id}`}</p>
                    <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">{item.price.toFixed(2)} ₪</p>
              </div>
            );
          })}
          <div className="mt-2 pt-2 border-t font-semibold flex justify-between">
            <span>الإجمالي:</span>
            <span>{order.total.toFixed(2)} ₪</span>
          </div>
        </div>
      </div>
    </div>
  );
};
