import { useState, useMemo } from "react";
import { OrderDetails } from "./OrdersList";
import EditOrderView from "./EditOrderView";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiOrder } from "@/types";
import { Loader2, Filter, X, CheckSquare, ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Order from "@/components/Order";
import { formatDate } from "@/utils/cn";

const OrdersPage = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc");
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  // Use your hook to fetch orders
  const { data: orders, isLoading } = useAdminEntityQuery("orders");

  // Filter orders based on selected status and search query
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((order: ApiOrder) => order.status === selectedStatus);
    }

    // Filter by search query (order number)
    if (searchQuery.trim()) {
      filtered = filtered.filter((order: ApiOrder) =>
        order.reference_id.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    return filtered;
  }, [orders, selectedStatus, searchQuery]);

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

    // Also add to selected orders if not already selected
    if (!selectedOrders.has(id)) {
      const newSelected = new Set(selectedOrders);
      newSelected.add(id);
      setSelectedOrders(newSelected);
    }
  };

  const handleEditOrder = () => {
    if (selectedOrder) {
      setIsEditing(true);
    }
  };

  const handleOrderSelection = (orderId: number, isSelected: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (isSelected) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map((order: ApiOrder) => order.id)));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    if (e.target.value.trim() !== "") {
      setSelectedOrderId(null);
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

  return (
    <div className="w-full min-h-screen p-4 lg:p-6 font-sans bg-gray-50" dir="rtl">
      <header className="mb-4 text-base text-[#8E8E8E]">
        <p className="">الرئيسية / الطلبات</p>
        {isEditing && <h2 className=" font-bold">تعديل الطلب #{selectedOrder?.reference_id}</h2>}
      </header>
      {!isEditing && (
        <div className="flex w-full justify-between items-center mb-4">
          <div className="relative w-full  ">
            <input
              type="text"
              placeholder="ابحث برقم الطلب"
              className="w-full bg-white py-3 pr-10 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
          </div>
        </div>
      )}
      {isEditing && selectedOrder ? (
        <EditOrderView orderToEdit={selectedOrder} onBack={() => setIsEditing(false)} />
      ) : (
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left: Filter Panel */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-lg  ">
            {/* Status Filters */}
            <div className=" rounded-md overflow-hidden">
              {/* All Orders Option */}
              <button
                style={{
                  backgroundColor: selectedStatus === null ? "rgba(91, 136, 186, 0.20)" : "transparent",
                }}
                onClick={() => setSelectedStatus(null)}
                className={`w-full text-right px-4 py-4  text-sm font-medium flex justify-between items-center`}
              >
                <div className="flex items-center gap-2">
                  <span className=" text-main text-base">جميع الطلبات</span>
                  <span className="text-xs text-gray-500">({orders.length})</span>
                </div>
                {selectedStatus === null && <ChevronLeft size={16} />}
              </button>

              {/* Status Options */}
              {orderStatuses.map((status) => (
                <button
                  style={{
                    backgroundColor: selectedStatus === status ? "rgba(91, 136, 186, 0.20)" : "transparent",
                  }}
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full text-right px-4 py-4  text-sm font-medium flex justify-between items-center`}
                >
                  <div className="flex items-center gap-2">
                    <span className=" text-main text-base">{getStatusText(status)}</span>
                    <span className="text-xs text-gray-500">({statusCounts[status] || 0})</span>
                  </div>
                  {selectedStatus === status && <ChevronLeft size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Middle: Orders List */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
              {/* Header with selection and sort */}
              <div className="p-4 border-b shadow-lg border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center gap-2 text-gray-600 hover:text-main transition-colors"
                      title="تحديد الكل"
                      aria-label="تحديد الكل"
                    >
                      <CheckSquare
                        className={`w-5 h-5 ${
                          selectedOrders.size === filteredOrders.length ? "text-main" : "text-gray-400"
                        }`}
                      />
                      <span className=" font-semibold  text-[18.261px]">({selectedOrders.size}) طلب محدد</span>
                    </button>
                  </div>
                  <Order orderDir={orderDir} setOrderDir={setOrderDir} />
                </div>
              </div>

              {/* Orders List */}
              <div className="flex-grow overflow-y-auto p-2">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleSelectOrder(order.id)}
                    className={`p-4 border-b border-input rounded-none pb-4 mb-3 cursor-pointer transition-all duration-200 `}
                  >
                    {/* Top Row: Price (left) and Order ID + Checkbox (right) */}
                    <div className="flex items-start justify-between mb-3">
                      {/* Right: Order ID + Checkbox */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order.id)}
                          onChange={(e) => handleOrderSelection(order.id, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 "
                          title={`تحديد الطلب ${order.reference_id}`}
                          aria-label={`تحديد الطلب ${order.reference_id}`}
                        />
                        <span className="font-medium text-gray-700">#{order.reference_id}</span>
                      </div>
                      {/* Left: Price */}
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-base text-[#393939]">{order.total.toFixed(2)}</span>
                        <span className="text-gray-600 text-lg">₪</span>
                      </div>
                    </div>

                    {/* Bottom Row: Status, Customer, Date */}
                    <div dir="rtl" className="flex items-center  gap-2 text-sm font-semibold text-[#717171]">
                      {/* Left: Status */}
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path
                            d="M13.5 1.5V3M4.5 1.5V3"
                            stroke="#A7A7A5"
                            stroke-width="1.125"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            opacity="0.4"
                            d="M8.99662 9.75H9.00338M8.99662 12.75H9.00338M11.9933 9.75H12M6 9.75H6.00673M6 12.75H6.00673"
                            stroke="#252522"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2.625 6H15.375"
                            stroke="#252522"
                            stroke-width="1.125"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M1.875 9.1824C1.875 5.91446 1.875 4.28046 2.81409 3.26523C3.75318 2.25 5.26462 2.25 8.2875 2.25H9.7125C12.7354 2.25 14.2469 2.25 15.1859 3.26523C16.125 4.28046 16.125 5.91446 16.125 9.1824V9.5676C16.125 12.8356 16.125 14.4695 15.1859 15.4848C14.2469 16.5 12.7354 16.5 9.7125 16.5H8.2875C5.26462 16.5 3.75318 16.5 2.81409 15.4848C1.875 14.4695 1.875 12.8356 1.875 9.5676V9.1824Z"
                            stroke="#A7A7A5"
                            stroke-width="1.125"
                            stroke-linejoin="round"
                          />
                          <path d="M2.25 6H15.75" stroke="#A7A7A5" stroke-width="1.125" stroke-linejoin="round" />
                        </svg>{" "}
                        <span className="text-xs">
                          {order.created_at ? formatDate(order.created_at) : "منذ 4 أشهر"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                          <path
                            d="M4.38531 10.821C3.44197 11.3823 0.968641 12.529 2.47531 13.9643C3.21064 14.665 4.02997 15.1663 5.05997 15.1663H10.9386C11.9693 15.1663 12.7886 14.665 13.524 13.9643C15.0306 12.529 12.5573 11.3823 11.614 10.821C10.5192 10.1742 9.27088 9.83307 7.99931 9.83307C6.72773 9.83307 5.48011 10.1742 4.38531 10.821ZM11 4.83301C11 5.62866 10.6839 6.39172 10.1213 6.95433C9.55869 7.51694 8.79562 7.83301 7.99997 7.83301C7.20433 7.83301 6.44126 7.51694 5.87865 6.95433C5.31605 6.39172 4.99997 5.62866 4.99997 4.83301C4.99997 4.03736 5.31605 3.2743 5.87865 2.71169C6.44126 2.14908 7.20433 1.83301 7.99997 1.83301C8.79562 1.83301 9.55869 2.14908 10.1213 2.71169C10.6839 3.2743 11 4.03736 11 4.83301Z"
                            stroke="#717171"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <span className="text-xs">{order.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            order.status === "pending"
                              ? "bg-main"
                              : order.status === "completed"
                              ? "bg-green-500"
                              : order.status === "cancelled"
                              ? "bg-red-500"
                              : "bg-main"
                          }`}
                        ></div>
                        <span className="text-xs">
                          {order.status === "pending"
                            ? "قيد التنفيذ"
                            : order.status === "completed"
                            ? "مكتمل"
                            : order.status === "cancelled"
                            ? "ملغي"
                            : order.status}
                        </span>
                      </div>
                      {/* Middle: Customer Name */}
                      {/* Right: Date */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Details or Empty State */}
          <div className="col-span-12 lg:col-span-5">
            {selectedOrder ? (
              <OrderDetails order={selectedOrder} onEdit={handleEditOrder} />
            ) : (
              <div className="bg-white rounded-lg border h-full flex flex-col items-center justify-center text-center p-6">
                <img src="/cartitem.png" alt="" className="w-44 h-44 object-contain" />
                <h3 className="text-[22px] font-bold text-[#555] mb-1">لم يتم اختيار طلب</h3>
                <p className="text-[#AAA] text-base font-[500]">
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
