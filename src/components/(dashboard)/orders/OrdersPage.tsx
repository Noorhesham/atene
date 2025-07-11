import React, { useState, ReactNode } from "react";
import {
  ChevronLeft,
  Add,
  Sort,
  Search,
  Calendar,
  Filter,
  ShoppingCart,
  User,
  Trash,
  Edit,
} from "../../../components/icons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// --- TYPES ---
interface Category {
  name: string;
  count: number;
  active?: boolean;
}

interface OrderDetails {
  customer: {
    name: string;
    avatar: string;
    since: string;
    email: string;
    phone: string;
    address: string;
  };
  order: {
    store: string;
    id: string;
    date: string;
    title: string;
  };
  product: {
    name: string;
    color: string;
    size: string;
    quantity: number;
  };
}

interface Order {
  id: string;
  customerName: string;
  date: string;
  price: string;
  details: OrderDetails;
}

interface FilterPanelProps {
  categories: Category[];
}

interface OrdersListProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string) => void;
}

interface ActionButtonProps {
  children: ReactNode;
  variant?: "danger" | "primary" | "secondary";
  icon?: ReactNode;
}

interface InfoCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

interface InfoRowProps {
  label: string;
  value: string | number;
  icon: ReactNode;
}

interface OrderDetailsProps {
  order: Order;
}

// --- MOCK DATA ---
// NOTE: All order objects now have complete details to prevent runtime errors.
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

// --- SVG ICONS (Corrected with camelCase props) ---
// Remove the Icons object (lines 48-248)

// --- SUB-COMPONENTS ---

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

const OrdersList: React.FC<OrdersListProps> = ({ orders, selectedOrders, onSelectOrder }) => (
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

const EmptyState: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col items-center justify-center text-center p-6">
    <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-4">
      <ShoppingCart />
    </div>
    <h3 className="text-xl font-bold text-main mb-1">لم يتم اختيار طلب</h3>
    <p className="text-gray-500">قم بتحديد الطلب لمشاهدة تفاصيله هنا</p>
  </div>
);

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const { customer, order: orderInfo, product } = order.details;

  const ActionButton: React.FC<ActionButtonProps> = ({ children, variant = "secondary", icon }) => {
    const baseStyle = "py-1 px-2 rounded-lg text-[12px] flex items-center justify-center gap-2 font-semibold w-full";
    const variants = {
      danger: "bg-red-50 text-red-500",
      primary: "bg-gray-100 text-main border border-gray-200",
      secondary: "bg-gray-100 text-main border border-gray-200",
    };
    return (
      <button className={`${baseStyle} ${variants[variant]}`}>
        {icon}
        {children}
      </button>
    );
  };

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
            <img src={customer.avatar} alt="Customer" className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-bold text-gray-900">{customer.name}</p>
              <p className="text-sm text-gray-500">{customer.since}</p>
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
        <InfoRow
          label="البريد الالكتروني"
          value={customer.email}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M5.25 6.375L7.4565 7.68C8.74275 8.4405 9.2565 8.4405 10.5435 7.68L12.75 6.375"
                stroke="black"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.5121 10.1067C1.56085 12.4054 1.5856 13.5552 2.43385 14.4064C3.2821 15.2584 4.4626 15.2877 6.82435 15.3469C8.27935 15.3844 9.72085 15.3844 11.1759 15.3469C13.5376 15.2877 14.7181 15.2584 15.5664 14.4064C16.4146 13.5552 16.4394 12.4054 16.4889 10.1067C16.5039 9.3672 16.5039 8.6322 16.4889 7.8927C16.4394 5.59395 16.4146 4.4442 15.5664 3.59295C14.7181 2.74095 13.5376 2.7117 11.1759 2.65245C9.72558 2.61585 8.27462 2.61585 6.82435 2.65245C4.4626 2.7117 3.2821 2.74095 2.43385 3.59295C1.5856 4.4442 1.56085 5.59395 1.51135 7.8927C1.49556 8.63061 1.49631 9.36878 1.5121 10.1067Z"
                stroke="black"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        />
        <InfoRow
          label="الهاتف"
          value={customer.phone}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <g clip-path="url(#clip0_1808_71682)">
                <path
                  d="M2.83332 8.95662C2.12232 7.71762 1.77882 6.70512 1.57182 5.67912C1.26582 4.16112 1.96632 2.67837 3.12657 1.73187C3.61707 1.33212 4.17957 1.46937 4.46982 1.98912L5.12457 3.16437C5.64357 4.09587 5.90307 4.56087 5.85207 5.05437C5.80032 5.54862 5.45007 5.95062 4.75032 6.75462L2.83332 8.95662ZM2.83332 8.95662C4.27257 11.4661 6.53082 13.7266 9.04332 15.1666M9.04332 15.1666C10.2831 15.8776 11.2948 16.2211 12.3208 16.4281C13.8388 16.7341 15.3216 16.0336 16.2673 14.8734C16.6678 14.3829 16.5306 13.8204 16.0108 13.5301L14.8356 12.8754C13.9041 12.3564 13.4391 12.0969 12.9456 12.1479C12.4513 12.1996 12.0493 12.5499 11.2453 13.2496L9.04332 15.1666Z"
                  stroke="black"
                  stroke-width="1.125"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1808_71682">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          }
        />
        <InfoRow
          label="عنوان مقدم الطلب"
          value={customer.address}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M10.2133 16.0253C9.8835 16.3314 9.44983 16.5011 8.99982 16.5C8.55007 16.5009 8.1167 16.3312 7.78707 16.0253C4.80882 13.2195 0.817321 10.0853 2.76357 5.535C3.81732 3.075 6.34332 1.5 9.00057 1.5C11.6578 1.5 14.1846 3.075 15.2368 5.535C17.1808 10.08 13.1991 13.2293 10.2133 16.0253Z"
                stroke="black"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.625 8.25C11.625 8.59472 11.5571 8.93606 11.4252 9.25454C11.2933 9.57302 11.0999 9.8624 10.8562 10.1062C10.6124 10.3499 10.323 10.5433 10.0045 10.6752C9.68606 10.8071 9.34472 10.875 9 10.875C8.65528 10.875 8.31394 10.8071 7.99546 10.6752C7.67698 10.5433 7.3876 10.3499 7.14384 10.1062C6.90009 9.8624 6.70673 9.57302 6.57482 9.25454C6.4429 8.93606 6.375 8.59472 6.375 8.25C6.375 7.55381 6.65156 6.88613 7.14384 6.39384C7.63613 5.90156 8.30381 5.625 9 5.625C9.69619 5.625 10.3639 5.90156 10.8562 6.39384C11.3484 6.88613 11.625 7.55381 11.625 8.25Z"
                stroke="black"
                stroke-width="1.125"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        />
      </InfoCard>

      <div className="mt-4 space-y-4">
        <InfoCard className="bg-[#F8F8F8]" title="تفاصيل الطلب">
          <InfoRow
            label="معرف الطلب"
            value={orderInfo.id}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M7.27275 3L5.0085 15.75M12.7905 3L10.5262 15.75M15.75 6.58575H2.25M15.75 12.1642H2.25"
                  stroke="black"
                  stroke-width="1.125"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />
          <InfoRow
            label="المتجر"
            value={orderInfo.store}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path
                  d="M3.46729 10.4961V15.4981C3.46729 18.3281 3.46729 19.7421 4.34529 20.6211C5.22529 21.5011 6.63829 21.5011 9.46729 21.5011H15.4673C18.2953 21.5011 19.7093 21.5011 20.5883 20.6211C21.4673 19.7421 21.4673 18.3271 21.4673 15.4981V10.4961"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.467 16.9928C14.783 17.5998 13.694 17.9928 12.467 17.9928C11.24 17.9928 10.151 17.5998 9.46704 16.9928M10.604 8.41775C10.322 9.43675 9.29604 11.1938 7.34804 11.4478C5.62804 11.6728 4.32204 10.9218 3.98904 10.6078C3.62204 10.3528 2.78404 9.53775 2.57904 9.02975C2.37404 8.51975 2.61304 7.41675 2.78404 6.96675L3.46704 4.98875C3.63404 4.49175 4.02504 3.31675 4.42504 2.91875C4.82504 2.52075 5.63504 2.50375 5.96904 2.50375H12.975C14.778 2.52975 18.721 2.48775 19.5 2.50375C20.28 2.51975 20.748 3.17375 20.885 3.45375C22.048 6.26975 22.5 7.88375 22.5 8.56975C22.348 9.30375 21.72 10.6858 19.5 11.2948C17.193 11.9268 15.885 10.6968 15.475 10.2248M9.65504 10.2248C9.98004 10.6238 10.999 11.4268 12.475 11.4468C13.952 11.4668 15.227 10.4368 15.68 9.91975C15.808 9.76675 16.085 9.31375 16.373 8.41675"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />
          <InfoRow
            label="تاريخ الطلب"
            value={orderInfo.date}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                <path
                  d="M14 1.5V3M5 1.5V3M9.497 9.75H9.503M9.497 12.75H9.503M12.4933 9.75H12.5M6.5 9.75H6.50675M6.5 12.75H6.50675M3.125 6H15.875M2.75 6H16.25M2.375 9.18225C2.375 5.9145 2.375 4.28025 3.314 3.26475C4.253 2.25 5.765 2.25 8.7875 2.25H10.2125C13.235 2.25 14.747 2.25 15.686 3.2655C16.625 4.28025 16.625 5.9145 16.625 9.183V9.56775C16.625 12.8355 16.625 14.4697 15.686 15.4852C14.747 16.5 13.235 16.5 10.2125 16.5H8.7875C5.765 16.5 4.253 16.5 3.314 15.4845C2.375 14.4697 2.375 12.8355 2.375 9.567V9.18225Z"
                  stroke="black"
                  stroke-width="1.125"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />
          <InfoRow
            label="عنوان الطلب"
            value={orderInfo.title}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M11.25 15.7507H6.75M9 2.25V15.75M9 2.25C10.0402 2.25 11.3775 2.2725 12.441 2.382C12.891 2.4285 13.116 2.45175 13.3155 2.5335C13.5238 2.62162 13.7102 2.75462 13.8612 2.92302C14.0122 3.09143 14.1242 3.29108 14.1893 3.50775C14.25 3.7155 14.25 3.9525 14.25 4.4265M9 2.25C7.95975 2.25 6.6225 2.2725 5.559 2.382C5.109 2.4285 4.884 2.45175 4.6845 2.5335C4.47602 2.62153 4.28954 2.75449 4.13837 2.9229C3.98721 3.09131 3.87508 3.29101 3.81 3.50775C3.75 3.7155 3.75 3.9525 3.75 4.4265"
                  stroke="black"
                  stroke-width="1.125"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />
        </InfoCard>
        <InfoCard title="تفاصيل المنتج">
          <InfoRow
            label="المنتج"
            value={product.name}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M4.5 6.75V12.513C4.5 13.8712 4.5 14.5507 4.9395 14.973C5.925 15.9195 11.892 16.095 13.0605 14.973C13.5 14.55 13.5 13.8712 13.5 12.513V6.75"
                  stroke="black"
                  stroke-width="1.125"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.305 8.99971L2.283 7.04221C1.761 6.53596 1.5 6.28471 1.5 5.96971C1.5 5.65621 1.761 5.40346 2.28225 4.89871L3.783 3.44671C4.04325 3.19471 4.173 3.06871 4.32825 2.97646C4.4835 2.88346 4.65825 2.82721 5.00625 2.71471L6.24075 2.31646C6.42075 2.25796 6.5115 2.22946 6.573 2.26396C6.6345 2.29921 6.654 2.39971 6.693 2.60146C6.8955 3.65671 7.851 4.45546 9 4.45546C10.149 4.45546 11.1045 3.65671 11.3077 2.60146C11.346 2.39971 11.3655 2.29921 11.4278 2.26396C11.4878 2.22946 11.5785 2.25796 11.7592 2.31646L12.9938 2.71471C13.3425 2.82721 13.5173 2.88346 13.6718 2.97646C13.8263 3.06946 13.9567 3.19471 14.217 3.44671L15.717 4.89871C16.2397 5.40421 16.5 5.65696 16.5 5.97046C16.5 6.28396 16.239 6.53671 15.7178 7.04146L13.6943 8.99971"
                  stroke="black"
                  stroke-width="1.125"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />
          <InfoRow
            label="لون المنتج"
            value={product.color}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path
                  d="M13.935 6.99959L7.659 13.2756M7.659 13.2756L5.327 15.6076C4.426 16.5086 3.975 16.9596 3.737 17.5326C3.5 18.1066 3.5 18.7436 3.5 20.0196V20.9996H4.48C5.756 20.9996 6.393 20.9996 6.967 20.7626C7.54 20.5246 7.991 20.0736 8.892 19.1726L14.789 13.2756M7.659 13.2756H14.789M14.789 13.2756L17.5 10.5646M21.32 9.99959L19.709 8.38859L20.57 7.52659C20.863 7.23359 21.01 7.08759 21.111 6.94459C21.3638 6.58913 21.4996 6.16377 21.4996 5.72759C21.4996 5.29142 21.3638 4.86606 21.111 4.51059C21.009 4.36759 20.863 4.22159 20.571 3.92859C20.278 3.63659 20.131 3.49059 19.989 3.38859C19.6335 3.13582 19.2082 3 18.772 3C18.3358 3 17.9105 3.13582 17.555 3.38859C17.412 3.49059 17.265 3.63659 16.973 3.92859L16.111 4.79059L14.5 3.17959M19.71 8.38959L16.11 4.78959"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />
          <InfoRow
            label="حجم المنتج"
            value={product.size}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.6233 15.0149C8.97744 15.0167 7.38515 14.4302 6.13378 13.3611L2.39578 17.0999C2.28328 17.2124 2.14078 17.2649 1.99828 17.2649C1.85578 17.2649 1.71328 17.2124 1.60078 17.0999C1.49617 16.994 1.4375 16.8512 1.4375 16.7024C1.4375 16.5536 1.49617 16.4107 1.60078 16.3049L5.33878 12.5669C4.27017 11.3156 3.68392 9.72361 3.68578 8.07812C3.68578 4.25313 6.79828 1.14062 10.6233 1.14062C14.4483 1.14062 17.5608 4.25313 17.5608 8.07812C17.5608 11.9031 14.4483 15.0149 10.6233 15.0149ZM10.6233 2.26562C7.42078 2.26562 4.81078 4.87563 4.81078 8.07812C4.81078 11.2806 7.42078 13.8906 10.6233 13.8906C13.8258 13.8906 16.4358 11.2806 16.4358 8.07812C16.4358 4.87563 13.8258 2.26562 10.6233 2.26562ZM7.43578 9.95312C7.43578 10.2606 7.69078 10.5156 7.99828 10.5156H8.00578C8.31328 10.5156 8.56828 10.2606 8.56828 9.95312V6.20312C8.56828 6.00812 8.46328 5.82812 8.29828 5.72312C8.21625 5.67368 8.1231 5.6457 8.02741 5.64177C7.93172 5.63784 7.83658 5.65808 7.75078 5.70062L7.00078 6.07562C6.71578 6.21812 6.60328 6.55562 6.74578 6.83313C6.87328 7.08813 7.17328 7.20062 7.43578 7.11063V9.95312ZM13.6233 10.5156C13.3158 10.5156 13.0608 10.2606 13.0608 9.95312V7.10987C12.9316 7.15453 12.7907 7.15104 12.6639 7.10006C12.5371 7.04907 12.433 6.95401 12.3708 6.83237C12.3369 6.76606 12.3166 6.69365 12.3111 6.61939C12.3057 6.54513 12.3151 6.47052 12.3388 6.39995C12.3626 6.32938 12.4002 6.26427 12.4495 6.20844C12.4988 6.15262 12.5587 6.10721 12.6258 6.07488L13.3758 5.69987C13.5483 5.60988 13.7583 5.62488 13.9233 5.72237C14.0883 5.82737 14.1933 6.00738 14.1933 6.20238V9.95238C14.1933 10.2599 13.9383 10.5149 13.6308 10.5149L13.6233 10.5156ZM10.0608 9.21062C10.0608 9.51813 10.3158 9.77312 10.6233 9.77312V9.78063C10.9308 9.78063 11.1858 9.52563 11.1858 9.21062C11.1858 9.06144 11.1265 8.91837 11.021 8.81288C10.9155 8.70739 10.7725 8.64813 10.6233 8.64813C10.4741 8.64813 10.331 8.70739 10.2255 8.81288C10.12 8.91837 10.0608 9.06144 10.0608 9.21062ZM10.0608 6.96063C10.0608 7.26813 10.3158 7.52313 10.6233 7.52313V7.53063C10.9308 7.53063 11.1858 7.27563 11.1858 6.96063C11.1858 6.81144 11.1265 6.66837 11.021 6.56288C10.9155 6.45739 10.7725 6.39813 10.6233 6.39813C10.4741 6.39813 10.331 6.45739 10.2255 6.56288C10.12 6.66837 10.0608 6.81144 10.0608 6.96063Z"
                  fill="black"
                />
              </svg>
            }
          />
          <InfoRow
            label="الكمية"
            value={product.quantity}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M8.25 4.5H15.75M8.25 9H15.75M8.25 13.5H15.75M2.25 11.25H3.375C3.58425 11.25 3.6885 11.25 3.7755 11.2672C3.95012 11.302 4.11053 11.3877 4.23642 11.5136C4.36231 11.6395 4.44804 11.7999 4.48275 11.9745C4.5 12.0615 4.5 12.165 4.5 12.375C4.5 12.585 4.5 12.6885 4.48275 12.7755C4.44804 12.9501 4.36231 13.1105 4.23642 13.2364C4.11053 13.3623 3.95012 13.448 3.7755 13.4827C3.6885 13.5 3.585 13.5 3.375 13.5C3.165 13.5 3.0615 13.5 2.9745 13.5173C2.79988 13.552 2.63947 13.6377 2.51358 13.7636C2.38769 13.8895 2.30196 14.0499 2.26725 14.2245C2.25 14.3115 2.25 14.415 2.25 14.625V15.3C2.25 15.5122 2.25 15.618 2.316 15.684C2.382 15.75 2.4885 15.75 2.7 15.75H4.5M2.25 2.25H3.15C3.20967 2.25 3.2669 2.27371 3.3091 2.3159C3.35129 2.3581 3.375 2.41533 3.375 2.475V6.75M3.375 6.75H2.25M3.375 6.75H4.5"
                  stroke="black"
                  stroke-width="1.125"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />
        </InfoCard>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const OrdersPage = () => {
  const [selectedOrders, setSelectedOrders] = useState([ordersData[0].id]);
  const [activeTab, setActiveTab] = useState("orders");

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

  const getOrderDetails = () => {
    if (selectedOrders.length !== 1) return null;
    return ordersData.find((order) => order.id === selectedOrders[0]);
  };

  const orderForDetails = getOrderDetails();

  return (
    <div className="w-full min-h-screen p-4 lg:p-6 font-sans bg-gray-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div dir="rtl" className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="w-full lg:w-auto">
            <TabsList className="bg-transparent p-0 h-auto gap-0 border-b border-gray-200 rounded-none w-full lg:w-auto">
              <TabsTrigger
                value="orders"
                className="text-2xl font-bold px-0 pb-2 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent bg-transparent shadow-none rounded-none text-gray-900 data-[state=active]:text-blue-600"
              >
                الطلبـــــات
              </TabsTrigger>
              <TabsTrigger
                value="status"
                className="text-2xl font-bold px-4 pb-2 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent bg-transparent shadow-none rounded-none text-gray-500 data-[state=active]:text-blue-600"
              >
                حالات الطلب
              </TabsTrigger>
            </TabsList>
            <p className="text-gray-500 mt-2">الرئيسية / الطلبات</p>
          </div>
          <div className="w-full lg:w-auto flex items-center gap-4">
            <div className="relative w-full lg:w-64">
              <input
                type="text"
                placeholder="ابحث برقم الطلب"
                className="w-full py-2.5 pr-10 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search />
              </div>
            </div>
            <button className="py-2.5 px-5 bg-blue-600 text-white rounded-lg flex items-center gap-2 whitespace-nowrap">
              <Add />
              <span>إضافة طلب</span>
            </button>
          </div>
        </div>

        <TabsContent dir="rtl" value="orders">
          <div className="flex items-center gap-4 mb-6 bg-white p-3 rounded-lg border border-gray-200">
            <button className="flex items-center gap-2 py-2 px-3 border border-gray-300 rounded-lg">
              <Calendar /> المتجر
            </button>
            <button className="flex items-center gap-2 py-2 px-3 border border-gray-300 rounded-lg">
              <Filter /> تصفية
            </button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3">
              <FilterPanel categories={filterCategories} />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <OrdersList orders={ordersData} selectedOrders={selectedOrders} onSelectOrder={handleSelectOrder} />
            </div>
            <div className="col-span-12 lg:col-span-5 bg-white rounded-lg border border-gray-200">
              {orderForDetails ? <OrderDetails order={orderForDetails} /> : <EmptyState />}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="status">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">حالات الطلب</h3>
            <p className="text-gray-500">محتوى حالات الطلب سيتم إضافته هنا</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
