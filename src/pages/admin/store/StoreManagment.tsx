import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PaginatedList } from "@/components/admin/PaginatedList";
import { ApiStore } from "@/types";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import StatusIndicator from "@/components/StatusIndicator";
import StoreDetails from "./storeDetails/StoreDetails";
import Order from "@/components/Order";
import { PageHeader } from "../PageHeader";
import FilterPanel from "@/components/FilterPanel";

interface FilterCategory {
  name: string;
  value: string | null;
  active?: boolean;
}

interface FilterCategoryWithCount extends FilterCategory {
  count?: number;
}

const FILTER_CATEGORIES: FilterCategoryWithCount[] = [
  { name: "الكل", value: null, active: true, count: 0 },
  { name: "نشط", value: "active", count: 0 },
  { name: "بانتظار الموافقة", value: "not-active", count: 0 },
];

const StoreListItem = ({
  store,
  isSelected,
  onSelect,
}: {
  store: ApiStore;
  isSelected: boolean;
  onSelect: (store: ApiStore) => void;
}) => {
  return (
    <div
      className="flex items-center overflow-hidden gap-3 p-3 border-b border-input  cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={() => onSelect(store)}
    >
      <input
        checked={isSelected}
        onChange={(e) => {
          e.stopPropagation(); // Prevent card click when clicking checkbox
          onSelect(store);
        }}
        type="checkbox"
        className="w-5 h-5 rounded border-2 border-gray-300 text-main focus:ring-2 focus:ring-main focus:ring-offset-2 focus:ring-offset-white cursor-pointer transition-all duration-200 ease-in-out hover:border-main checked:bg-main checked:border-main checked:hover:bg-main/90"
        aria-label={`اختر المتجر ${store.name}`}
        title={`اختر المتجر ${store.name}`}
      />
      <img
        src={store.logo_url || "/placeholder-store.png"}
        alt={store.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-black text-[12.174px]">{store.name}</p>
          {isSelected && <span className="text-xs text-[#AAA] font-[500]">المتجر الاساسي</span>}
        </div>
        <StatusIndicator status={store.status} />
      </div>
    </div>
  );
};

export default function StoreManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<ApiStore | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc");
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const { user } = useAuth();
  const { data: stores = [] } = useAdminEntityQuery("stores");
  // Revalidate the currently selected store instance after any list refetch
  // Ensures details panel reflects the latest status immediately after updates
  useEffect(() => {
    if (!selectedStore) return;
    const updated = stores.find((s) => s.id === selectedStore.id);
    if (updated && updated !== selectedStore) {
      setSelectedStore(updated);
    }
  }, [stores, selectedStore]);

  // Update filter categories with counts
  const filterCategories = [...FILTER_CATEGORIES].map((cat) => ({
    ...cat,
    count: cat.value === null ? stores.length : stores.filter((s) => s.status === cat.value).length,
  }));

  const handleFilterChange = (filter: string | null) => {
    setStatusFilter(filter);
  };

  const handleOrderChange = (dir: "asc" | "desc") => {
    setOrderDir(dir);
  };

  const handleStoreSelect = (store: ApiStore) => {
    setSelectedStoreId(selectedStoreId === store.id ? null : store.id);
  };

  const handleStoreDeleted = () => {
    setSelectedStore(null);
    setSelectedStoreId(null);
  };

  const { isLoading: storesLoading } = useAdminEntityQuery("stores");
  if (storesLoading) return <Loader />;
  return (
    <div>
      <div className=" z-10">
        <PageHeader
          navLinks={[{ label: "المتاجر", href: "/admin/stores", isActive: true }]}
          addButton={{ label: "إضافة متجر", href: "/admin/stores/add" }}
          helpButton={{ label: "مساعدة", href: "/help" }}
        />
      </div>
      <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" dir="rtl">
        <div className="flex items-center gap-2 text-base text-[#8E8E8E]">
          <p>المتــــاجر</p>/{selectedStore && <p className=" font-semibold">{selectedStore.name}</p>}
        </div>
        <div className="flex w-full justify-between gap-2 mt-5 items-center mb-4">
          <div className="relative w-full  ">
            <input
              type="text"
              placeholder="ابحث باسم المتجر او المالك"
              className="w-full bg-white py-3 pr-10 pl-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
          </div>{" "}
          <div>
            <div className="flex text-base bg-white border border-input  py-3 px-4 rounded-[4px] text-[#555] items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5.83325 17.5V15M5.83325 15C5.05659 15 4.66825 15 4.36242 14.8733C4.16007 14.7896 3.97621 14.6668 3.82135 14.5119C3.6665 14.357 3.54368 14.1732 3.45992 13.9708C3.33325 13.665 3.33325 13.2767 3.33325 12.5C3.33325 11.7233 3.33325 11.335 3.45992 11.0292C3.54368 10.8268 3.6665 10.643 3.82135 10.4881C3.97621 10.3332 4.16007 10.2104 4.36242 10.1267C4.66825 10 5.05659 10 5.83325 10C6.60992 10 6.99825 10 7.30409 10.1267C7.50643 10.2104 7.69029 10.3332 7.84515 10.4881C8.00001 10.643 8.12282 10.8268 8.20658 11.0292C8.33325 11.335 8.33325 11.7233 8.33325 12.5C8.33325 13.2767 8.33325 13.665 8.20658 13.9708C8.12282 14.1732 8.00001 14.357 7.84515 14.5119C7.69029 14.6668 7.50643 14.7896 7.30409 14.8733C6.99825 15 6.60992 15 5.83325 15ZM14.1666 17.5V12.5M14.1666 5V2.5M14.1666 5C13.3899 5 13.0016 5 12.6958 5.12667C12.4934 5.21043 12.3095 5.33325 12.1547 5.4881C11.9998 5.64296 11.877 5.82682 11.7933 6.02917C11.6666 6.335 11.6666 6.72333 11.6666 7.5C11.6666 8.27667 11.6666 8.665 11.7933 8.97083C11.877 9.17318 11.9998 9.35704 12.1547 9.5119C12.3095 9.66675 12.4934 9.78957 12.6958 9.87333C13.0016 10 13.3899 10 14.1666 10C14.9433 10 15.3316 10 15.6374 9.87333C15.8398 9.78957 16.0236 9.66675 16.1785 9.5119C16.3333 9.35704 16.4562 9.17318 16.5399 8.97083C16.6666 8.665 16.6666 8.27667 16.6666 7.5C16.6666 6.72333 16.6666 6.335 16.5399 6.02917C16.4562 5.82682 16.3333 5.64296 16.1785 5.4881C16.0236 5.33325 15.8398 5.21043 15.6374 5.12667C15.3316 5 14.9433 5 14.1666 5ZM5.83325 7.5V2.5"
                  stroke="#393939"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span className="text-sm font-medium">تصفية</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Right Panel: Filters */}
          <div className="col-span-12 bg-white lg:col-span-2">
            <FilterPanel
              categories={filterCategories}
              activeFilter={statusFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Middle Panel: Store List */}
          <div className="col-span-12 lg:col-span-3">
            <div className="mb-4 bg-white shadow-sm py-2 rounded-lg px-4 flex justify-between ">
              {" "}
              <div className="flex text-black font-bold items-center gap-2">
                <p className="text-sm ">الكل</p>
                <span className="text-sm ">({stores.length})</span>
              </div>
              <Order orderDir={orderDir} setOrderDir={handleOrderChange} />
            </div>
            <Card className="p-0 shadow-sm rounded-lg">
              <PaginatedList<ApiStore>
                entityName="stores"
                selectedItem={selectedStore}
                onSelectItem={setSelectedStore}
                renderItem={(store) => {
                  // Only render stores that match the status filter
                  if (statusFilter && store.status !== statusFilter) {
                    return null;
                  }
                  return (
                    <StoreListItem
                      store={store}
                      isSelected={selectedStoreId === store.id}
                      onSelect={handleStoreSelect}
                    />
                  );
                }}
                searchQuery={searchQuery}
                queryParams={{ orderDir }}
              />
            </Card>
          </div>

          {/* Left Panel: Store Details */}
          <div className="col-span-12 lg:col-span-7">
            {selectedStore ? (
              <StoreDetails store={selectedStore} onStoreDeleted={handleStoreDeleted} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="171" height="171" viewBox="0 0 171 171" fill="none">
                  <path
                    d="M13.875 77.4497V113.31C13.875 135.856 13.875 147.125 20.8704 154.128C27.8578 161.132 39.1188 161.132 61.625 161.132H109.375C131.881 161.132 143.142 161.132 150.13 154.128C157.117 147.125 157.125 135.856 157.125 113.31V77.4497M45.7083 133.055H77.5417"
                    stroke="#2D496A"
                    stroke-opacity="0.8"
                    stroke-width="3.9633"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M131.627 9.90161L38.944 10.1404C25.1124 9.42411 21.563 20.0803 21.563 25.2851C21.563 29.9407 20.9661 36.7291 12.4905 49.4943C4.00688 62.2515 4.64355 66.0476 9.4265 74.8814C13.3898 82.2031 23.4809 85.0681 28.7493 85.5535C45.4618 85.9355 53.5953 71.4991 53.5953 61.3522C61.8878 86.8428 85.4684 86.8428 95.9734 83.93C106.494 81.0093 115.519 70.56 117.644 61.3522C118.885 72.7884 122.658 79.4654 133.775 84.0494C145.307 88.8005 155.215 81.5425 160.189 76.8869C165.163 72.2313 168.354 61.9014 159.489 50.5448C153.377 42.7138 150.822 35.3285 149.987 27.6885C149.509 23.2557 149.079 18.4966 145.96 15.4645C141.408 11.0396 134.866 9.69469 131.627 9.90161Z"
                    stroke="#2D496A"
                    stroke-opacity="0.8"
                    stroke-width="3.9633"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <h3 className=" text-lg lg:text-[22px] text-[#555]">لم يتم اختيار متجر</h3>
                <p className=" text-base text-[#AAA]">قم بتحديد متجر لمشاهدة تفاصيله هنا</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
