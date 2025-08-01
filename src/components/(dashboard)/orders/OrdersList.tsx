import { InfoCardProps, InfoRowProps, OrderDetailsProps, OrdersListProps } from "@/types/orders";
import { Calendar, Edit, Sort, Trash, User } from "@/components/icons";
import ActionButton from "@/components/ActionButton";
import { Mail, Phone } from "lucide-react";
import { Adress, Info, Store } from "@/constants/Icons";

export const OrdersList: React.FC<OrdersListProps> = ({ orders, selectedOrders, onSelectOrder }) => (
  <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-main">({selectedOrders.length}) طلب محدد</h3>
        <button className="p-2 rounded-md hover:bg-gray-100" title="Sort Orders">
          <Sort />
        </button>
      </div>
    </div>
    <div className="flex-grow overflow-y-auto p-2">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onSelectOrder(order.id)}
          className={`p-3 rounded-lg mb-2 cursor-pointer ${
            selectedOrders.includes(order.id)
              ? "bg-gray-100 border border-gray-300"
              : "border border-transparent hover:bg-gray-50"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedOrders.includes(order.id)}
                readOnly
                title="Select Order"
                className="mt-1 form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <div>
                <p className="font-bold text-main">{order.id}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <User />
                  <span>{order.customerName}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{order.date}</span>
                </div>
              </div>
            </div>
            <p className="font-bold text-main">{order.price}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  console.log(order);

  const InfoCard: React.FC<InfoCardProps> = ({ title, children, className }) => (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h4 className="font-bold text-base mb-4 text-black text-right">{title}</h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">{children}</div>
    </div>
  );

  const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => (
    <div className="flex items-center  gap-2 text-sm">
      {" "}
      <span className="flex items-center gap-2 text-black p-[6px] rounded-xl border border-gray-200">{icon}</span>
      <div className="flex flex-col items-start">
        <span className="font-medium text-[#717171] ">{label}</span>
        <span className="font-medium text-[#1C1C1C] ">{value}</span>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="bg-gray-50 h-full p-4 overflow-y-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-bold text-main mb-3 text-right">إجراءات الطلب</h3>
        <div className="grid grid-cols-3 gap-3">
          <ActionButton variant="secondary">تفريغ حالة الطلب</ActionButton>
          <ActionButton variant="primary" icon={<Edit />}>
            تعديل الطلب
          </ActionButton>
          <ActionButton variant="danger" icon={<Trash />}>
            حذف الطلب
          </ActionButton>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={order.client.avatar_url} alt="Customer" className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-bold text-gray-900">{order.name}</p>
              <p className="text-sm text-gray-500">{order.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-sm bg-gray-100 text-gray-700 rounded-md border border-gray-200 flex items-center gap-1.5">
              💬 تحدث معه
            </button>
            <button className="p-2 text-sm bg-gray-100 text-gray-700 rounded-md border border-gray-200 flex items-center gap-1.5">
              🚫 حظر العميل
            </button>
          </div>
        </div>
      </div>

      <InfoCard title="معلومات عن العميل">
        <InfoRow label="البريد الالكتروني" value={order.email} icon={<Mail />} />
        <InfoRow label="الهاتف" value={order.phone} icon={<Phone />} />
        <InfoRow label="عنوان مقدم الطلب" value={order.address} icon={<Adress />} />
      </InfoCard>

      <div className="mt-4 space-y-4">
        <InfoCard className="bg-[#F8F8F8]" title="تفاصيل الطلب">
          <InfoRow label="معرف الطلب" value={order.reference_id} icon={<Info />} />
          <InfoRow label="المتجر" value="متجر الرئيسي" icon={<Store />} />
          <InfoRow label="حالة الطلب" value={order.status} icon={<Calendar />} />
          <InfoRow label="ملاحظات" value={order.notes} icon={<Adress />} />
        </InfoCard>
        <InfoCard title="تفاصيل المنتجات">
          {order.items.map((item) => (
            <div key={item.id} className="col-span-2 border-b last:border-0 pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                </div>
                <div className="text-left">
                  <p className="font-medium">{item.price} ريال</p>
                  {item.price_after_discount !== item.price && (
                    <p className="text-sm text-red-500">{item.price_after_discount} ريال</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <InfoRow label="المجموع الفرعي" value={`${order.sub_total} ريال`} icon={<Info />} />
          <InfoRow label="الخصم" value={`${order.discount_total} ريال`} icon={<Info />} />
          <InfoRow label="تكلفة الشحن" value={`${order.shipping_cost} ريال`} icon={<Info />} />
          <InfoRow label="الإجمالي" value={`${order.total} ريال`} icon={<Info />} />
        </InfoCard>
      </div>
    </div>
  );
};
