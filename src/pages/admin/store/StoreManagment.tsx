import React, { useState } from "react";
import { Search, ChevronLeft, Mail, MapPin, User, DollarSign, MessageSquare, Plus, ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaginatedList } from "@/components/admin/PaginatedList";
import { ApiStore, BaseEntity } from "@/types";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { FacebookIcon, InstagramIcon, TikTokIcon, YoutubeIcon } from "@/constants/Icons";
import { Link } from "react-router-dom";
import Actions from "@/components/Actions";
import { useAuth } from "@/context/AuthContext";

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

const FilterPanel = ({
  categories,
  activeFilter,
  onFilterChange,
}: {
  categories: FilterCategoryWithCount[];
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}) => (
  <div className="w-full">
    <div className="px-4">
      <h3 className="font-bold text-gray-800 mb-4">تصفية</h3>
      <ul className="space-y-1">
        {categories.map((cat, index) => (
          <li key={index}>
            <button
              onClick={() => onFilterChange(cat.value)}
              className={`w-full text-right px-4 py-2.5 rounded-md text-sm font-medium flex justify-between items-center ${
                activeFilter === cat.value ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{cat.name}</span>
                <span className="text-xs text-gray-500">({cat.count || 0})</span>
              </div>
              {activeFilter === cat.value && <ChevronLeft size={16} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const StoreListItem = ({
  store,
  isSelected,
  onSelect,
}: {
  store: ApiStore;
  isSelected: boolean;
  onSelect: (store: ApiStore) => void;
}) => {
  const StatusIndicator = ({ status }: { status: string }) => (
    <span className={`text-xs font-semibold ${status === "active" ? "text-green-600" : "text-yellow-600"}`}>
      ● {status === "active" ? "نشط" : "بانتظار الموافقة"}
    </span>
  );

  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(store)}
        className="form-checkbox h-5 w-5 text-main accent-main rounded border-gray-300 focus:ring-main"
        title="تحديد المتجر"
        aria-label="تحديد المتجر"
      />
      <img
        src={store.logo_url || "/placeholder-store.png"}
        alt={store.name}
        className="w-10 h-10 rounded-md object-cover"
      />
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{store.name}</p>
        <StatusIndicator status={store.status} />
      </div>
    </div>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

interface SocialLinkProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}

const StoreDetails = ({ store, onStoreDeleted }: { store: ApiStore; onStoreDeleted: () => void }) => {
  const storeQuery = useAdminEntityQuery("stores");
  const { data: currencies } = useAdminEntityQuery("currencies");
  console.log(store);
  const { user } = useAuth();
  const InfoItem = ({ icon, title, children }: InfoItemProps) => (
    <div className="flex items-start text-right justify-end gap-3">
      <div className="flex-1">
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-sm font-medium text-gray-800">{children}</p>
      </div>
      <div className="w-10 h-10 text-black p-2 rounded-xl border-input border flex items-center justify-center">
        {icon}
      </div>
    </div>
  );

  const SocialLink = ({ icon, label, value }: SocialLinkProps) => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10  p-2 rounded-xl border-input border flex items-center justify-center mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{value || "غير متوفر"}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Actions Bar */}
      <Actions
        title="إجراءات المتجر"
        isActive={store.status === "active"}
        onApprove={
          user?.user.user_type === "admin"
            ? async () => {
                try {
                  await storeQuery.update(store.id, { status: "active" });
                } catch (error) {
                  console.error("Failed to update store status:", error);
                }
              }
            : undefined
        }
        editLink={`/admin/stores/add/${store.id}`}
        entity={store as unknown as BaseEntity}
        entityType="stores"
        deleteMessage={`هل أنت متأكد من حذف المتجر "${store.name}"؟`}
        onDeleteSuccess={onStoreDeleted}
        isUpdating={storeQuery.isUpdating}
      />

      {/* Store Header */}
      <Card className="p-0 overflow-hidden">
        <div className="relative h-48 bg-gray-200">
          <img
            src={store.cover_url?.[0] || "/placeholder-cover.png"}
            alt={`${store.name} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-12 right-6">
            <img
              src={store.logo_url || "/placeholder-store.png"}
              alt={store.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
        </div>
        <div className="pt-16 px-6 pb-6">
          <h3 className="text-lg text-center font-bold mb-8 text-black">البيانات الاساسيه للمتجر</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" dir="rtl">
            {/* Right Column */}
            <div className="space-y-8">
              <InfoItem icon={<User size={20} />} title="اسم المتجر">
                {store.name}
              </InfoItem>
              <InfoItem icon={<MapPin size={20} />} title="العنوان">
                {store.address || "غير متوفر"}
              </InfoItem>
              <InfoItem icon={<MessageSquare size={20} />} title="الوصف">
                <p className="whitespace-pre-wrap">{store.description || "لا يوجد وصف متاح"}</p>
              </InfoItem>
              <InfoItem icon={<User size={20} />} title="المالك">
                {store.owner_id}
              </InfoItem>
              <InfoItem icon={<DollarSign size={20} />} title="عملة المتجر">
                {currencies?.find((c) => c.id === store.currency_id)?.name || "غير متوفر"}
                {currencies?.find((c) => c.id === store.currency_id)?.symbol && (
                  <span className="text-gray-500 text-xs mr-1">
                    ({currencies.find((c) => c.id === store.currency_id)?.symbol})
                  </span>
                )}
              </InfoItem>
            </div>
            {/* Left Column */}
            <div className="space-y-8">
              <InfoItem icon={<Mail size={20} />} title="البريد الالكتروني للمتجر">
                {store.email}
              </InfoItem>
            </div>
          </div>
        </div>
      </Card>

      {/* Social Links Card */}
      <Card className="p-6">
        <h3 className="text-base font-bold mb-4 text-black">بيانات الاتصال والسوشيال</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <SocialLink
            icon={<MessageSquare size={20} className="text-green-500" />}
            label="واتساب"
            value={store.whats_app}
          />
          <SocialLink icon={<Mail size={20} className="text-gray-500" />} label="ايميل" value={store.email} />
          <SocialLink icon={<FacebookIcon />} label="فيسبوك" value={store.facebook} />
          <SocialLink icon={<InstagramIcon />} label="انستغرام" value={store.instagram} />
          <SocialLink icon={<YoutubeIcon />} label="يوتيوب" value={store.youtube} />
          <SocialLink icon={<TikTokIcon />} label="تيك توك" value={store.tiktok} />
        </div>
      </Card>

      {/* Working Hours Card */}
      <Card className="p-6">
        <h3 className="text-base font-bold mb-4 text-black">أوقات عمل المتجر</h3>
        <div className="space-y-3">
          {store.workingtimes.map((wh) => (
            <div key={wh.id} className="flex justify-between items-center text-sm">
              <p className="font-semibold text-gray-800">{wh.day}</p>
              <p className="text-gray-600">
                {wh.from} - {wh.to}
              </p>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  !wh.closed_always ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {!wh.closed_always ? "متاح" : "مغلق"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default function StoreManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<ApiStore | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc");
  const [selectedStores, setSelectedStores] = useState<Set<number>>(new Set());
  const { user } = useAuth();
  const { data: stores = [] } = useAdminEntityQuery("stores");

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
    setSelectedStores((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(store.id)) {
        newSet.delete(store.id);
      } else {
        newSet.add(store.id);
      }
      return newSet;
    });
  };

  const handleStoreDeleted = () => {
    setSelectedStore(null);
    setSelectedStores((prev) => {
      const newSet = new Set(prev);
      if (selectedStore) {
        newSet.delete(selectedStore.id);
      }
      return newSet;
    });
  };

  const { isLoading: storesLoading } = useAdminEntityQuery("stores");
  if (storesLoading) return <div>Loading...</div>;
  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" dir="rtl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">المتاجر / متجرك</h1>
        <div className="flex items-center gap-3">
          <Link to={user?.user.user_type === "admin" ? "/admin/stores/add" : "/dashboard/stores/add"}>
            <Button variant="default" className="bg-main text-white hover:bg-main/90">
              <Plus size={16} /> إضافة متجر
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex w-full justify-between items-center mb-4">
        <div className="relative w-full  ">
          <input
            type="text"
            placeholder="ابحث باسم المتجر او المالك"
            className="w-full bg-white py-3 pr-10 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Right Panel: Filters */}
        <div className="col-span-12 lg:col-span-2">
          <Card className="p-0">
            <FilterPanel
              categories={filterCategories}
              activeFilter={statusFilter}
              onFilterChange={handleFilterChange}
            />
          </Card>
        </div>

        {/* Middle Panel: Store List */}
        <div className="col-span-12 lg:col-span-3">
          <div className="mb-4 flex justify-between ">
            {" "}
            <div className="flex text-black font-bold items-center gap-2">
              <p className="text-sm ">الكل</p>
              <span className="text-sm ">({stores.length})</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 text-gray-600 border-gray-200">
                  <ArrowUpDown size={16} />
                  ترتيب
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="end">
                <div className="flex flex-col">
                  <button
                    onClick={() => handleOrderChange("asc")}
                    className={`w-full text-right px-4 py-2.5 text-sm font-medium flex justify-between items-center hover:bg-gray-50 ${
                      orderDir === "asc" ? "text-main" : "text-gray-600"
                    }`}
                  >
                    <span>تصاعدي</span>
                    {orderDir === "asc" && <ChevronLeft size={16} />}
                  </button>
                  <button
                    onClick={() => handleOrderChange("desc")}
                    className={`w-full text-right px-4 py-2.5 text-sm font-medium flex justify-between items-center hover:bg-gray-50 ${
                      orderDir === "desc" ? "text-main" : "text-gray-600"
                    }`}
                  >
                    <span>تنازلي</span>
                    {orderDir === "desc" && <ChevronLeft size={16} />}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Card className="p-0">
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
                  <StoreListItem store={store} isSelected={selectedStores.has(store.id)} onSelect={handleStoreSelect} />
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
  );
}
