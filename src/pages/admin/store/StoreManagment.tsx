import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  Mail,
  MapPin,
  User,
  DollarSign,
  MessageSquare,
  Plus,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaginatedList } from "@/components/admin/PaginatedList";
import { ApiStore } from "@/hooks/useUsers";
import { FacebookIcon, InstagramIcon, TikTokIcon, YoutubeIcon } from "@/constants/Icons";
import { Link } from "react-router-dom";
import Actions from "@/components/Actions";

interface FilterCategory {
  name: string;
  value: string | null;
  active?: boolean;
}

const FILTER_CATEGORIES: FilterCategory[] = [
  { name: "الكل", value: null, active: true },
  { name: "نشط", value: "active" },
  { name: "بانتظار الموافقة", value: "pending" },
];

const FilterPanel = ({
  categories,
  activeFilter,
  onFilterChange,
}: {
  categories: FilterCategory[];
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}) => (
  <div className="w-full">
    <h3 className="font-bold text-gray-800 mb-4 px-2">تصفية</h3>
    <ul>
      {categories.map((cat, index) => (
        <li key={index}>
          <button
            onClick={() => onFilterChange(cat.value)}
            className={`w-full text-right px-4 py-2.5 rounded-md text-sm font-medium flex justify-between items-center ${
              activeFilter === cat.value ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>{cat.name}</span>
            {activeFilter === cat.value && <ChevronLeft size={16} />}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const StoreListItem = ({ store }: { store: ApiStore }) => {
  const StatusIndicator = ({ status }: { status: string }) => (
    <span className={`text-xs font-semibold ${status === "active" ? "text-green-600" : "text-yellow-600"}`}>
      ● {status === "active" ? "نشط" : "بانتظار الموافقة"}
    </span>
  );

  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <input
        type="checkbox"
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

const StoreDetails = ({
  store,
  onUpdateStatus,
  isUpdatingStatus,
}: {
  store: ApiStore;
  onUpdateStatus: (storeId: number, status: string) => void;
  isUpdatingStatus: boolean;
}) => {
  const InfoItem = ({ icon, title, children }: InfoItemProps) => (
    <div className="flex items-start justify-end gap-3 text-right">
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
        onApprove={() => onUpdateStatus(store.id, "active")}
        editLink={`/admin/stores/add/${store.id}`}
        onDelete={() => {
          // TODO: Implement delete functionality
          alert("سيتم تنفيذ حذف المتجر قريباً");
        }}
        isUpdating={isUpdatingStatus}
      />

      {/* Store Header */}
      <Card className="p-0 overflow-hidden">
        <div className="relative h-48 bg-gray-200">
          <img
            src={store.cover_url || "/placeholder-cover.png"}
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
                {store.currency_id}
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleFilterChange = (filter: string | null) => {
    setStatusFilter(filter);
  };

  const updateStoreStatus = async (storeId: number, status: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/stores/${storeId}/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
          context: "admin_approval",
        }),
      });

      if (response.ok) {
        // Show success notification - using alert for now, can be replaced with proper toast
        alert("تم تحديث حالة المتجر بنجاح");

        // Update the selected store status locally
        if (selectedStore && selectedStore.id === storeId) {
          setSelectedStore({ ...selectedStore, status: status as "active" | "inactive" });
        }

        // Optionally refresh the store list
        window.location.reload();
      } else {
        throw new Error("Failed to update store status");
      }
    } catch (error) {
      console.error("Error updating store status:", error);
      alert("حدث خطأ أثناء تحديث حالة المتجر");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" dir="rtl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">المتاجر / متجرك</h1>
        <div className="flex items-center gap-3">
          <Link to="/admin/stores/add">
            <Button variant="default" className="bg-main text-white hover:bg-main/90">
              <Plus size={16} /> إضافة متجر
            </Button>
          </Link>
          <Button variant="outline">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </header>

      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-lg">
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
        <Button variant="outline">
          <Filter size={16} /> تصفية
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Right Panel: Filters */}
        <div className="col-span-12 lg:col-span-2">
          <Card className="p-0">
            <FilterPanel
              categories={FILTER_CATEGORIES}
              activeFilter={statusFilter}
              onFilterChange={handleFilterChange}
            />
          </Card>
        </div>

        {/* Middle Panel: Store List */}
        <div className="col-span-12 lg:col-span-3">
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
                return <StoreListItem store={store} />;
              }}
              searchQuery={searchQuery}
            />
          </Card>
        </div>

        {/* Left Panel: Store Details */}
        <div className="col-span-12 lg:col-span-7">
          {selectedStore ? (
            <StoreDetails
              store={selectedStore}
              onUpdateStatus={updateStoreStatus}
              isUpdatingStatus={isUpdatingStatus}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 p-8">
              {searchQuery.trim() !== "" ? "لا يوجد نتائج للبحث" : "الرجاء تحديد متجر لعرض التفاصيل"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
