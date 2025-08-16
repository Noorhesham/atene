import React, { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader } from "@/pages/admin/PageHeader";
import FilterPanel from "@/components/FilterPanel";
import { useAnalyticsQuery } from "@/hooks/useAnalyticsQuery";
import TopRatedStores from "./TopRatedStores";
import { Button } from "@/components/ui/button";
import PeriodSelector from "./PeriodSelector";
import Card from "@/components/Card";
import StatsCard from "./StatsCard";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

type Period = "current_year" | "current_month" | "last_month" | "current_week" | "last_week" | "current_day";

const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
);

export default function StoresAnalytics() {
  const [period, setPeriod] = useState<Period>("current_year");
  const { data, isLoading } = useAnalyticsQuery("stores", period);

  const chartData = useMemo(() => {
    return (
      data?.storesGrowthChart?.map((d: { date: string; total_count: string | number }) => ({
        date: d.date,
        count: Number(d.total_count) || 0,
      })) || []
    );
  }, [data]);

  const totals = {
    total: Number(data?.totalStores) || 0,
    active: Number(data?.totalActiveStores) || 0,
    notActive: Number(data?.totalNotActiveStores) || 0,
  };

  const navLinks = [
    { label: "ملخص المنصة", href: "/admin" },
    { label: "المتاجر", href: "/admin/analytics/stores", isActive: true },
    { label: "المنتجات", href: "/admin/analytics/products" },
  ];

  const topReportedStores = data?.topReportedStores || [];

  return (
    <div className="bg-gray-50 w-full min-h-screen" dir="rtl">
      {/* Header */}
      <PageHeader navLinks={navLinks} helpButton={{ label: "مساعدة", href: "#" }} />

      <div className="grid grid-cols-12 gap-4 p-4 sm:p-8">
        {/* Right panel: filters */}
        <div className="col-span-3">
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.label}
              style={{
                backgroundColor: link.isActive ? "rgba(91, 136, 186, 0.20)" : "transparent",
                opacity: link.isActive ? 1 : 0.5,
              }}
              to={link.href}
              className={`w-full text-right px-4 py-4  first:rounded-md text-sm font-medium flex justify-between items-center`}
            >
              <div className="flex items-center gap-2">
                <span className=" text-main">{link.label}</span>
              </div>
              {link.isActive && <ChevronLeft size={16} />}
            </Link>
          ))}
        </div>
        {/* Main content */}
        <div className="col-span-9 flex flex-col gap-4">
          <header className="flex px-8 items-center justify-between">
            <h1 className="text-xl gap-3 text-[#1E1E1E]  flex  items-start font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14.0001 9H18.0001M14.0001 12.5H17.0001"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.0001 3H7.00006C4.23864 3 2.00006 5.23858 2.00006 8V16C2.00006 18.7614 4.23864 21 7.00006 21H17.0001C19.7615 21 22.0001 18.7614 22.0001 16V8C22.0001 5.23858 19.7615 3 17.0001 3Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.00006 16C6.20806 13.419 10.7121 13.25 12.0001 16M10.5001 9C10.5001 9.53043 10.2893 10.0391 9.91427 10.4142C9.5392 10.7893 9.03049 11 8.50006 11C7.96963 11 7.46092 10.7893 7.08585 10.4142C6.71077 10.0391 6.50006 9.53043 6.50006 9C6.50006 8.46957 6.71077 7.96086 7.08585 7.58579C7.46092 7.21071 7.96963 7 8.50006 7C9.03049 7 9.5392 7.21071 9.91427 7.58579C10.2893 7.96086 10.5001 8.46957 10.5001 9Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              تحليل المتاجر
            </h1>
            <div className="flex items-center gap-2">
              {" "}
              <PeriodSelector period={period} setPeriod={setPeriod} />{" "}
            </div>
          </header>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                color="#406896"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.4499 26.725C17.1999 26.725 16.9499 26.675 16.6999 26.575C15.0363 25.8443 13.6223 24.6434 12.6319 23.12C11.6415 21.5966 11.1177 19.817 11.1249 18C11.1249 12.825 15.3249 8.625 20.4999 8.625C21.5249 8.625 22.3749 9.475 22.3749 10.5C22.3749 11.525 21.5249 12.375 20.4999 12.375C17.3999 12.375 14.8749 14.9 14.8749 18C14.8749 20.225 16.1749 22.25 18.1999 23.125C19.1499 23.55 19.5749 24.65 19.1749 25.6C18.8749 26.3 18.1749 26.725 17.4499 26.725ZM41.8249 25.6C42.0293 26.0528 42.4022 26.408 42.8644 26.5901C43.3267 26.7722 43.8417 26.7668 44.2999 26.575C46.265 25.7036 47.871 24.1836 48.8491 22.2695C49.8272 20.3554 50.118 18.1633 49.6728 16.0603C49.2276 13.9574 48.0735 12.0712 46.4036 10.7176C44.7337 9.36407 42.6495 8.62529 40.4999 8.625C39.4749 8.625 38.6249 9.475 38.6249 10.5C38.6249 11.525 39.4749 12.375 40.4999 12.375C43.5999 12.375 46.1249 14.9 46.1249 18C46.1249 20.225 44.8249 22.225 42.7999 23.125C41.8249 23.55 41.3999 24.65 41.8249 25.6ZM21.1249 20.5C21.1249 25.675 25.3249 29.875 30.4999 29.875C35.6749 29.875 39.8749 25.675 39.8749 20.5C39.8749 15.325 35.6749 11.125 30.4999 11.125C25.3249 11.125 21.1249 15.325 21.1249 20.5ZM24.8749 20.5C24.8749 17.4 27.3999 14.875 30.4999 14.875C33.5999 14.875 36.1249 17.4 36.1249 20.5C36.1249 23.6 33.5999 26.125 30.4999 26.125C27.3999 26.125 24.8749 23.6 24.8749 20.5ZM41.1999 52.375H19.7749C16.3749 52.375 13.6249 49.625 13.6249 46.225C13.6249 39.275 19.2749 33.625 26.2249 33.625H34.7999C41.7499 33.625 47.3999 39.275 47.3999 46.225C47.3999 49.625 44.6249 52.375 41.2499 52.375H41.1999ZM26.1999 37.375C21.3249 37.375 17.3499 41.35 17.3499 46.225C17.3499 47.55 18.4249 48.625 19.7499 48.625H41.1749C42.4999 48.625 43.5749 47.55 43.5749 46.225C43.5749 41.35 39.5999 37.375 34.7249 37.375H26.1999ZM49.3274 48C49.3274 49.025 50.1774 49.875 51.2024 49.875C54.5774 49.875 57.3524 47.125 57.3524 43.725C57.3524 36.775 51.7024 31.125 44.7524 31.125C43.7274 31.125 42.8774 31.975 42.8774 33C42.8774 34.025 43.7274 34.875 44.7524 34.875C49.6274 34.875 53.6024 38.85 53.6024 43.725C53.6024 45.05 52.5274 46.125 51.2024 46.125C50.1774 46.125 49.3274 46.975 49.3274 48ZM3.62494 43.725C3.62494 47.125 6.37494 49.875 9.77494 49.875C10.7999 49.875 11.6499 49.025 11.6499 48C11.6499 46.975 10.7999 46.125 9.77494 46.125C9.13842 46.125 8.52797 45.8721 8.07788 45.4221C7.6278 44.972 7.37494 44.3615 7.37494 43.725C7.37494 38.85 11.3499 34.875 16.2249 34.875C17.2499 49.875 18.0999 49.025 18.0999 48C18.0999 46.975 17.2499 46.125 16.2249 46.125C9.27494 46.125 3.62494 41.35 3.62494 43.725Z"
                      fill="#2D496A"
                      fillOpacity="0.8"
                    />
                    <path
                      d="M12.1667 51.0001H50.6667L55.1667 45.5001V37.0001L42.6667 32.0001V27.5001L47.1667 20.0001V14.0001C46.0001 13.8335 42.7667 12.8001 39.1667 10.0001C35.5667 7.20013 21.3334 8.83346 14.6667 10.0001L12.1667 24.0001L14.6667 34.0001L1.66675 45.5001L12.1667 51.0001Z"
                      fill="#406896"
                      fillOpacity="0.2"
                    />
                  </svg>
                }
                title="اجمالي التجار"
                val={totals.total}
                isLoading={isLoading}
              />
              <StatsCard
                color="#DFB400"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61" fill="none">
                    <path
                      d="M19 54.5H40H46H49.5H52V52.5L53.5 50V44C39.9312 35.8331 38.9837 32.6082 38 27L39 24.5L40 17.5L38 12.5L29.5 7H23L19 17.5V23.5L23 27L6.5 50V52.5L19 54.5Z"
                      fill="#DFB400"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M31.7499 55.5H16.9749C13.1124 55.5 10.0399 53.62 7.2824 50.9925C1.6324 45.61 10.9074 41.31 14.4449 39.205C20.03 35.9041 26.6273 34.7539 32.9999 35.97M47.2274 36.945L48.9874 40.495C49.1367 40.761 49.3403 40.9926 49.5849 41.1748C49.8296 41.357 50.1098 41.4857 50.4074 41.5525L53.5974 42.085C55.6374 42.4275 56.1174 43.92 54.6474 45.3925L52.1674 47.8925C51.95 48.1386 51.7905 48.4303 51.7005 48.746C51.6105 49.0618 51.5924 49.3938 51.6474 49.7175L52.3574 52.8125C52.9174 55.2625 51.6274 56.21 49.4774 54.93L46.4874 53.145C46.1815 52.9863 45.842 52.9035 45.4974 52.9035C45.1528 52.9035 44.8133 52.9863 44.5074 53.145L41.5174 54.93C39.3774 56.21 38.0774 55.2525 38.6374 52.8125L39.3474 49.7175C39.4024 49.3938 39.3843 49.0618 39.2943 48.746C39.2043 48.4303 39.0448 48.1386 38.8274 47.8925L36.3474 45.3925C34.8899 43.92 35.3599 42.4275 37.3974 42.085L40.5874 41.5525C40.8834 41.4841 41.1618 41.3544 41.4047 41.1719C41.6475 40.9893 41.8495 40.7579 41.9974 40.4925L43.7574 36.9425C44.7174 35.0175 46.2774 35.0175 47.2274 36.9425M39.2499 16.75C39.2499 18.2274 38.9589 19.6903 38.3935 21.0552C37.8282 22.4201 36.9995 23.6603 35.9549 24.705C34.9102 25.7496 33.67 26.5783 32.3051 27.1436C30.9402 27.709 29.4773 28 27.9999 28C26.5225 28 25.0596 27.709 23.6947 27.1436C22.3298 26.5783 21.0896 25.7496 20.045 24.705C19.0003 23.6603 18.1716 22.4201 17.6063 21.0552C17.0409 19.6903 16.7499 18.2274 16.7499 16.75C16.7499 13.7663 17.9352 10.9048 20.045 8.79505C22.1547 6.68526 25.0162 5.5 27.9999 5.5C30.9836 5.5 33.8451 6.68526 35.9549 8.79505C38.0646 10.9048 39.2499 13.7663 39.2499 16.75Z"
                      stroke="#DFB400"
                      strokeWidth="3.9633"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                title="التجار الموثوقين"
                val={totals.active}
                isLoading={isLoading}
              />

              <StatsCard
                color="#FB3748"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="61" height="60" viewBox="0 0 61 60" fill="none">
                    <path
                      d="M32.9999 55H16.9749C13.1124 55 10.0399 53.12 7.2824 50.4925C1.6324 45.11 10.9074 40.81 14.4449 38.705C20.4106 35.1813 27.5134 34.117 34.2499 35.7375M40.6249 40.125L52.8749 52.375M41.7499 16.25C41.7499 19.2337 40.5646 22.0952 38.4549 24.205C36.3451 26.3147 33.4836 27.5 30.4999 27.5C27.5162 27.5 24.6547 26.3147 22.545 24.205C20.4352 22.0952 19.2499 19.2337 19.2499 16.25C19.2499 13.2663 20.4352 10.4048 22.545 8.29505C24.6547 6.18526 27.5162 5 30.4999 5C33.4836 5 36.3451 6.18526 38.4549 8.29505C40.5646 10.4048 41.7499 13.2663 41.7499 16.25ZM55.4999 46.25C55.4999 43.9294 54.578 41.7038 52.9371 40.0628C51.2961 38.4219 49.0705 37.5 46.7499 37.5C44.4293 37.5 42.2037 38.4219 40.5627 40.0628C38.9218 41.7038 37.9999 43.9294 37.9999 46.25C37.9999 48.5706 38.9218 50.7962 40.5627 52.4372C42.2037 54.0781 44.4293 55 46.7499 55C49.0705 55 51.2961 54.0781 52.9371 52.4372C54.578 50.7962 55.4999 48.5706 55.4999 46.25Z"
                      stroke="#FB3748"
                      strokeWidth="3.9633"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      opacity="0.28"
                      d="M34.8333 57H18.8083C14.9458 57 11.8733 55.12 9.11578 52.4925C3.46578 47.11 12.7408 42.81 16.2783 40.705C22.244 37.1813 29.3468 36.117 36.0833 37.7375M43.5833 18.25C43.5833 21.2337 42.398 24.0952 40.2882 26.205C38.1784 28.3147 35.317 29.5 32.3333 29.5C29.3496 29.5 26.4881 28.3147 24.3783 26.205C22.2685 24.0952 21.0833 21.2337 21.0833 18.25C21.0833 15.2663 22.2685 12.4048 24.3783 10.295C26.4881 8.18526 29.3496 7 32.3333 7C35.317 7 38.1784 8.18526 40.2882 10.295C42.398 12.4048 43.5833 15.2663 43.5833 18.25ZM42.4583 42.125L54.7083 54.375L42.4583 42.125ZM57.3333 48.25C57.3333 45.9294 56.4114 43.7038 54.7705 42.0628C53.1295 40.4219 50.9039 39.5 48.5833 39.5C46.2626 39.5 44.037 39.5 42.3961 42.0628C40.7551 43.7038 39.8333 45.9294 39.8333 48.25C39.8333 50.5706 40.7551 52.7962 42.3961 54.4372C44.037 56.0781 46.2626 57 48.5833 57C50.9039 57 53.1295 56.0781 54.7705 54.4372C56.4114 52.7962 57.3333 50.5706 57.3333 48.25Z"
                      fill="#FB3748"
                    />
                  </svg>
                }
                title="التجار الموثوقين"
                val={totals.active}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Lists */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <TopRatedStores data={data?.topRatedStores || []} isLoading={isLoading} />
            </div>
            <div className="space-y-6  col-span-2">
              <div className="h-full col-span-2">
                {isLoading ? (
                  <SkeletonLoader className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip contentStyle={{ direction: "rtl" }} />
                      <Line type="monotone" dataKey="count" stroke="#406896" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              <p className="text-center text-[11px] text-gray-400">متاجر الايام الماضية</p>
            </div>
          </div>
          <div className=" grid gap-3 mt-10 grid-cols-3">
            {" "}
            <Card className="p-0 col-span-2 ">
              <div className="flex gap-2 items-center p-6 pb-3">
                <h3 className="font-bold text-gray-800">المتاجر الأعلي عدد طلبات</h3>
              </div>
              <div className="overflow-auto max-h-96  ">
                <table className="w-full text-sm text-right">
                  <thead>
                    <tr className="text-gray-500">
                      {["المتجر", "اجمالي الطلبات", "المكتملة", "المرفوضة"].map((h) => (
                        <th key={h} className="font-semibold p-3 px-6">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.mostOrderedStores || []).map(
                      (s: {
                        id: number;
                        name: string;
                        orders_count: number | null;
                        completed_orders_count: number | null;
                        canceled_orders_count: number | null;
                      }) => (
                        <tr key={s.id} className="border-t border-input text-black text-[12px] font-[500]">
                          <td className="p-3 px-6 font-medium text-black">{s.name}</td>
                          <td className="p-3 px-6">{s.orders_count ?? 0}</td>
                          <td className="p-3 px-6">{s.completed_orders_count ?? 0}</td>
                          <td className="p-3 px-6">{s.canceled_orders_count ?? 0}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card className="p-0  col-span-1 ">
              <div className=" flex items-center gap-2  flex gap-2 items-center p-6 pb-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7.00004V21M11.758 3.90904C8.452 2.22504 5.851 3.21104 4.554 4.21904C4.32 4.40104 4.204 4.49204 4.102 4.69904C4 4.90904 4 5.10204 4 5.49004V14.733C4.97 13.635 7.879 11.933 11.758 13.91C15.224 15.675 18.174 14.943 19.57 14.18C19.763 14.075 19.86 14.022 19.93 13.904C20 13.786 20 13.658 20 13.402V5.87404C20 5.04504 20 4.63104 19.803 4.48104C19.605 4.33104 19.143 4.45904 18.22 4.71504C16.64 5.15304 14.342 5.22504 11.758 3.90904Z"
                    stroke="#FB3748"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3 className=" font-semibold">التجار الاعلي عدد بلاغات</h3>
              </div>
              <div className="flex overflow-y-auto max-h-96 gap-4 px-6  flex-col">
                {" "}
                {topReportedStores.map(
                  (store: { id: number; name: string; logo_url: string; reports_count: number }, index: number) => (
                    <div key={store.id} className="flex items-center justify-between relative z-10">
                      {/* Left Side: Rank */}
                      <div className="text-base font-bold text-gray-400">{index + 1}</div>

                      {/* Right Side: Store Info */}
                      <div className="flex items-center gap-3 flex-grow justify-start">
                        {" "}
                        <img src={store.logo_url} alt={store.name} className="w-8 h-8 rounded-full object-cover" />
                        <div className="text-right">
                          <h4 className="font-normal text-lg text-gray-900">{store.name}</h4>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-[#777]">عدد البلاغات</p>{" "}
                            <div className="w-24 flex justify-start">
                              <span
                                className={`px-3 py-0.5 text-sm font-semibold rounded-full
                      ${index === 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
                              >
                                {store.reports_count} بلاغ
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Badge */}
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
