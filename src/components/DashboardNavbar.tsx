"use client";

import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Package,
  Users,
  Home,
  ShoppingCart,
  MoreHorizontal,
  Shirt,
  Store,
  ChartArea,
  FileText,
  Settings,
} from "lucide-react";
import StoreSelector from "./StoreSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import MaxWidthDashboard from "./(dashboard)/components/MaxWidthDashboard";
import { useAuth } from "@/context/AuthContext";
import Loader from "./Loader";

const DashboardNavbar = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loader />;

  const isAdmin = user?.user.user_type === "admin";
  const preLink = isAdmin ? "/admin" : "/dashboard";

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Helper function to check if a dropdown item is active (more specific)
  const isDropdownItemActive = (path: string) => {
    return location.pathname === path;
  };

  // Helper function to check if a main section is active (for dropdown triggers)
  const isSectionActive = (sectionPath: string) => {
    // Check if we're on the main section page or any of its sub-pages
    return location.pathname === sectionPath || location.pathname.startsWith(sectionPath + "/");
  };

  // Helper function to get button styles based on active state
  const getButtonStyles = (path: string) => {
    const active = isActive(path);
    return active
      ? "bg-[#2D496A] text-white hover:bg-[#2D496A]/90 px-4 py-2 h-auto rounded-md flex items-center gap-2"
      : "text-[#2D496A] hover:bg-white/20 px-4 py-2 h-auto rounded-md flex items-center gap-2";
  };

  // Helper function to get dropdown button styles based on section active state
  const getDropdownButtonStyles = (sectionPath: string) => {
    const active = isSectionActive(sectionPath);
    return active
      ? "bg-[#2D496A] text-white hover:bg-[#2D496A]/90 px-4 py-2 h-auto rounded-md flex items-center gap-1"
      : "text-[#2D496A] hover:bg-white/20 px-4 py-2 h-auto rounded-md flex items-center gap-1";
  };
  return (
    <nav dir="rtl" className="w-full bg-[#C8D7E8] border-b border-gray-200 shadow-sm">
      <MaxWidthDashboard className="bg-[#C8D7E8]">
        <div className="flex items-center justify-between h-16">
          {/* Right Side - Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4">
              <img src="/black.svg" className="h-10" alt="logo" />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex font-[500] items-center gap-2">
              <Button variant="ghost" className={getButtonStyles("/dashboard")} asChild>
                <Link to={preLink}>
                  <Home className="w-4 h-4" />
                  الرئيسية
                </Link>
              </Button>

              {/* Stores Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={getDropdownButtonStyles(`${preLink}/stores`)}>
                    <Store className="w-4 h-4" />
                    المتاجر
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 text-right">
                  <DropdownMenuItem className={isDropdownItemActive(`${preLink}/stores`) ? "bg-main text-white" : ""}>
                    <Link to={`${preLink}/stores`} className="w-full">
                      إدارة المتاجر
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={isDropdownItemActive(`${preLink}/stores/add`) ? "bg-main text-white" : ""}
                  >
                    <Link to={`${preLink}/stores/add`} className="w-full">
                      إضافة متجر
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Orders Dropdown */}
              {!isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={getDropdownButtonStyles(`${preLink}/orders`)}>
                      <ShoppingCart className="w-4 h-4" />
                      الطلبات
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 text-right">
                    <DropdownMenuItem className={isDropdownItemActive(`${preLink}/orders`) ? "bg-main text-white" : ""}>
                      <Link to={`${preLink}/orders`} className="w-full">
                        جميع الطلبات
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={isDropdownItemActive(`${preLink}/orders/pending`) ? "bg-main text-white" : ""}
                    >
                      <Link to={`${preLink}/orders/pending`} className="w-full">
                        الطلبات المعلقة
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={isDropdownItemActive(`${preLink}/orders/completed`) ? "bg-main text-white" : ""}
                    >
                      <Link to={`${preLink}/orders/completed`} className="w-full">
                        الطلبات المكتملة
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Products Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={getDropdownButtonStyles(`${preLink}/products`)}>
                    <Shirt className="w-4 h-4" />
                    المنتجات
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 text-right">
                  <DropdownMenuItem className={isDropdownItemActive(`${preLink}/products`) ? "bg-main text-white" : ""}>
                    <Link to={`${preLink}/products`} className="w-full">
                      إدارة المنتجات
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={isDropdownItemActive(`${preLink}/products/add`) ? "bg-main text-white" : ""}
                  >
                    <Link to={`${preLink}/products/add`} className="w-full">
                      إضافة منتج
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={isDropdownItemActive(`${preLink}/categories`) ? "bg-main text-white" : ""}
                  >
                    <Link to={`${preLink}/categories`} className="w-full">
                      الفئات
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {!isAdmin && (
                <Link to={`${preLink}/chat`}>
                  <Button variant="ghost" className={getDropdownButtonStyles(`${preLink}/chat`)}>
                    <ChartArea className="w-4 h-4" />
                    الدردشة
                  </Button>
                </Link>
              )}

              {isAdmin && (
                <Link to={`${preLink}/reports`}>
                  <Button variant="ghost" className={getDropdownButtonStyles(`${preLink}/reports`)}>
                    <FileText className="w-4 h-4" />
                    الشكاوي
                  </Button>
                </Link>
              )}
              {/* More Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={getDropdownButtonStyles(`${preLink}/users`)}>
                    <MoreHorizontal className="w-4 h-4" />
                    المزيد
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 text-right   ">
                  {isAdmin && (
                    <DropdownMenuItem className={isDropdownItemActive(`${preLink}/users`) ? "bg-main text-white" : ""}>
                      <Link to={`${preLink}/users`} className="w-full">
                        إدارة المستخدمين
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className={isDropdownItemActive(`${preLink}/stories`) ? "bg-main  text-white" : ""}>
                    <Link to={`${preLink}/stories`} className="w-full">
                      القصص
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className={isDropdownItemActive(`${preLink}/settings`) ? "bg-main text-white" : ""}>
                    <Link to={`${preLink}/settings`} className="w-full">
                      الإعدادات
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Left Side - Search, Notifications, Profile */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex rounded-[10px] bg-[#F6EED8] items-center gap-1 px-4 py-1">
              <img src="/image 22.svg" alt="" />
              <span className="text-[#444] font-[18px]">0 نقطة </span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 13.5H16M8 8.5H12M6.099 19C4.79967 18.872 3.824 18.4813 3.172 17.828C2 16.657 2 14.771 2 11V10.5C2 6.729 2 4.843 3.172 3.672C4.344 2.501 6.229 2.5 10 2.5H14C17.771 2.5 19.657 2.5 20.828 3.672C21.999 4.844 22 6.729 22 10.5V11C22 14.771 22 16.657 20.828 17.828C19.656 18.999 17.771 19 14 19C13.44 19.012 12.993 19.055 12.555 19.155C11.356 19.431 10.246 20.045 9.15 20.579C7.587 21.341 6.806 21.722 6.316 21.365C5.378 20.667 6.295 18.502 6.5 17.5"
                stroke="#38587A"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5.158 11.4912C5.085 12.8872 5.169 14.3732 3.922 15.3082C3.63531 15.5227 3.40266 15.8012 3.24259 16.1215C3.08253 16.4418 2.99946 16.7951 3 17.1532C3 18.1502 3.782 19.0002 4.8 19.0002H19.2C20.218 19.0002 21 18.1502 21 17.1532C21 16.4272 20.658 15.7432 20.078 15.3082C18.831 14.3732 18.915 12.8872 18.842 11.4912C18.752 9.73724 17.9919 8.08486 16.7186 6.87526C15.4454 5.66565 13.7562 4.99121 12 4.99121C10.2438 4.99121 8.55462 5.66565 7.28136 6.87526C6.0081 8.08486 5.24799 9.73724 5.158 11.4912Z"
                    stroke="#38587A"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15 19C15 19.7956 14.6839 20.5587 14.1213 21.1213C13.5587 21.6839 12.7956 22 12 22C11.2044 22 10.4413 21.6839 9.87868 21.1213C9.31607 20.5587 9 19.7956 9 19M10.5 3.125C10.5 3.953 11.172 5 12 5C12.828 5 13.5 3.953 13.5 3.125C13.5 2.297 12.828 2 12 2C11.172 2 10.5 2.297 10.5 3.125Z"
                    stroke="#38587A"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#2D496A]">الإشعارات</h3>
                    <Badge variant="secondary">3</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-[#C8D7E8]/20 rounded-lg">
                      <div className="w-8 h-8 bg-main text-white0 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#2D496A]">طلب جديد</p>
                        <p className="text-xs text-gray-600">تم استلام طلب جديد #12345</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-[#C8D7E8]/20 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#2D496A]">مستخدم جديد</p>
                        <p className="text-xs text-gray-600">انضم مستخدم جديد للمنصة</p>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {/* User Profile */}
            <StoreSelector />
          </div>
        </div>
      </MaxWidthDashboard>
    </nav>
  );
};

export default DashboardNavbar;
