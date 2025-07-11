import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Settings,
  Users,
  Store,
  BookOpen,
  Package,
  BarChart3,
  Eye,
  AlertTriangle,
  Bell,
  Info,
  LogOut,
  ChevronLeft,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  count?: number;
  children?: {
    label: string;
    path: string;
  }[];
}

const Sidebar = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { id: "main", label: "الصفحة الرئيسية", icon: Home, path: "/dashboard" },
    { id: "settings", label: "الإعدادات", icon: Settings, path: "/dashboard/settings" },
    {
      id: "users",
      label: "إدارة المستخدمين",
      icon: Users,
      path: "/dashboard/users",
      children: [
        { label: "المستخدمين", path: "/dashboard/users" },
        { label: "الأدمن", path: "/dashboard/users/admin" },
        { label: "الأدوار", path: "/dashboard/users/roles" },
        { label: "الصلاحيات", path: "/dashboard/users/permissions" },
      ],
    },
    { id: "stores", label: "إدارة المتاجر", icon: Store, path: "/dashboard/stores", count: 20 },
    { id: "stories", label: "إدارة القصص", icon: BookOpen, path: "/dashboard/stories" },
    { id: "products", label: "إدارة المنتجات", icon: Package, path: "/dashboard/products", count: 150 },
    { id: "sections", label: "إدارة الأقسام", icon: BarChart3, path: "/dashboard/sections" },
    { id: "monitoring", label: "المراقبة والمتابعة", icon: Eye, path: "/dashboard/monitoring" },
    { id: "reports", label: "إدارة البلاغات", icon: AlertTriangle, path: "/dashboard/reports", count: 20 },
    { id: "notifications", label: "إدارة الإشعارات", icon: Bell, path: "/dashboard/notifications" },
    { id: "info", label: "المعلومات", icon: Info, path: "/dashboard/info" },
    { id: "logout", label: "تسجيل الخروج", icon: LogOut, path: "/logout" },
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else {
      navigate(item.path);
    }
  };
  const isActive = (item: MenuItem) => {
    return item.path === window.location.pathname;
  };

  return (
    <div className="w-64 bg-[#F0F7FF] rounded-xl h-fit sticky  shadow-sm" dir="rtl">
      <div className="px-5 pt-5  border-slate-200">
        <h1 className="text-xl font-semibold text-[#395A7D] text-center">لوحة التحكم</h1>
      </div>
      <div className="py-4">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <div
              className={`flex items-center justify-between px-6 py-3 text-[#395A7D] hover:bg-[#D6EAFF] cursor-pointer transition-colors ${
                item.id === "settings" ? "bg-slate-100" : ""
              }  ${isActive(item) ? "bg-[#D6EAFF] rounded-full border-r-5 border-[#395A7D]" : ""}`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count && (
                  <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">{item.count}</span>
                )}
                {item.children && (
                  <ChevronLeft
                    className={`w-4 h-4 transition-transform ${expandedItem === item.id ? "rotate-90" : ""}`}
                  />
                )}
              </div>
            </div>
            {item.children && expandedItem === item.id && (
              <div className="bg-white border-r-2 border-slate-200 mr-6">
                {item.children.map((child, index) => (
                  <div
                    key={index}
                    className="px-6 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                    onClick={() => navigate(child.path)}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
