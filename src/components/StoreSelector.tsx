import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { LogOut, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface Store {
  id: number;
  name: string;
  logo?: string;
}

const StoreSelector = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useAuth();
  const { data: stores, isLoading } = useAdminEntityQuery(
    "stores",
    {
      queryParams: {
        type: "merchants/stores/my-stores",
      },
    },
    false
  );
  const queryClient = useQueryClient();
  useEffect(() => {
    // Set initial selected store from localStorage
    const storedId = localStorage.getItem("storeId");
    if (storedId && stores) {
      const store = stores.find((s) => s.id === parseInt(storedId));
      if (store) setSelectedStore(store);
    } else if (stores?.length > 0) {
      // If no stored ID, select first store
      setSelectedStore(stores[0]);
      localStorage.setItem("storeId", stores[0].id.toString());
    }
  }, [stores]);

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    localStorage.setItem("storeId", store.id.toString());
    queryClient.invalidateQueries({ queryKey: ["merchant", "coupons"] });
  };

  const filteredStores = stores?.filter((store) => store.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 bg-white rounded-lg px-4 py-2">
          <div className="w-8 h-8 rounded-lg bg-main/10 flex items-center justify-center">
            {selectedStore?.logo_url ? (
              <img src={selectedStore.logo_url} alt="Store Logo" className="w-6 object-cover h-6" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M2.47217 8.74658V12.9149C2.47217 15.2732 2.47217 16.4516 3.20383 17.1841C3.93717 17.9174 5.11467 17.9174 7.47217 17.9174H12.4722C14.8288 17.9174 16.0072 17.9174 16.7397 17.1841C17.4722 16.4516 17.4722 15.2724 17.4722 12.9149V8.74658"
                  stroke="#393939"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.4724 14.1608C11.9024 14.6666 10.9949 14.9941 9.97237 14.9941C8.94987 14.9941 8.04237 14.6666 7.47237 14.1608M8.41987 7.01496C8.18487 7.86412 7.32987 9.32829 5.70654 9.53996C4.2732 9.72746 3.18487 9.10162 2.90737 8.83996C2.60154 8.62746 1.9032 7.94829 1.73237 7.52495C1.56154 7.09995 1.7607 6.18079 1.9032 5.80579L2.47237 4.15745C2.61154 3.74329 2.93737 2.76412 3.2707 2.43245C3.60404 2.10079 4.27904 2.08662 4.55737 2.08662H10.3957C11.8982 2.10829 15.184 2.07329 15.8332 2.08662C16.4832 2.09995 16.8732 2.64495 16.9874 2.87829C17.9565 5.22495 18.3332 6.56995 18.3332 7.14162C18.2065 7.75329 17.6832 8.90496 15.8332 9.41246C13.9107 9.93912 12.8207 8.91412 12.479 8.52079M7.62904 8.52079C7.89987 8.85329 8.74904 9.52245 9.97904 9.53912C11.2099 9.55579 12.2724 8.69745 12.6499 8.26662C12.7565 8.13912 12.9874 7.76162 13.2274 7.01412"
                  stroke="#393939"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-[#2D496A]">{selectedStore?.name || "اختر متجر"}</span>
            <span className="text-xs text-gray-500">متجر</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] text-right p-2" align="end">
        <div dir="rtl" className="flex items-center gap-2 px-2 py-1.5 mb-2 bg-gray-50 rounded-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="بحث عن متجر..."
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div dir="rtl" className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">جاري التحميل...</div>
          ) : filteredStores?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">لا توجد متاجر</div>
          ) : (
            filteredStores?.map((store) => (
              <DropdownMenuItem
                key={store.id}
                className={`flex items-center gap-3 px-2 py-2 cursor-pointer ${
                  selectedStore?.id === store.id ? "bg-main/10" : ""
                }`}
                onClick={() => handleStoreSelect(store)}
              >
                <div className="w-8 h-8 rounded-lg bg-main/10 flex items-center justify-center">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name} className="w-6 h-6" />
                  ) : (
                    <img src="/dominos.svg" alt="Store Logo" className="w-6 h-6" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#2D496A]">{store.name}</span>
                  <span className="text-xs text-gray-500">متجر</span>
                </div>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuItem>
            {" "}
            <button
              onClick={() => {
                logout();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <LogOut size={16} />
              <span>تسجيل الخروج</span>
            </button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StoreSelector;
