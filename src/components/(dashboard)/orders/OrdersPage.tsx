import { useState, useMemo } from "react";

import { OrdersList, OrderDetails } from "./OrdersList";

import EditOrderView from "./EditOrderView";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiOrder } from "@/types";
import { Loader2 } from "lucide-react";

const OrdersPage = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Use your hook to fetch orders
  const { data: orders, isLoading } = useAdminEntityQuery("orders");

  const selectedOrder = useMemo(() => {
    return orders.find((o: ApiOrder) => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  const handleSelectOrder = (id: number) => {
    setSelectedOrderId(id);
    setIsEditing(false); // Always show details first when a new order is selected
  };

  const handleEditOrder = () => {
    if (selectedOrder) {
      setIsEditing(true);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  console.log(selectedOrder);
  return (
    <div className="w-full min-h-screen p-4 lg:p-6 font-sans bg-gray-50" dir="rtl">
      <header className="mb-4">
        <p className="text-gray-500 text-sm">الرئيسية / الطلبات</p>
        {isEditing && <h2 className="text-xl font-bold">تعديل الطلب #{selectedOrder?.reference_id}</h2>}
      </header>

      {isEditing && selectedOrder ? (
        <EditOrderView orderToEdit={selectedOrder} onBack={() => setIsEditing(false)} />
      ) : (
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left: Filter Panel (Placeholder) */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-lg border p-4">
            <h3 className="font-bold mb-4">فلترة الطلبات</h3>
            {/* Filter UI goes here */}
          </div>

          {/* Middle: Orders List */}
          <div className="col-span-12 lg:col-span-4">
            <OrdersList orders={orders} selectedOrderId={selectedOrderId} onSelectOrder={handleSelectOrder} />
          </div>

          {/* Right: Order Details or Empty State */}
          <div className="col-span-12 lg:col-span-5">
            {selectedOrder ? (
              <OrderDetails order={selectedOrder} onEdit={handleEditOrder} />
            ) : (
              <div className="bg-white rounded-lg border h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-bold text-main mb-1">لم يتم اختيار طلب</h3>
                <p className="text-gray-500">قم بتحديد الطلب لمشاهدة تفاصيله هنا</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default OrdersPage;
