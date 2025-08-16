import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { LogOut, Search, Settings, Users, Coins, Store, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { ApiStore } from "@/types";
import { useNavigate } from "react-router-dom";

const StoreSelector = ({ trigger, onlystores = false }: { trigger: React.ReactNode; onlystores?: boolean }) => {
  const [selectedStore, setSelectedStore] = useState<ApiStore | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.user.user_type === "admin";
  const { data: stores, isLoading } = useAdminEntityQuery("stores", {}, isAdmin ? "admin" : "merchant");

  useEffect(() => {
    // Set initial selected store from localStorage
    const storedId = localStorage.getItem("storeId");
    if (storedId && stores) {
      const store = stores.find((s) => s.id === parseInt(storedId));
      if (store) setSelectedStore(store);
    } else if (stores?.length > 0) {
      // If no stored ID, select first store
      setSelectedStore(stores[0]);
      localStorage.setItem("storeId", stores?.[0]?.id.toString() || "");
    }
  }, [stores]);

  const handleStoreSelect = (store: ApiStore) => {
    setSelectedStore(store);
    localStorage.setItem("storeId", store.id.toString());

    // Dispatch custom event for store change
    const storeChangeEvent = new CustomEvent("storeChanged", {
      detail: { storeId: store.id.toString() },
    });
    window.dispatchEvent(storeChangeEvent);
    console.log(isAdmin);
    // Invalidate and refetch all queries in the cache
    queryClient.invalidateQueries();
    queryClient.refetchQueries();
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const filteredStores = stores?.filter((store) => store.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const menuItems = [
    {
      label: "النقاط",
      icon: <Coins size={20} className="text-gray-500" />,
      link: isAdmin ? "/admin/points" : "/points",
    },
    {
      label: "ادارة المتاجر",
      icon: <Settings size={20} className="text-gray-500" />,
      link: isAdmin ? "/admin/stores" : "/dashboard/stores",
    },
    isAdmin && {
      label: "الادوار الوظيفية",
      icon: <Users size={20} className="text-gray-500" />,
      link: "/admin/roles",
    },
  ];
  if (isLoading) return <Loader className="w-8 animate-spin h-8" />;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="ghost" className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 h-auto">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              {selectedStore?.logo_url ? (
                <img src={selectedStore.logo_url} alt="Store Logo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Store size={18} className="text-gray-500" />
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-[#2D496A]">{selectedStore?.name || "اختر متجر"}</span>
              <span className="text-xs text-gray-500">متجر</span>
            </div>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px] p-0" align="end" dir="rtl">
        {/* Header Section */}
        {!onlystores && (
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <img
                src={selectedStore?.logo_url || "https://i.imgur.com/Jt5g2S6.png"}
                alt={selectedStore?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col items-start">
                <span className="text-base font-bold text-gray-800">{selectedStore?.name || "متجر الافضل"}</span>
                <span className="text-xs text-gray-500 border border-gray-300 rounded-full px-2 py-0.5">متجر</span>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items Section */}
        {!onlystores && (
          <div className="py-2 border-b">
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.label}
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 text-base font-medium cursor-pointer"
                onClick={() => navigate(item.link)}
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        {/* Store Selection Section */}
        <div className="p-3">
          <div className="relative mb-2">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="تغير المتجر"
              className="bg-gray-100 border-none outline-none text-sm w-full rounded-md py-2 pr-9 pl-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 text-sm">جاري التحميل...</div>
            ) : (
              filteredStores?.map((store) => (
                <DropdownMenuItem
                  key={store.id}
                  className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded-md ${
                    selectedStore?.id === store.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleStoreSelect(store)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={store?.logo_url || "https://i.imgur.com/Jt5g2S6.png"}
                      alt={store.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-800">{store.name}</span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </div>

        {/* Logout Section */}
        <div className="border-t p-2">
          <DropdownMenuItem
            onClick={() => logout()}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 cursor-pointer"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StoreSelector;
