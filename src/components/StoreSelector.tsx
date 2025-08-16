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
    if (onlystores) return;
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
          <Button
            size={"lg"}
            variant="ghost"
            className="flex items-center gap-2 px-4 !py-3  rounded-[4px] bg-white border-input  border"
          >
            {selectedStore?.logo_url ? (
              <img src={selectedStore.logo_url} alt="Store Logo" className="w-full h-full object-cover rounded-lg" />
            ) :  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M2.47217 8.74658V12.9149C2.47217 15.2732 2.47217 16.4516 3.20383 17.1841C3.93717 17.9174 5.11467 17.9174 7.47217 17.9174H12.4722C14.8288 17.9174 16.0072 17.9174 16.7397 17.1841C17.4722 16.4516 17.4722 15.2724 17.4722 12.9149V8.74658"
              stroke="#393939"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.4724 14.1608C11.9024 14.6666 10.9949 14.9941 9.97237 14.9941C8.94987 14.9941 8.04237 14.6666 7.47237 14.1608M8.41987 7.01496C8.18487 7.86412 7.32987 9.32829 5.70654 9.53996C4.2732 9.72746 3.18487 9.10162 2.90737 8.83996C2.60154 8.62746 1.9032 7.94829 1.73237 7.52495C1.56154 7.09995 1.7607 6.18079 1.9032 5.80579L2.47237 4.15745C2.61154 3.74329 2.93737 2.76412 3.2707 2.43245C3.60404 2.10079 4.27904 2.08662 4.55737 2.08662H10.3957C11.8982 2.10829 15.184 2.07329 15.8332 2.08662C16.4832 2.09995 16.8732 2.64495 16.9874 2.87829C17.9565 5.22495 18.3332 6.56995 18.3332 7.14162C18.2065 7.75329 17.6832 8.90496 15.8332 9.41246C13.9107 9.93912 12.8207 8.91412 12.479 8.52079M7.62904 8.52079C7.89987 8.85329 8.74904 9.52245 9.97904 9.53912C11.2099 9.55579 12.2724 8.69745 12.6499 8.26662C12.7565 8.13912 12.9874 7.76162 13.2274 7.01412"
              stroke="#393939"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          المتجر
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 9C18 9 13.581 15 12 15C10.419 15 6 9 6 9"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
                </svg>}
          </Button>
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
      <DropdownMenuContent className="w-[320px] p-0" align="end">
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
