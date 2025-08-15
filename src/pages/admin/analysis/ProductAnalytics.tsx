import { useMemo, useState } from "react";
import { useAnalyticsQuery } from "@/hooks/useAnalyticsQuery";
import { PageHeader } from "../PageHeader";
import { ChevronDown } from "lucide-react";
import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import FilterPanel from "@/components/FilterPanel";
import PeriodSelector from "./PeriodSelector";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import StatsCard from "./StatsCard";
import { Button } from "@/components/ui/button";

const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
);
const ProductStatCard = ({
  title,
  value,
  icon,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
}) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div className="text-right">
        <h3 className="text-gray-500 font-semibold">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-1">{isLoading ? "..." : value}</p>
      </div>
      <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
    </div>
  </Card>
);

const MostOrderedProducts = ({ data, isLoading }: { data: any[]; isLoading: boolean }) => (
  <Card className="p-6 ">
    <div className="flex w-fit gap-2   items-start mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.2929 4.7929C11.6834 4.40238 12.3165 4.40236 12.7071 4.79289L18.7071 10.7928C19.0976 11.1833 19.0976 11.8165 18.7071 12.207C18.3166 12.5975 17.6834 12.5975 17.2929 12.207L12 6.91421L6.7071 12.2071C6.31658 12.5976 5.68342 12.5976 5.29289 12.2071C4.90237 11.8165 4.90236 11.1834 5.29289 10.7929L11.2929 4.7929Z"
          fill="#1FC16B"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.2929 11.793C11.6834 11.4024 12.3165 11.4024 12.7071 11.7929L18.7071 17.7929C19.0976 18.1834 19.0976 18.8166 18.7071 19.2071C18.3166 19.5976 17.6834 19.5976 17.2929 19.2071L12 13.9143L6.7071 19.2072C6.31658 19.5977 5.68342 19.5977 5.29289 19.2072C4.90237 18.8166 4.90236 18.1835 5.29289 17.793L11.2929 11.793Z"
          fill="#1FC16B"
        />
      </svg>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-gray-800">المنتجات الاكثر طلبا</h3>
        <p className="text-[#777] text-base font-semibold"> قائمة المنتجات التي حصلت علي طلبات اكثر </p>
      </div>
    </div>
    {isLoading ? (
      <div className="animate-pulse h-48 bg-gray-200 rounded-md" />
    ) : (
      <div className="space-y-3 max-h-96  overflow-y-auto w-full relative">
        {data.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between relative z-10">
            <span className="text-sm font-bold text-gray-400">{index + 1}</span>
            <div className="flex mr-3 items-center gap-4 flex-grow">
              <img src={product.cover_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <p className="font-semibold text-sm text-gray-800">{product.name}</p>
                <p className="text-xs text-gray-500">عدد الطلبات: {product.review_count} طلب</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default function ProductsAnalytics() {
  const [period, setPeriod] = useState<Period>("current_year");
  const { data, isLoading } = useAnalyticsQuery("products", period);
  console.log(data);
  const chartData = useMemo(() => {
    return (data?.productsGrowthChart || []).map((d: any) => ({
      date: d.date,
      "اجمالي المنتجات": Number(d.total_count) || 0,
      "منتجات تم رفضها": Number(d.not_active_count) || 0,
      "منتجات في انتظار الموافقة": Number(d.active_count) || 0, // Mapping active to pending for visual representation
    }));
  }, [data]);

  const navLinks = [
    { label: "ملخص المنصة", href: "/admin/dashboard" },
    { label: " التقارير", href: "/admin/analytics/stores" },
    { label: "المنتجات", href: "/admin/analytics/products", isActive: true },
  ];

  return (
    <div className="bg-gray-50 w-full min-h-screen" dir="rtl">
      <PageHeader
        navLinks={navLinks}
        addButton={{ label: "تصدير", href: "#" }}
        helpButton={{ label: "مساعدة", href: "#" }}
      />

      <div className="grid grid-cols-12 gap-6 p-4 sm:p-8">
        {/* Right panel: filters */}
        <div className="col-span-12 lg:col-span-3">
          <FilterPanel
            categories={[
              { name: "التجار", value: "merchants" },
              { name: "المنتجات", value: "products", active: true },
              { name: "المتاجر", value: "stores" },
              { name: "العملاء", value: "customers" },
            ]}
            activeFilter={"products"}
            onFilterChange={() => {}}
          />
        </div>

        {/* Main content */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12.0001 22C11.1821 22 10.4001 21.67 8.83706 21.01C4.94606 19.366 3.00006 18.543 3.00006 17.16V7M12.0001 22C12.8181 22 13.6001 21.67 15.1631 21.01C19.0541 19.366 21.0001 18.543 21.0001 17.16V7M12.0001 22V11.355M6.00006 12L8.00006 13M17.0001 4L7.00006 9M8.32606 9.691L5.40506 8.278C3.80206 7.502 3.00006 7.114 3.00006 6.5C3.00006 5.886 3.80206 5.498 5.40506 4.722L8.32506 3.309C10.1301 2.436 11.0301 2 12.0001 2C12.9701 2 13.8711 2.436 15.6741 3.309L18.5951 4.722C20.1981 5.498 21.0001 5.886 21.0001 6.5C21.0001 7.114 20.1981 7.502 18.5951 8.278L15.6751 9.691C13.8701 10.564 12.9701 11 12.0001 11C11.0301 11 10.1291 10.564 8.32606 9.691Z"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              تقارير المنتجات
            </h2>
            <div className="flex items-center gap-2">
              {" "}
              <PeriodSelector period={period} setPeriod={setPeriod} />{" "}
              <Button className="flex items-center bg-main gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path
                    d="M12.391 15V5M12.391 15C11.691 15 10.383 13.006 9.89099 12.5M12.391 15C13.091 15 14.399 13.006 14.891 12.5M20.391 17C20.391 19.482 19.873 20 17.391 20H7.39099C4.90899 20 4.39099 19.482 4.39099 17"
                    stroke="#F5F5F5"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                تصدير
              </Button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-6">
            <StatsCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61" fill="none">
                  <path
                    d="M18.4816 53.0709L13.1309 50.2229C5.43069 46.1244 0.815662 37.9233 1.30863 29.2143C1.73943 21.6034 6.01672 14.736 12.6575 10.993L16.964 8.56573C24.6938 4.20896 34.1843 4.41469 41.718 9.10232C48.1925 13.1309 52.3988 19.9666 53.077 27.5619L53.2942 29.995C54.0415 38.3643 50.3105 46.5055 43.483 51.4035C36.1443 56.6682 26.4544 57.3145 18.4816 53.0709Z"
                    fill="#5B88BA"
                    fill-opacity="0.2"
                  />
                  <path
                    d="M27.5 55.5C25.455 55.5 23.5 54.675 19.5925 53.025C9.865 48.915 5 46.8575 5 43.4V18M27.5 55.5C29.545 55.5 31.5 54.675 35.4075 53.025C45.135 48.915 50 46.8575 50 43.4V18M27.5 55.5V28.8875M12.5 30.5L17.5 33M40 10.5L15 23M18.315 24.7275L11.0125 21.195C7.005 19.255 5 18.285 5 16.75C5 15.215 7.005 14.245 11.0125 12.305L18.3125 8.7725C22.825 6.59 25.075 5.5 27.5 5.5C29.925 5.5 32.1775 6.59 36.685 8.7725L43.9875 12.305C47.995 14.245 50 15.215 50 16.75C50 18.285 47.995 19.255 43.9875 21.195L36.6875 24.7275C32.175 26.91 29.925 28 27.5 28C25.075 28 22.8225 26.91 18.315 24.7275Z"
                    stroke="#406896"
                    stroke-width="3.9633"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
              title="اجمالي المنتجات"
              val={data?.totalActiveProducts || 0}
              isLoading={isLoading}
              color="#5B88BA"
            />
            <StatsCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61" fill="none">
                  <path
                    d="M21.9816 52.5709L16.6309 49.7229C8.93069 45.6244 4.31566 37.4233 4.80863 28.7143C5.23943 21.1034 9.51672 14.236 16.1575 10.493L20.464 8.06573C28.1938 3.70896 37.6843 3.91469 45.218 8.60232C51.6925 12.6309 55.8988 19.4666 56.577 27.0619L56.7942 29.495C57.5415 37.8643 53.8105 46.0055 46.983 50.9035C39.6443 56.1682 29.9544 56.8145 21.9816 52.5709Z"
                    fill="#FFDB43"
                    fill-opacity="0.1"
                  />
                  <path
                    d="M28 55.5C25.955 55.5 24 54.675 20.0925 53.025C10.365 48.915 5.5 46.8575 5.5 43.4V18M28 55.5V28.8875M28 55.5C28.85 55.5 29.615 55.3575 30.5 55.07M50.5 18V29.25M45.5 45.5L47.765 43.2375M13 30.5L18 33M40.5 10.5L15.5 23M55.5 45.5C55.5 42.8478 54.4464 40.3043 52.5711 38.4289C50.6957 36.5536 48.1522 35.5 45.5 35.5C42.8478 35.5 40.3043 36.5536 38.4289 38.4289C36.5536 40.3043 35.5 42.8478 35.5 45.5C35.5 48.1522 36.5536 50.6957 38.4289 52.5711C40.3043 54.4464 42.8478 55.5 45.5 55.5C48.1522 55.5 50.6957 54.4464 52.5711 52.5711C54.4464 50.6957 55.5 48.1522 55.5 45.5ZM18.815 24.7275L11.5125 21.195C7.505 19.255 5.5 18.285 5.5 16.75C5.5 15.215 7.505 14.245 11.5125 12.305L18.8125 8.7725C23.325 6.59 25.575 5.5 28 5.5C30.425 5.5 32.6775 6.59 37.185 8.7725L44.4875 12.305C48.495 14.245 50.5 15.215 50.5 16.75C50.5 18.285 48.495 19.255 44.4875 21.195L37.1875 24.7275C32.675 26.91 30.425 28 28 28C25.575 28 23.3225 26.91 18.815 24.7275Z"
                    stroke="#DFB400"
                    stroke-width="3.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
              title="منتجات في انتظار الموافقة"
              val={data?.totalNotActiveProducts || 0}
              isLoading={isLoading}
              color="#FFDB43"
            />
            <StatsCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="61" height="60" viewBox="0 0 61 60" fill="none">
                  <path
                    d="M28 55C25.955 55 24 54.175 20.0925 52.525C10.365 48.415 5.5 46.3575 5.5 42.9V17.5M28 55V28.3875M28 55C29.5425 55 30.8 54.53 33 53.5925M50.5 17.5V30M40.5 37.5L48 45M48 45L55.5 52.5M48 45L40.5 52.5M48 45L55.5 37.5M13 30L18 32.5M40.5 10L15.5 22.5M18.815 24.2275L11.5125 20.695C7.505 18.755 5.5 17.785 5.5 16.25C5.5 14.715 7.505 13.745 11.5125 11.805L18.8125 8.2725C23.325 6.09 25.575 5 28 5C30.425 5 32.6775 6.09 37.185 8.2725L44.4875 11.805C48.495 13.745 50.5 14.715 50.5 16.25C50.5 17.785 48.495 18.755 44.4875 20.695L37.1875 24.2275C32.675 26.41 30.425 27.5 28 27.5C25.575 27.5 23.3225 26.41 18.815 24.2275Z"
                    stroke="#FB3748"
                    stroke-width="3.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21.4816 51.8209L16.1309 48.9729C8.43069 44.8744 3.81566 36.6733 4.30863 27.9643C4.73943 20.3534 9.01672 13.486 15.6575 9.74304L19.964 7.31573C27.6938 2.95896 37.1843 3.16469 44.718 7.85232C51.1925 11.8809 55.3988 18.7166 56.077 26.3119L56.2942 28.745C57.0415 37.1143 53.3105 45.2555 46.483 50.1535C39.1443 55.4182 29.4544 56.0645 21.4816 51.8209Z"
                    fill="#FB3748"
                    fill-opacity="0.08"
                  />
                </svg>
              }
              title="منتجات تم رفضها"
              val={0}
              isLoading={isLoading}
              color="#FB3748"
            />
          </div>

          {/* Main Chart */}
          <div className="  grid grid-cols-3 gap-6">
            {" "}
            <div className=" col-span-1">
              <MostOrderedProducts data={data?.topRatedProducts || []} isLoading={isLoading} />
            </div>
            <Card className="p-6 h-full col-span-2  overflow-y-auto w-full">
              {isLoading ? (
                <SkeletonLoader className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "0.5rem", direction: "rtl", fontFamily: "inherit" }} />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
                    <Line
                      type="monotone"
                      name="اجمالي المنتجات"
                      dataKey="اجمالي المنتجات"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      name="منتجات في انتظار الموافقة"
                      dataKey="منتجات في انتظار الموافقة"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      name="منتجات تم رفضها"
                      dataKey="منتجات تم رفضها"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>
            {/* Most Ordered Products */}
          </div>
        </div>
      </div>
    </div>
  );
}
