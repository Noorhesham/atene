import React, { useState } from "react";
import { ChevronLeft, Add, ShoppingCart, Search } from "../../../components/icons";

import { Category, FilterPanelProps } from "@/types/orders";
import { OrdersList, OrderDetails } from "./OrdersList";
import { Header } from "./Header";
import { Button } from "@/components/ui/button";
import EditOrderView from "./EditOrderView";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const ordersData = [
  {
    id: "#123444",
    customerName: "اسم العميل",
    date: "منذ 4 أشهر",
    price: "927.00",
    details: {
      customer: {
        name: "اسم العميل",
        avatar: "https://i.pravatar.cc/40?u=a042581f4e29026704d",
        since: "منذ 4 أشهر",
        email: "kerooddeef5@gmail.com",
        phone: "+20 1289922985",
        address: "شارع الخليل ابراهيم, الف مسكن",
      },
      order: {
        store: "متجر الرئيسي",
        id: "1212424234",
        date: "16 يوليو, 2025",
        title: "طلب منتج",
      },
      product: {
        name: "لابتوب لينوفو",
        color: "اسود",
        size: "15 inch",
        quantity: 2,
      },
    },
  },
  {
    id: "#123445",
    customerName: "عميل آخر",
    date: "منذ 5 أشهر",
    price: "850.00",
    details: {
      customer: {
        name: "عميل آخر",
        avatar: "https://i.pravatar.cc/40?u=a042581f4e29026704e",
        since: "منذ 5 أشهر",
        email: "test@example.com",
        phone: "+20 1000000000",
        address: "عنوان افتراضي",
      },
      order: { store: "متجر ثانوي", id: "987654321", date: "15 يونيو, 2025", title: "طلب جديد" },
      product: { name: "شاشة سامسونج", color: "فضي", size: "27 inch", quantity: 1 },
    },
  },
  {
    id: "#123446",
    customerName: "جون دو",
    date: "منذ 5 أشهر",
    price: "120.00",
    details: {
      customer: {
        name: "جون دو",
        avatar: "https://i.pravatar.cc/40?u=a042581f4e29026704f",
        since: "منذ 5 أشهر",
        email: "john.doe@example.com",
        phone: "+1 5551234567",
        address: "123 Main St",
      },
      order: { store: "متجر رئيسي", id: "555555555", date: "14 يونيو, 2025", title: "اكسسوارات" },
      product: { name: "ماوس لاسلكي", color: "أسود", size: "N/A", quantity: 1 },
    },
  },
  {
    id: "#123447",
    customerName: "سارة كونور",
    date: "منذ 6 أشهر",
    price: "345.00",
    details: {
      customer: {
        name: "سارة كونور",
        avatar: "https://i.pravatar.cc/40?u=a042581f4e29026704a",
        since: "منذ 6 أشهر",
        email: "sarah.c@example.com",
        phone: "+44 2079460958",
        address: "London, UK",
      },
      order: { store: "متجر الكتروني", id: "333444555", date: "10 مايو, 2025", title: "مكونات كمبيوتر" },
      product: { name: "لوحة مفاتيح ميكانيكية", color: "أبيض", size: "Full-size", quantity: 1 },
    },
  },
  {
    id: "#123448",
    customerName: "احمد علي",
    date: "منذ 6 أشهر",
    price: "500.00",
    details: {
      customer: {
        name: "احمد علي",
        avatar: "https://i.pravatar.cc/40?u=a042581f4e29026704b",
        since: "منذ 6 أشهر",
        email: "ahmed.ali@example.com",
        phone: "+20 111222333",
        address: "القاهرة, مصر",
      },
      order: { store: "متجر رئيسي", id: "1122334455", date: "5 مايو, 2025", title: "ملابس" },
      product: { name: "تي شيرت", color: "أزرق", size: "Large", quantity: 3 },
    },
  },
  {
    id: "#123449",
    customerName: "فاطمة محمد",
    date: "منذ 7 أشهر",
    price: "730.00",
    details: {
      customer: {
        name: "فاطمة محمد",
        avatar: "https://i.pravatar.cc/40?u=a042581f4e29026704c",
        since: "منذ 7 أشهر",
        email: "fatima.m@example.com",
        phone: "+966 501234567",
        address: "الرياض, السعودية",
      },
      order: { store: "متجر الأزياء", id: "6677889900", date: "1 أبريل, 2025", title: "فستان سهرة" },
      product: { name: "فستان", color: "أحمر", size: "Medium", quantity: 1 },
    },
  },
];

const filterCategories: Category[] = [
  { name: "جميع الطلبات", count: 14, active: true },
  { name: "الطلبات المعلقة", count: 0 },
  { name: "الطلبات المكتملة", count: 12 },
  { name: "الطلبات الملغية", count: 2 },
];

const FilterPanel: React.FC<FilterPanelProps> = ({ categories }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-main">جميع الطلبات (14)</h2>
      <button className="p-1 rounded-md hover:bg-gray-100" title="Toggle Panel">
        <ChevronLeft />
      </button>
    </div>
    <ul>
      {categories.map((cat, index) => (
        <li
          key={index}
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
      ))}
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
  const [selectedOrders, setSelectedOrders] = useState([ordersData[0].id]);

  const handleSelectOrder = (orderId: any) => {
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

  const orderForDetails = selectedOrders.length === 1 ? ordersData.find((o) => o.id === selectedOrders[0]) : null;

  return (
    <div className="w-full min-h-screen p-4 lg:p-6 font-sans bg-gray-50">
      <Header onAddOrder={() => setIsEditing(true)} />

      {isEditing ? (
        <EditOrderView onBack={() => setIsEditing(false)} />
      ) : (
        <div>
          <div className="w-full lg:w-auto flex items-center gap-4 mb-6"></div>{" "}
          <div className="grid grid-cols-12 gap-6" dir="rtl">
            <div className="col-span-12 lg:col-span-3">
              <FilterPanel categories={filterCategories} />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <OrdersList orders={ordersData} selectedOrders={selectedOrders} onSelectOrder={handleSelectOrder} />
            </div>
            <div className="col-span-12 lg:col-span-5">
              {orderForDetails ? (
                <OrderDetails onEdit={() => setIsEditing(true)} order={orderForDetails} />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrdersPage;
