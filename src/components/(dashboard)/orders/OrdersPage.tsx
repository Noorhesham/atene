import React, { useState } from "react";
import { ChevronLeft, Add, ShoppingCart } from "../../../components/icons";
import { FilterPanelProps, Order } from "@/types/orders";
import { OrdersList, OrderDetails } from "./OrdersList";
import { Header } from "./Header";
import EditOrderView from "./EditOrderView";
import { Input } from "@/components/ui/input";
import { useAdminEntityQuery, ApiOrder } from "@/hooks/useUsersQuery";
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

const EmptyState: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col items-center justify-center text-center p-6">
    <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-4">
      <ShoppingCart />
    </div>
    <h3 className="text-xl font-bold text-main mb-1">لم يتم اختيار طلب</h3>
    <p className="text-gray-500">قم بتحديد الطلب لمشاهدة تفاصيله هنا</p>
  </div>
);

const OrdersPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const {
    data: orders,
    isLoading,
    error,
    totalPages,
    setSearchQuery: setOrderSearchQuery,
    setCurrentPage: setOrderCurrentPage,
  } = useAdminEntityQuery("orders", {
    initialPage: currentPage,
    queryParams: { search: searchQuery },
  }) as {
    data: ApiOrder[];
    isLoading: boolean;
    error: string | null;
    totalPages: number;
    setSearchQuery: (query: string) => void;
    setCurrentPage: (page: number) => void;
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(orderId)) {
        newSelection.delete(orderId);
      } else {
        newSelection.add(orderId);
      }
      return Array.from(newSelection);
    });
  };

  const orderForDetails =
    selectedOrders.length === 1 ? orders.find((o: ApiOrder) => o.reference_id === selectedOrders[0]) : null;

  // Update filter categories counts
  const filteredOrders = orders?.filter((order: ApiOrder) => {
    if (!activeStatus) return true;
    return order.status === activeStatus;
  });

  const updatedFilterCategories = filterCategories.map((cat) => ({
    ...cat,
    active: cat.status === activeStatus,
    count:
      orders?.filter((order: ApiOrder) => {
        if (cat.status === null) return true;
        return order.status === cat.status;
      }).length || 0,
  }));

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-500">
        حدث خطأ أثناء تحميل الطلبات
      </div>
    );
  }
  console.log(orders);
  return (
    <div className="w-full min-h-screen p-4 lg:p-6 font-sans bg-gray-50">
      <Header mode="orders" onAddOrder={() => setIsEditing(true)} />

      {isEditing ? (
        <EditOrderView order={orderForDetails} onBack={() => setIsEditing(false)} />
      ) : (
        <div>
          <div className="w-full lg:w-auto flex items-center gap-4 mb-6">
            <Input
              placeholder="البحث في الطلبات..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOrderSearchQuery(e.target.value);
              }}
              className="max-w-sm"
            />
          </div>
          <div className="grid grid-cols-12 gap-6" dir="rtl">
            <div className="col-span-12 lg:col-span-3">
              <FilterPanel
                categories={updatedFilterCategories}
                onFilterChange={(status) => {
                  setActiveStatus(status);
                  setSelectedOrders([]);
                }}
              />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <OrdersList
                orders={(filteredOrders || []).map((order: ApiOrder) => ({
                  id: order.reference_id,
                  customerName: order.name,
                  date: "-",
                  price: order.total.toString(),
                  client: order.client,
                  items: order.items,
                  address: order.address,
                  email: order.email,
                  phone: order.phone,
                  notes: order.notes,
                  status: order.status,
                  sub_total: order.sub_total,
                  discount_total: order.discount_total,
                  shipping_cost: order.shipping_cost,
                  total: order.total,
                  reference_id: order.reference_id,
                  name: order.name,
                }))}
                selectedOrders={selectedOrders}
                onSelectOrder={handleSelectOrder}
              />
            </div>
            <div className="col-span-12 lg:col-span-5">
              {orderForDetails ? <OrderDetails order={orderForDetails as unknown as Order} /> : <EmptyState />}
            </div>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      setOrderCurrentPage(page);
                    }}
                    className={`px-3 py-1 rounded ${currentPage === page ? "bg-main text-white" : "bg-gray-100"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default OrdersPage;
