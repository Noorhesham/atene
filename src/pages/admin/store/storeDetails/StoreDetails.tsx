import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/constants/api";
import { ApiStore } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { BaseEntity } from "@/types";
import { Phone, Whatsapp, YoutubeIcon, FacebookIcon, InstagramIcon, TikTokIcon, Email } from "@/constants/Icons";
import { Card } from "@/components/ui/card";
import Actions from "@/components/Actions";
import { MapPinIcon } from "lucide-react";
import { InfoItem } from "@/components/InfoItem";
import { useQueryClient } from "@tanstack/react-query";

interface SocialLinkProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}

const StoreDetails = ({
  store,
  onStoreDeleted,
  onStoreUpdated,
}: {
  store: ApiStore;
  onStoreDeleted: () => void;
  onStoreUpdated?: () => void;
}) => {
  const storeQuery = useAdminEntityQuery("stores");
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(true);

  const token = localStorage.getItem("token");

  // Helper function to translate days to Arabic
  const translateDay = (day: string) => {
    const dayMap: { [key: string]: string } = {
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
      sunday: "الأحد",
    };
    return dayMap[day.toLowerCase()] || day;
  };

  // Helper function to format time in Arabic format
  const formatTimeArabic = (time: string) => {
    if (!time) return "غير محدد";

    try {
      // Parse the time string (assuming it's in HH:MM format)
      const [hours, minutes] = time.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) return time;

      let period = "";
      let displayHours = hours;

      if (hours >= 12) {
        period = "مساءً";
        if (hours > 12) {
          displayHours = hours - 12;
        }
      } else {
        period = "صباحاً";
        if (hours === 0) {
          displayHours = 12;
        }
      }

      // Format with leading zeros and Arabic text
      const formattedHours = displayHours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");

      return `${formattedHours}:${formattedMinutes} ${period}`;
    } catch {
      return time; // Return original if parsing fails
    }
  };

  const updateStoreStatus = async (store: ApiStore) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stores/${store.id}/update-status`, {
        method: "POST",
        body: JSON.stringify({ status: store.status === "active" ? "not-active" : "active" }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          store_id: store.id.toString(),
        },
      });
      if (!res.ok) {
        throw new Error("Failed to update store status");
      }

      toast.success("تم تحديث حالة المتجر");

      // Invalidate all admin stores queries to ensure UI updates
      // Query key structure: ["admin", "stores", { page, per_page, name, ...queryParams }]
      await queryClient.invalidateQueries({
        queryKey: ["admin", "stores"],
        exact: false,
      });

      // Also invalidate any stores queries with different parameters
      await queryClient.invalidateQueries({
        queryKey: ["stores"],
        exact: false,
      });

      // Invalidate any queries that might contain "stores" in the key
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey.some((key) => typeof key === "string" && key.includes("stores"));
        },
      });

      // Refetch the current stores query
      await storeQuery.refetch();

      // Notify parent component to refresh its data
      if (onStoreUpdated) {
        onStoreUpdated();
      }
    } catch (error) {
      console.error("Failed to update store status:", error);
      toast.error("فشل تفعيل المتجر");
    }
  };

  const { data: currencies } = useAdminEntityQuery("currencies");
  console.log(store);
  const { user } = useAuth();

  const SocialLink = ({ icon, label, value }: SocialLinkProps) => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10  p-2 rounded-xl border-input border flex items-center justify-center mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-[#1C1C1C] hover:underline cursor-pointer">{value || "غير متوفر"}</p>
      </div>
    </div>
  );

  console.log(store);

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
                  await updateStoreStatus(store);
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

      <div className="flex flex-col gap-4  p-6 bg-white">
        {" "}
        {/* Store Header */}
        <Card className="p-0   px-6 py-3 overflow-hidden rounded-lg">
          <div className=" ">
            <div className="relative h-[98px] bg-gray-200 rounded-lg">
              <img
                src={store.cover_url?.[0] || "/placeholder-cover.png"}
                alt={`${store.name} cover`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bg-white rounded-[10px] overflow-hidden -translate-y-1/2 top-1/2 right-6">
                <img
                  src={store.logo_url || "/placeholder-store.png"}
                  alt={store.name}
                  className="w-[75px] h-[75px]  object-cover border-4 border-white shadow-md"
                />
              </div>
            </div>

            <h3 className="text-lg text-right font-bold mb-8 mt-9 text-black">البيانات الاساسيه للمتجر</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" dir="rtl">
              {/* Right Column */}
              <div className="space-y-8">
                <InfoItem
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <g clip-path="url(#clip0_1808_78936)">
                        <path
                          d="M2.83332 8.95662C2.12232 7.71762 1.77882 6.70512 1.57182 5.67912C1.26582 4.16112 1.96632 2.67837 3.12657 1.73187C3.61707 1.33212 4.17957 1.46937 4.46982 1.98912L5.12457 3.16437C5.64357 4.09587 5.90307 4.56087 5.85207 5.05437C5.80032 5.54862 5.45007 5.95062 4.75032 6.75462L2.83332 8.95662ZM2.83332 8.95662C4.27257 11.4661 6.53082 13.7266 9.04332 15.1666M9.04332 15.1666C10.2831 15.8776 11.2948 16.2211 12.3208 16.4281C13.8388 16.7341 15.3216 16.0336 16.2673 14.8734C16.6678 14.3829 16.5306 13.8204 16.0108 13.5301L14.8356 12.8754C13.9041 12.3564 13.4391 12.0969 12.9456 12.1479C12.4513 12.1996 12.0493 12.5499 11.2453 13.2496L9.04332 15.1666Z"
                          stroke="black"
                          stroke-width="1.125"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1808_78936">
                          <rect width="18" height="18" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  }
                  title="اسم المتجر"
                >
                  {store.name || "غير متوفر"}
                </InfoItem>
                <InfoItem icon={<MapPinIcon size={20} />} title="العنوان">
                  {store.address || "غير متوفر"}
                </InfoItem>
                <InfoItem
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M6 3.75H15M3 3.75H3.00675M3 9H3.00675M3 14.25H3.00675M6 9H15M6 14.25H15"
                        stroke="black"
                        stroke-width="1.125"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  }
                  title="الوصف"
                >
                  <p className="whitespace-pre-wrap text-[#8E8E8E]">{store.description || "لا يوجد وصف متاح"}</p>
                </InfoItem>

                <InfoItem
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <g clip-path="url(#clip0_1808_78968)">
                        <path
                          d="M11.625 9.75C14.3174 9.75 16.5 9.07843 16.5 8.25C16.5 7.42157 14.3174 6.75 11.625 6.75C8.93261 6.75 6.75 7.42157 6.75 8.25C6.75 9.07843 8.93261 9.75 11.625 9.75Z"
                          stroke="black"
                          stroke-width="1.125"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M16.5 11.625C16.5 12.4538 14.3175 13.125 11.625 13.125C8.9325 13.125 6.75 12.4538 6.75 11.625"
                          stroke="black"
                          stroke-width="1.125"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M16.5 8.25V14.85C16.5 15.7612 14.3175 16.5 11.625 16.5C8.9325 16.5 6.75 15.7612 6.75 14.85V8.25"
                          stroke="black"
                          stroke-width="1.125"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.375 4.5C9.06739 4.5 11.25 3.82843 11.25 3C11.25 2.17157 9.06739 1.5 6.375 1.5C3.68261 1.5 1.5 2.17157 1.5 3C1.5 3.82843 3.68261 4.5 6.375 4.5Z"
                          stroke="black"
                          stroke-width="1.125"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M4.5 8.25C3.081 8.0775 1.7775 7.63125 1.5 6.75M4.5 12C3.081 11.8275 1.7775 11.3812 1.5 10.5"
                          stroke="black"
                          stroke-width="1.125"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M4.5 15.75C3.081 15.5775 1.7775 15.1305 1.5 14.25V3M11.25 4.5V3"
                          stroke="black"
                          stroke-width="1.125"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1808_78968">
                          <rect width="18" height="18" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  }
                  title="عملة المتجر"
                >
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
                <InfoItem icon={<Email />} title="البريد الالكتروني للمتجر">
                  {store.email || "غير متوفر"}
                </InfoItem>
                <InfoItem
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                      <path
                        d="M9.87497 16.5H5.44247C4.28372 16.5 3.36197 15.936 2.53472 15.1478C0.839721 13.533 3.62222 12.243 4.68347 11.6115C6.35899 10.6212 8.3382 10.2762 10.25 10.641M14.5182 10.9335L15.0462 11.9985C15.091 12.0783 15.1521 12.1478 15.2255 12.2024C15.2989 12.2571 15.3829 12.2957 15.4722 12.3157L16.4292 12.4755C17.0412 12.5783 17.1852 13.026 16.7442 13.4678L16.0002 14.2178C15.935 14.2916 15.8871 14.3791 15.8602 14.4738C15.8332 14.5686 15.8277 14.6681 15.8442 14.7653L16.0572 15.6937C16.2252 16.4287 15.8382 16.713 15.1932 16.329L14.2962 15.7935C14.2045 15.7459 14.1026 15.7211 13.9992 15.7211C13.8958 15.7211 13.794 15.7459 13.7022 15.7935L12.8052 16.329C12.1632 16.713 11.7732 16.4257 11.9412 15.6937L12.1542 14.7653C12.1707 14.6681 12.1653 14.5686 12.1383 14.4738C12.1113 14.3791 12.0634 14.2916 11.9982 14.2178L11.2542 13.4678C10.817 13.026 10.958 12.5783 11.5692 12.4755L12.5262 12.3157C12.615 12.2952 12.6986 12.2563 12.7714 12.2016C12.8443 12.1468 12.9048 12.0774 12.9492 11.9977L13.4772 10.9327C13.7652 10.3552 14.2332 10.3552 14.5182 10.9327M12.125 4.875C12.125 5.31821 12.0377 5.75708 11.8681 6.16656C11.6985 6.57603 11.4499 6.94809 11.1365 7.26149C10.8231 7.57488 10.451 7.82348 10.0415 7.99309C9.63205 8.1627 9.19318 8.25 8.74997 8.25C8.30676 8.25 7.86789 8.1627 7.45841 7.99309C7.04894 7.82348 6.67688 7.57488 6.36349 7.26149C6.05009 6.94809 5.80149 6.57603 5.63188 6.16656C5.46227 5.75708 5.37497 5.31821 5.37497 4.875C5.37497 3.97989 5.73055 3.12145 6.36349 2.48851C6.99642 1.85558 7.85487 1.5 8.74997 1.5C9.64508 1.5 10.5035 1.85558 11.1365 2.48851C11.7694 3.12145 12.125 3.97989 12.125 4.875Z"
                        stroke="black"
                        stroke-width="1.125"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  }
                  title="المالك"
                >
                  {/* Note: ApiStore doesn't have owner property, this would need to be fetched separately */}
                  "معلومات المالك غير متوفرة"
                </InfoItem>
              </div>
            </div>
          </div>
        </Card>
        {/* Social Links Card */}
        <Card className="px-4 shadow-xs">
          <h3 className="text-base font-bold  text-black">بيانات الاتصال والسوشيال</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
            <SocialLink icon={<Whatsapp />} label="واتساب" value={store.whats_app} />
            <SocialLink icon={<Phone />} label="الهااتف المحمول" value={store.phone} />
            <SocialLink icon={<FacebookIcon />} label="فيسبوك" value={store.facebook} />
            <SocialLink icon={<InstagramIcon />} label="انستغرام" value={store.instagram} />
            <SocialLink icon={<YoutubeIcon />} label="يوتيوب" value={store.youtube} />
            <SocialLink icon={<TikTokIcon />} label="تيك توك" value={store.tiktok} />
          </div>
        </Card>
        {store.managers && store.managers.length > 0 && (
          <Card dir="rtl" className="p-4 shadow-xs w-full  bg-white rounded-md">
            <h3 className="text-lg font-bold  text-gray-900">موظفين المتجر</h3>
            <div className="space-y-1 w-full flex flex-col gap-4">
              {store.managers.map((manager) => (
                <div
                  key={manager.id}
                  className="flex items-center justify-start space-x-4 space-x-reverse p-2 rounded-md bg-gray-50"
                >
                  {" "}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <img src="/placeholder.png" alt="Manager Avatar" className="object-cover w-full h-full" />
                  </div>
                  <div className="mx-4 flex text-right">
                    <div className="  mx-3">
                      <p className="font-semibold text-base  text-black">{manager.title || "موظف"}</p>
                      <p className="text-sm text-main underline">{manager.email || "غير متوفر"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${manager.email}`}
                        className="text-sm text-main hover:text-main flex items-center space-x-2 space-x-reverse mt-1"
                      >
                        <span>{manager.email}</span>
                      </a>
                      <a href={`mailto:${manager.email}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                          <path
                            d="M12 22.5C17.523 22.5 22 18.023 22 12.5C22 6.977 17.523 2.5 12 2.5C6.477 2.5 2 6.977 2 12.5C2 13.879 2.28 15.193 2.784 16.388C3.063 17.048 3.202 17.378 3.22 17.628C3.237 17.878 3.163 18.152 3.016 18.701L2 22.5L5.799 21.484C6.348 21.337 6.622 21.264 6.872 21.28C7.122 21.298 7.452 21.437 8.112 21.716C9.34266 22.2343 10.6647 22.5009 12 22.5Z"
                            stroke="#406896"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.58817 12.877L9.45917 11.796C9.82617 11.34 10.2792 10.916 10.3162 10.308C10.3242 10.155 10.2162 9.467 10.0012 8.09C9.91617 7.549 9.41017 7.5 8.97317 7.5C8.40317 7.5 8.11817 7.5 7.83517 7.63C7.47717 7.793 7.11017 8.252 7.02917 8.637C6.96517 8.942 7.01317 9.152 7.10817 9.572C7.51017 11.355 8.45517 13.116 9.91917 14.581C11.3842 16.045 13.1452 16.99 14.9292 17.392C15.3492 17.487 15.5582 17.535 15.8632 17.471C16.2482 17.391 16.7072 17.023 16.8712 16.665C17.0002 16.382 17.0002 16.097 17.0002 15.527C17.0002 15.089 16.9512 14.584 16.4102 14.499C15.0332 14.283 14.3452 14.176 14.1922 14.184C13.5852 14.22 13.1602 14.674 12.7042 15.041L11.6232 15.911"
                            stroke="#406896"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </a>
                      <a href={`mailto:${manager.email}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                          <path
                            d="M7 9L9.942 10.74C11.657 11.754 12.342 11.754 14.058 10.74L17 9"
                            stroke="#406896"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2.01581 13.9761C2.08081 17.0411 2.11381 18.5741 3.24481 19.7091C4.37581 20.8451 5.94981 20.8841 9.09881 20.9631C11.0388 21.0131 12.9608 21.0131 14.9008 20.9631C18.0498 20.8841 19.6238 20.8451 20.7548 19.7091C21.8858 18.5741 21.9188 17.0411 21.9848 13.9761C22.0048 12.9901 22.0048 12.0101 21.9848 11.0241C21.9188 7.95908 21.8858 6.42608 20.7548 5.29108C19.6238 4.15508 18.0498 4.11608 14.9008 4.03708C12.9671 3.98829 11.0325 3.98829 9.09881 4.03708C5.94981 4.11608 4.37581 4.15508 3.24481 5.29108C2.11381 6.42608 2.08081 7.95908 2.01481 11.0241C1.99376 12.008 1.99476 12.9922 2.01581 13.9761Z"
                            stroke="#406896"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="flex font-semibold  gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-[#717171]">الدور الوظيفي </p>
                      <p className="text-sm text-black  ">
                        {manager.title === "general_manager" ? "مدير عام" : manager.title || "غير محدد"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-[#717171]">البريد الالكتروني </p>
                      <p className="text-sm text-black  ">{manager.email || "غير متوفر"}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-[#717171]"> الحالة </p>
                      <p className="text-sm text-black  ">{manager.status || "غير محدد"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        {/* Working Hours Card */}
        <Card className={`px-4 shadow-xs bg-white rounded-xl w-full  mx-auto `} dir="rtl">
          <h3 className="text-lg font-bold mb-6 text-right text-gray-900">أوقات عمل المتجر</h3>

          <div className="space-y-4">
            {/* Headers */}
            <div className="grid grid-cols-3 max-w-lg text-right gap-4 text-sm text-gray-400">
              <p className="font-bold text-right">اليوم</p>
              <p className="">يفتح في</p>
              <p className="">يغلق في</p>
            </div>

            {/* Working Times List (showing first 2 from the image) */}
            <div className="space-y-3  max-w-lg">
              {store.workingtimes && store.workingtimes.length > 0 ? (
                store.workingtimes.slice(0, collapsed ? 2 : store.workingtimes.length).map((wh) => (
                  <div key={wh.id} className="grid grid-cols-3 gap-4 text-sm items-center">
                    <p className="font-bold text-gray-800 text-right">{translateDay(wh.day || "غير محدد")}</p>
                    <p className="text-gray-600 text-right">{formatTimeArabic(wh.from || "غير محدد")}</p>
                    <p className="text-gray-600 text-right">{formatTimeArabic(wh.to || "غير محدد")}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد أوقات عمل محددة</p>
              )}
            </div>
          </div>

          {/* View All Button - Only show if there are more than 2 working times */}
          {store.workingtimes && store.workingtimes.length > 2 && (
            <div className="mt-8 w-fit mx-auto">
              <button
                onClick={() => {
                  setCollapsed(!collapsed);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{collapsed ? "مشاهدة جميع الايام" : "إخفاء"}</span>
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StoreDetails;
