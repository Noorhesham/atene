import React, { useState, useMemo } from "react";
import { ChevronLeft, Add, ShoppingCart } from "../../../components/icons";
import { FilterPanelProps, Order } from "@/types/orders";
import { OrdersList, OrderDetails } from "./OrdersList";
import { Header } from "./Header";
import EditOrderView from "./EditOrderView";
import { Input } from "@/components/ui/input";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiOrder } from "@/types/api";
import { Loader2 } from "lucide-react";

const filterCategories = [
  { name: "جميع الطلبات", count: 0, active: true, status: null },
  { name: "الطلبات المعلقة", count: 0, status: "pending" },
  { name: "الطلبات المكتملة", count: 0, status: "completed" },
  { name: "الطلبات الملغية", count: 0, status: "cancelled" },
];

const FilterPanel: React.FC<FilterPanelProps> = ({ categories, onFilterChange }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-main">جميع الطلبات (14)</h2>
      <button className="p-1 rounded-md hover:bg-gray-100" title="Toggle Panel">
        <ChevronLeft />
      </button>
    </div>
    <ul>
      {categories.map(
        (cat: { name: string; count: number; active?: boolean; status: string | null }, index: number) => (
          <li
            key={index}
            onClick={() => onFilterChange(cat.status)}
            className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
              cat.active ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center gap-2">
              {cat.active && <span className="w-1.5 h-1.5 bg-blue-700 rounded-full"></span>}
              {cat.name}
            </span>
            <span>({cat.count})</span>
          </li>
        )
      )}
    </ul>
    <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
      <Add />
      <span>إضافة حالة جديد</span>
    </button>
  </div>
);

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
