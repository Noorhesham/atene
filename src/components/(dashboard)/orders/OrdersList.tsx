import { User as UserIcon, Mail, Phone, Calendar, MapPin } from "lucide-react";
import { ApiOrder, BaseEntity } from "@/types";
import { useState } from "react";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import Actions from "@/components/Actions";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/constants/api";
import { InfoItem } from "@/components/InfoItem";
import { Link } from "react-router-dom";

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
    <div className="flex-grow overflow-y-auto p-2">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onSelectOrder(order.id)}
          className={`p-4 rounded-lg mb-3 cursor-pointer transition-all duration-200 ${
            selectedOrderId === order.id
              ? "bg-[#F8F8F8] border border-input shadow-sm"
              : "border border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm"
          }`}
        >
          {/* Header with Order ID and Status */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${selectedOrderId === order.id ? "bg-blue-500" : "bg-gray-300"}`}
              ></div>
              <div>
                <p className="font-bold text-lg text-gray-900">#{order.reference_id}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(order.created_at || Date.now()).toLocaleDateString("ar-SA")}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-main">₪{order.total.toFixed(2)}</p>
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status === "pending"
                  ? "قيد الانتظار"
                  : order.status === "completed"
                  ? "مكتمل"
                  : order.status === "cancelled"
                  ? "ملغي"
                  : order.status}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{order.name}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {order.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {order.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="space-y-2">
            {order.items.slice(0, 2).map((item) => {
              const productData = item.product as { cover?: string; cover_url?: string; name?: string } | undefined;
              const cover = productData?.cover || productData?.cover_url || "";
              return (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                  <img
                    src={cover || "/placeholder.png"}
                    alt={productData?.name || `Product ${item.product_id}`}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.png";
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {productData?.name || `Product ${item.product_id}`}
                    </p>
                    <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₪{item.price.toFixed(2)}</p>
                </div>
              );
            })}
            {order.items.length > 2 && (
              <div className="text-center py-2 text-sm text-gray-500">+{order.items.length - 2} منتجات أخرى</div>
            )}
          </div>

          {/* Footer with Address */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{order.address}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const OrderDetails = ({ order, onEdit }: { order: ApiOrder; onEdit: (order: ApiOrder) => void }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { refetch } = useAdminEntityQuery("orders");

  const updateOrderStatus = async (order: ApiOrder) => {
    try {
      setIsUpdatingStatus(true);
      const token = localStorage.getItem("token");

      // Determine new status based on current status
      let newStatus: string;
      if (order.status === "pending") {
        newStatus = "completed";
      } else if (order.status === "completed") {
        newStatus = "cancelled";
      } else {
        newStatus = "pending";
      }

      const res = await fetch(`${API_BASE_URL}/merchants/orders/${order.id}/update-status`, {
        method: "POST",
        body: JSON.stringify({
          status: newStatus,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update order status");
      }

      toast.success("تم تغيير حالة الطلب بنجاح");
      refetch(); // Revalidate the orders data
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("فشل تغيير حالة الطلب");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  console.log(order);
  return (
    <div className=" rounded-lg border border-white px-8 h-full py-4 overflow-y-auto">
      <Actions
        isUpdating={isUpdatingStatus}
        isActive={order.status === "pending"}
        title="إجراءات الطلب"
        onApprove={async () => {
          await updateOrderStatus(order);
        }}
        editClick={() => {
          onEdit(order);
        }}
        entity={order as unknown as BaseEntity}
        entityType="orders"
        deleteMessage={`هل أنت متأكد من حذف الطلب "${order.reference_id}"?`}
        onDeleteSuccess={() => {}}
      />
      <div className="flex items-center  justify-between p-3 bg-[#F8F8F8] py-5 my-3 px-10 rounded-xl border border-input mb-4">
        <div className="flex items-center gap-3">
          <img src={order.client.avatar_url} alt={order.name} className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-bold text-gray-900">{order.name}</p>
            <p className="text-sm text-gray-500">{order.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/chat`}
            className="text-main font-semibold flex items-center gap-2 border border-main rounded-lg px-2 py-1 text-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M11.996 12H12.004M15.991 12H16M8 12H8.009M22 11.567C22 16.85 17.522 21.133 12 21.133C11.3487 21.1337 10.7037 21.0743 10.065 20.955C9.606 20.868 9.377 20.825 9.217 20.85C9.057 20.874 8.829 20.995 8.375 21.236C7.08134 21.925 5.5928 22.1565 4.151 21.893C4.70175 21.2122 5.07521 20.4054 5.238 19.545C5.338 19.015 5.09 18.5 4.718 18.123C3.034 16.411 2 14.105 2 11.567C2 6.284 6.478 2 12 2C17.522 2 22 6.284 22 11.567Z"
                stroke="#406896"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            تحدث معه
          </Link>
          <button className="text-[#D00416] font-semibold flex items-center gap-2 border border-[#D00416] rounded-lg px-2 py-1 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 22H6.58996C5.04496 22 3.81596 21.248 2.71296 20.197C0.452962 18.044 4.16296 16.324 5.57796 15.482C7.96426 14.0725 10.8054 13.6468 13.5 14.295M16.05 16.05L20.95 20.95M16.5 6.5C16.5 7.69347 16.0259 8.83807 15.1819 9.68198C14.338 10.5259 13.1934 11 12 11C10.8065 11 9.66189 10.5259 8.81798 9.68198C7.97407 8.83807 7.49996 7.69347 7.49996 6.5C7.49996 5.30653 7.97407 4.16193 8.81798 3.31802C9.66189 2.47411 10.8065 2 12 2C13.1934 2 14.338 2.47411 15.1819 3.31802C16.0259 4.16193 16.5 5.30653 16.5 6.5ZM22 18.5C22 17.5717 21.6312 16.6815 20.9748 16.0251C20.3185 15.3687 19.4282 15 18.5 15C17.5717 15 16.6815 15.3687 16.0251 16.0251C15.3687 16.6815 15 17.5717 15 18.5C15 19.4283 15.3687 20.3185 16.0251 20.9749C16.6815 21.6313 17.5717 22 18.5 22C19.4282 22 20.3185 21.6313 20.9748 20.9749C21.6312 20.3185 22 19.4283 22 18.5Z"
                stroke="#D00416"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            حظر العميل
          </button>
        </div>
      </div>

      <div className="space-y-4 bg-white px-4 py-6 rounded-[8px]">
        <div className="p-3 shadow-sm border border-input rounded-lg">
          <h4 className=" text-black font-bold text-base mb-2">معلومات عن العميل</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoItem title="الهاتف" icon={<Phone className="w-4 h-4 text-black" />}>
              {order.phone}
            </InfoItem>
            <InfoItem title="البريد الالكتروني" icon={<Mail className="w-4 h-4 text-black" />}>
              {order.email}
            </InfoItem>
            <InfoItem title="العنوان" icon={<MapPin className="w-4 h-4 text-black" />}>
              {order.address}
            </InfoItem>
          </div>
        </div>
        <div className="p-3 shadow-sm border border-input rounded-lg">
          <h4 className="text-black font-bold text-base mb-2">تفاصيل الطلب</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoItem
              title="معرف الطلب"
              icon={
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-bold">#</span>
                </div>
              }
            >
              {order.reference_id}
            </InfoItem>
            <InfoItem
              title="عنوان الطلب"
              icon={
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-bold">T</span>
                </div>
              }
            >
              طلب منتج
            </InfoItem>
            <InfoItem
              title="المتجر"
              icon={
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              }
            >
              متجر الرئيسي
            </InfoItem>
            <InfoItem
              title="تاريخ الطلب"
              icon={
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              }
            >
              {new Date(order.created_at || Date.now()).toLocaleDateString("ar-SA", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </InfoItem>
          </div>
        </div>
        <div className="p-3 border border-input rounded-lg">
          <h4 className="font-bold mb-2">تفاصيل المنتجات</h4>
          {order.items.map((item) => {
            const productData = item.product as { cover?: string; cover_url?: string } | undefined;
            const cover = productData?.cover || productData?.cover_url || "";
            return (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b border-input last:border-none"
              >
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
          <div className="mt-2 pt-2 font-semibold flex justify-between">
            <span>الإجمالي:</span>
            <span>{order.total.toFixed(2)} ₪</span>
          </div>
        </div>
      </div>
    </div>
  );
};
