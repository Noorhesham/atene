import { useState, useMemo } from "react";

import { OrdersList, OrderDetails } from "./OrdersList";

import EditOrderView from "./EditOrderView";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiOrder } from "@/types";
import { Loader2, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const OrdersPage = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Use your hook to fetch orders
  const { data: orders, isLoading } = useAdminEntityQuery("orders");

  // Filter orders based on selected status
  const filteredOrders = useMemo(() => {
    if (!selectedStatus) return orders;
    return orders.filter((order: ApiOrder) => order.status === selectedStatus);
  }, [orders, selectedStatus]);

  const selectedOrder = useMemo(() => {
    return filteredOrders.find((o: ApiOrder) => o.id === selectedOrderId) || null;
  }, [filteredOrders, selectedOrderId]);

  // Get unique statuses from orders
  const orderStatuses = useMemo(() => {
    const statuses = [...new Set(orders.map((order: ApiOrder) => order.status))];
    return statuses.sort();
  }, [orders]);

  // Get count for each status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((order: ApiOrder) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const handleSelectOrder = (id: number) => {
    setSelectedOrderId(id);
    setIsEditing(false); // Always show details first when a new order is selected
  };

  const handleEditOrder = () => {
    if (selectedOrder) {
      setIsEditing(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "refunded":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "processing":
        return "قيد المعالجة";
      case "shipped":
        return "تم الشحن";
      case "delivered":
        return "تم التوصيل";
      case "cancelled":
        return "ملغي";
      case "refunded":
        return "مسترد";
      default:
        return status;
    }
  };

  const clearFilters = () => {
    setSelectedStatus(null);
    setSelectedOrderId(null);
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
          {/* Left: Filter Panel */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Filter className="w-4 h-4" />
                فلترة الطلبات
              </h3>
              {selectedStatus && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Status Filters */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">حالة الطلب</h4>

              {/* All Orders Option */}
              <button
                onClick={() => setSelectedStatus(null)}
                className={`w-full text-right p-3 rounded-lg border transition-colors ${
                  selectedStatus === null
                    ? "bg-main text-white border-main"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">جميع الطلبات</span>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {orders.length}
                  </Badge>
                </div>
              </button>

              {/* Status Options */}
              {orderStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full text-right p-3 rounded-lg border transition-colors ${
                    selectedStatus === status
                      ? "bg-main text-white border-main"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${selectedStatus === status ? "bg-white" : "bg-gray-400"}`}
                      ></div>
                      <span className="font-medium">{getStatusText(status)}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={selectedStatus === status ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}
                    >
                      {statusCounts[status] || 0}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Filters Summary */}
            {selectedStatus && (
              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="text-sm font-semibold text-blue-800 mb-2">الفلتر النشط:</h5>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(selectedStatus)}`}>{getStatusText(selectedStatus)}</Badge>
                  <span className="text-sm text-blue-600">({filteredOrders.length} طلب)</span>
                </div>
              </div>
            )}
          </div>

          {/* Middle: Orders List */}
          <div className="col-span-12 lg:col-span-4">
            <OrdersList orders={filteredOrders} selectedOrderId={selectedOrderId} onSelectOrder={handleSelectOrder} />
          </div>

          {/* Right: Order Details or Empty State */}
          <div className="col-span-12 lg:col-span-5">
            {selectedOrder ? (
              <OrderDetails order={selectedOrder} onEdit={handleEditOrder} />
            ) : (
              <div className="bg-white rounded-lg border h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-bold text-main mb-1">لم يتم اختيار طلب</h3>
                <p className="text-gray-500">
                  {selectedStatus
                    ? `قم بتحديد طلب من قائمة الطلبات بحالة "${getStatusText(selectedStatus)}"`
                    : "قم بتحديد الطلب لمشاهدة تفاصيله هنا"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default OrdersPage;
