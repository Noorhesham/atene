import React from "react";
import { ApiOrder } from "@/hooks/useUsersQuery";

interface EditOrderViewProps {
  order?: ApiOrder | null;
  onBack: () => void;
}

const EditOrderView: React.FC<EditOrderViewProps> = ({ order, onBack }) => {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">تعديل الطلب {order?.reference_id}</h2>
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          عودة
        </button>
      </div>

      {order ? (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">المنتجات في الطلب:</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.price} ريال</p>
                      {item.price_after_discount !== item.price && (
                        <p className="text-sm text-red-500">{item.price_after_discount} ريال</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div>
                      <label className="text-sm text-gray-500">الكمية</label>
                      <input
                        type="number"
                        defaultValue={item.quantity}
                        min="1"
                        className="ml-2 w-20 border rounded p-1"
                        title={`كمية ${item.product.name}`}
                        placeholder="الكمية"
                      />
                    </div>
                    <button className="text-red-500 text-sm hover:text-red-700">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">تفاصيل الطلب:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">المجموع الفرعي</label>
                <p className="font-medium">{order.sub_total} ريال</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">الخصم</label>
                <p className="font-medium">{order.discount_total} ريال</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">تكلفة الشحن</label>
                <p className="font-medium">{order.shipping_cost} ريال</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">الإجمالي</label>
                <p className="font-medium">{order.total} ريال</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">معلومات العميل:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">الاسم</label>
                <input
                  type="text"
                  defaultValue={order.name}
                  className="w-full border rounded p-2"
                  title="اسم العميل"
                  placeholder="اسم العميل"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  defaultValue={order.email}
                  className="w-full border rounded p-2"
                  title="البريد الإلكتروني"
                  placeholder="البريد الإلكتروني"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  defaultValue={order.phone}
                  className="w-full border rounded p-2"
                  title="رقم الهاتف"
                  placeholder="رقم الهاتف"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">العنوان</label>
                <input
                  type="text"
                  defaultValue={order.address}
                  className="w-full border rounded p-2"
                  title="العنوان"
                  placeholder="العنوان"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button onClick={onBack} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              إلغاء
            </button>
            <button className="px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90">حفظ التغييرات</button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">لم يتم اختيار طلب للتعديل</div>
      )}
    </div>
  );
};

export default EditOrderView;
