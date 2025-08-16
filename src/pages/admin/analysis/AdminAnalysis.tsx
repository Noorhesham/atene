import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
} from "recharts";
// Local type for Pie label render props to avoid depending on internal recharts types
type PieLabelData = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  payload?: { name?: string };
};
import { ArrowUpDown } from "lucide-react";
import { useAnalyticsQuery } from "@/hooks/useAnalyticsQuery";
import TopRatedStores from "./TopRatedStores";
import { PageHeader } from "../PageHeader";
import PeriodSelector from "./PeriodSelector";
export const StatRow = ({
  title,
  value,
  subLabel,
  subValue,
  textColor,
  isLoading,
  label,
}: {
  title: string;
  value: number;
  subLabel: string;
  subValue: number;
  textColor: string;
  isLoading: boolean;
  label: string;
}) => (
  <div className="text-right">
    <p className="text-[#8E8C84] text-lg font-normal">{title}</p>
    <p className={`text-lg font-semibold my-1 ${textColor || "text-black"}`}>
      {isLoading ? "..." : value} {label}
    </p>
    <div className="flex bg-[#F5F5F5] py-1 px-2 rounded-full w-fit items-center justify-start gap-1">
      <span className="text-[#777] text-[10px] font-normal">{subLabel}</span>
      <span className={`text-[9px] font-medium ${textColor || "text-black"}`}>
        {isLoading ? "..." : subValue} {label}
      </span>
    </div>
  </div>
);

type Period =
  | "current_day"
  | "last_day"
  | "current_week"
  | "last_week"
  | "current_month"
  | "last_month"
  | "current_year"
  | "last_year";

const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
);



const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm ${className}`}>{children}</div>
);

const ContentAnalytics = () => {
  const [period, setPeriod] = useState<Period>("current_month");
  const { data, isLoading } = useAnalyticsQuery("content", period);

  const StatCard = ({
    title,
    value,
    icon,
    bgColor,
    textColor,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
  }) => (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${bgColor}`}>{icon}</div>
      <div>
        <p className="font-semibold text-black text-base">{title}</p>
        <p className={`text-[18px] font-bold ${textColor}`}>{isLoading ? "..." : value}</p>
      </div>
    </div>
  );

  const chartData = useMemo(() => data?.storesGrowthChart || [], [data]);
  const completedOrders = data?.totalCompletedOrders || 0;
  const canceledOrders = data?.totalCanceledOrders || 0;
  const totalOrders = completedOrders + canceledOrders;
  const completedPercentage = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
  const canceledPercentage = totalOrders > 0 ? (canceledOrders / totalOrders) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path
              d="M18 18.7441C20.2091 18.7441 22 15.1624 22 10.7441C22 6.32586 20.2091 2.74414 18 2.74414C15.7909 2.74414 14 6.32586 14 10.7441C14 15.1624 15.7909 18.7441 18 18.7441Z"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18 2.74414C14.897 2.74414 8.465 5.12214 4.771 6.59814C3.079 7.27414 2 8.92214 2 10.7441C2 12.5661 3.08 14.2141 4.771 14.8901C8.465 16.3661 14.897 18.7441 18 18.7441M11 22.7441L9.057 21.6741C8.01968 21.1001 7.17826 20.2282 6.64136 19.1712C6.10446 18.1141 5.89674 16.9204 6.045 15.7441"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>{" "}
          إحصائيات المنصة
        </h2>
        <PeriodSelector period={period} setPeriod={setPeriod} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Stats */}
        <div className="space-y-6">
          <StatCard
            title="إجمالي التجار"
            value={data?.totalMerchants || 0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                <path
                  d="M1.5 13.6592L2.06 12.6792C2.4973 11.9136 3.12926 11.2773 3.8918 10.8347C4.65434 10.3922 5.52034 10.1591 6.402 10.1592H9.598C10.4797 10.1591 11.3457 10.3922 12.1082 10.8347C12.8707 11.2773 13.5027 11.9136 13.94 12.6792L14.5 13.6592M10.75 4.15918C10.75 4.88853 10.4603 5.588 9.94454 6.10372C9.42882 6.61945 8.72935 6.90918 8 6.90918C7.27065 6.90918 6.57118 6.61945 6.05546 6.10372C5.53973 5.588 5.25 4.88853 5.25 4.15918C5.25 3.42983 5.53973 2.73036 6.05546 2.21464C6.57118 1.69891 7.27065 1.40918 8 1.40918C8.72935 1.40918 9.42882 1.69891 9.94454 2.21464C10.4603 2.73036 10.75 3.42983 10.75 4.15918Z"
                  stroke="#406896"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
            bgColor="bg-gray-100"
            textColor="text-gray-800"
          />{" "}
          <StatCard
            title=" اجمالي المنتجات "
            value={data?.totalProducts || 0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                <path
                  d="M12.0908 22.6592C11.2728 22.6592 10.4908 22.3292 8.92782 21.6692C5.03682 20.0252 3.09082 19.2022 3.09082 17.8192V7.65918M12.0908 22.6592C12.9088 22.6592 13.6908 22.3292 15.2538 21.6692C19.1448 20.0252 21.0908 19.2022 21.0908 17.8192V7.65918M12.0908 22.6592V12.0142M6.09082 12.6592L8.09082 13.6592M17.0908 4.65918L7.09082 9.65918M8.41682 10.3502L5.49582 8.93718C3.89282 8.16118 3.09082 7.77318 3.09082 7.15918C3.09082 6.54518 3.89282 6.15718 5.49582 5.38118L8.41582 3.96818C10.2208 3.09518 11.1208 2.65918 12.0908 2.65918C13.0608 2.65918 13.9618 3.09518 15.7648 3.96818L18.6858 5.38118C20.2888 6.15718 21.0908 6.54518 21.0908 7.15918C21.0908 7.77318 20.2888 8.16118 18.6858 8.93718L15.7658 10.3502C13.9608 11.2232 13.0608 11.6592 12.0908 11.6592C11.1208 11.6592 10.2198 11.2232 8.41682 10.3502Z"
                  stroke="#555555"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
            bgColor="bg-[#E8E8E8]"
            textColor="text-[#1FC16B]"
          />
        </div>

        {/* Column 2: Stats & Progress */}
        <div className="space-y-6">
          <StatCard
            title="إجمالي المتاجر"
            value={data?.totalStores || 0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path
                  d="M3.5 10.9795V15.4855C3.5 18.3185 3.5 19.7345 4.379 20.6145C5.257 21.4945 6.672 21.4945 9.5 21.4945H15.5C18.328 21.4945 19.743 21.4945 20.621 20.6145C21.499 19.7345 21.5 18.3185 21.5 15.4855V10.9795M7.5 17.9665H11.5"
                  stroke="#1FC16B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.2961 2.49278L6.65009 2.52278C4.91209 2.43278 4.46609 3.77178 4.46609 4.42578C4.46609 5.01078 4.39109 5.86378 3.32609 7.46778C2.26009 9.07078 2.34009 9.54778 2.94109 10.6578C3.43909 11.5778 4.70709 11.9378 5.36909 11.9988C7.46909 12.0468 8.49109 10.2328 8.49109 8.95778C9.53309 12.1608 12.4961 12.1608 13.8161 11.7948C15.1381 11.4278 16.2721 10.1148 16.5391 8.95778C16.6951 10.3948 17.1691 11.2338 18.5661 11.8098C20.0151 12.4068 21.2601 11.4948 21.8851 10.9098C22.5101 10.3248 22.9111 9.02678 21.7971 7.59978C21.0291 6.61578 20.7081 5.68778 20.6031 4.72778C20.5431 4.17078 20.4891 3.57278 20.0971 3.19178C19.5251 2.63578 18.7031 2.46678 18.2961 2.49278Z"
                  stroke="#1FC16B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
            bgColor="bg-[#1fc16b1a]"
            textColor="text-[#1FC16B]"
          />
          <StatCard
            title=" متاجر تحتاج لموافقة"
            value={data?.notActiveStores || 0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path
                  d="M15.471 7.49316C15.471 7.49316 15.971 7.49316 16.471 8.49316C16.471 8.49316 18.06 5.99316 19.471 5.49316M19.496 15.0352L19.524 19.5852C19.4994 20.2326 19.2248 20.8452 18.7578 21.2943C18.2908 21.7434 17.6679 21.9939 17.02 21.9932H5.89303C5.56433 21.9937 5.23874 21.9295 4.93487 21.8042C4.63099 21.6789 4.35476 21.4949 4.12197 21.2629C3.88917 21.0308 3.70436 20.7552 3.57809 20.4517C3.45181 20.1482 3.38655 19.8229 3.38603 19.4942L3.47203 13.0282M9.48203 6.00616L5.64803 5.94216C5.21531 5.9312 4.79067 6.06057 4.43757 6.31093C4.08447 6.56129 3.82187 6.9192 3.68903 7.33116L2.59203 10.7472C2.46203 11.1512 2.45303 11.5922 2.66903 11.9582C3.45403 13.2922 5.56403 15.1122 8.91703 13.1562M7.94603 11.3262C8.33603 12.5942 9.86603 14.8192 12.986 13.5302"
                  stroke="#D00416"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M22.5001 7.00916C22.5009 7.66734 22.372 8.31922 22.1207 8.92756C21.8695 9.5359 21.5009 10.0888 21.0359 10.5546C20.5709 11.0204 20.0187 11.39 19.4108 11.6424C18.8029 11.8947 18.1513 12.0248 17.4931 12.0252C16.8349 12.0248 16.1833 11.8947 15.5754 11.6424C14.9675 11.39 14.4153 11.0204 13.9503 10.5546C13.4853 10.0888 13.1167 9.5359 12.8654 8.92756C12.6142 8.31922 12.4853 7.66734 12.4861 7.00916C12.4853 6.35099 12.6142 5.69911 12.8654 5.09077C13.1167 4.48243 13.4853 3.92956 13.9503 3.46374C14.4153 2.99792 14.9675 2.62829 15.5754 2.37596C16.1833 2.12363 16.8349 1.99356 17.4931 1.99316C18.1513 1.99356 18.8029 2.12363 19.4108 2.37596C20.0187 2.62829 20.5709 2.99792 21.0359 3.46374C21.5009 3.92956 21.8695 4.48243 22.1207 5.09077C22.372 5.69911 22.5009 6.35099 22.5001 7.00916Z"
                  stroke="#D00416"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
            bgColor="bg-[#fb77791a]"
            textColor="text-[#D00416]"
          />
        </div>

        {/* Column 3: Stats & Progress */}
        <div className="space-y-6">
          <StatCard
            title="منتجات تحتاج لموافقة"
            value={data?.notActiveProducts || 0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                <path
                  d="M8.59082 16.6592H15.8538C20.3418 16.6592 21.0238 13.8392 21.8518 9.72918C22.0908 8.54218 22.2098 7.94918 21.9228 7.55418C21.6358 7.15918 21.0858 7.15918 19.9848 7.15918H6.59082"
                  stroke="#DFB400"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.59082 16.6592L5.96982 4.17418C5.86167 3.7415 5.612 3.35739 5.26049 3.08288C4.90898 2.80838 4.47581 2.65925 4.02982 2.65918H3.09082M9.47082 16.6592H9.05982C7.69582 16.6592 6.59082 17.8102 6.59082 19.2302C6.58963 19.2853 6.59931 19.3402 6.61932 19.3916C6.63933 19.443 6.66928 19.49 6.70744 19.5298C6.74561 19.5697 6.79125 19.6016 6.84176 19.6238C6.89227 19.646 6.94666 19.658 7.00182 19.6592H18.0908"
                  stroke="#DFB400"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.0908 22.6592C11.9192 22.6592 12.5908 21.9876 12.5908 21.1592C12.5908 20.3308 11.9192 19.6592 11.0908 19.6592C10.2624 19.6592 9.59082 20.3308 9.59082 21.1592C9.59082 21.9876 10.2624 22.6592 11.0908 22.6592Z"
                  stroke="#DFB400"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.0908 22.6592C18.9192 22.6592 19.5908 21.9876 19.5908 21.1592C19.5908 20.3308 18.9192 19.6592 18.0908 19.6592C17.2624 19.6592 16.5908 20.3308 16.5908 21.1592C16.5908 21.9876 17.2624 22.6592 18.0908 22.6592Z"
                  stroke="#DFB400"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
            bgColor="bg-[#ffdb431a]"
            textColor="text-[#DFB400]"
          />
          <div className="opacity-0">
            {" "}
            {/* Placeholder for alignment */}
            <StatCard title="" value={0} icon={<div />} bgColor="" textColor="" />
          </div>
        </div>
      </div>
      <div className="flex my-5 flex-col gap-4 w-full">
        <h2 className="text-sm font-bold text-gray-800">الطلبات ( {completedOrders + canceledOrders} )</h2>
        <div className="grid w-full gap-4 grid-cols-2">
          {" "}
          <div className=" w-full">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>طلبات مكتملة ({completedOrders})</span>
              <span className="text-green-500">{Math.round(completedPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${completedPercentage}%` }}></div>
            </div>
          </div>{" "}
          <div className=" w-full">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>طلبات مرفوضة ({canceledOrders})</span>
              <span className="text-red-500">{Math.round(canceledPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${canceledPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Chart */}
      <div className="h-64 mt-8">
        {isLoading ? (
          <SkeletonLoader className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 6]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "0.5rem", direction: "rtl", fontFamily: "inherit" }}
                labelStyle={{ fontWeight: "bold" }}
                formatter={(value, name, props) => [`${value} تجار`, `بتاريخ ${props.payload.date}`]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#406896"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

const ProductsAnalytics = () => {
  const { data, isLoading } = useAnalyticsQuery("analytics", "current_month");

  // Compact 7-bar chart like the screenshot
  const chartData = useMemo(
    () => [
      { day: "1", count: 12 },
      { day: "2", count: 15 },
      { day: "3", count: 13 },
      { day: "4", count: 8 },
      { day: "5", count: 12 },
      { day: "6", count: 9 },
      { day: "7", count: 14 },
    ],
    []
  );

  return (
    <Card className="p-6 my-4">
      <div className="flex items-start justify-between">
        {/* Right Side: Stats */}
        <div className="flex-grow">
          <div className="text-right mb-4">
            <p className="text-sm text-[#9291A5]">احصائيات</p>
            <h3 className="font-bold text-[#202020] text-sm">
              المنتجات ({isLoading ? "..." : data?.totalProducts || 0})
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
              <StatRow
                isLoading={isLoading}
                label="منتج"
                textColor="text-main"
                title="منتجات الشهر"
                value={data?.totalProductsThisMonth || 0}
                subLabel="الشهر الماضي"
                subValue={data?.totalProductsLastMonth || 0}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <StatRow
                isLoading={isLoading}
                label="منتج"
                title="منتجات اليوم"
                value={data?.totalProductsThisDay || 0}
                subLabel="منتجات الامس"
                subValue={data?.totalProductsYesterday || 0}
              />
              <StatRow
                isLoading={isLoading}
                label="منتج"
                title="جميع المنتجات"
                value={data?.totalProducts || 0}
                subLabel="هذه السنة"
                subValue={data?.totalProductsThisYear || 0}
              />
            </div>
          </div>
        </div>

        {/* Left Side: Bar Chart */}
        <div className="w-1/3 h-32 pl-4">
          {isLoading ? (
            <SkeletonLoader className="h-full w-full" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Bar dataKey="count" fill="#406896" radius={[2, 2, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center text-[11px] text-gray-400 mt-1">منتجات الايام الماضية</p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
// Types used in multiple widgets
type CustomersMap = Record<string, number>;
type CustomerOriginItem = { country: string; count: number; percentage: number; color: string };
type LatestProductItem = { id: number; status: string; name: string };
type RecentReportItem = {
  id: number;
  type: string;
  status: string;
  store: string | null;
  product: string;
  user: string;
  store_id: number | null;
  product_id: number;
  user_id: number;
  content: string;
  media: string | null;
};

const CustomersAnalytics = () => {
  const [period, setPeriod] = useState<Period>("current_month");
  const { data, isLoading } = useAnalyticsQuery("customers", period);
  const chartData = useMemo(() => {
    const customers = (data?.customers ?? {}) as CustomersMap;
    return Object.entries(customers).map(([customerName, rawValue]) => {
      const value = Number(rawValue) || 0;
      return {
        name: customerName,
        total: value,
        part1: value * 0.4,
        part2: value * 0.3,
        part3: value * 0.2,
        part4: value * 0.1,
      };
    });
  }, [data]);
  const totalCustomers = useMemo(() => {
    const customers = (data?.customers ?? {}) as CustomersMap;
    return Object.values(customers).reduce((sum: number, val) => sum + Number(val || 0), 0);
  }, [data]);
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <p className="text-[14.753px] font-[400] text-[#9291A5]">احصائيات</p>
          <h2 className="font-bold text-gray-800 text-[14.753px]">العملاء ({isLoading ? "..." : totalCustomers})</h2>
        </div>
        <PeriodSelector period={period} setPeriod={setPeriod} />
      </div>
      <div className="h-40">
        {isLoading ? (
          <SkeletonLoader className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 4]} ticks={[0, 10, 20]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "rgba(243, 244, 246, 0.5)" }} contentStyle={{ display: "none" }} />
              <Bar dataKey="part1" stackId="a" fill="#E0E7FF" barSize={20} radius={[4, 4, 0, 0]} />
              <Bar dataKey="part2" stackId="a" fill="#C7D2FE" barSize={20} />
              <Bar dataKey="part3" stackId="a" fill="#A5B4FC" barSize={20} />
              <Bar dataKey="part4" stackId="a" fill="#6366F1" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

const LatestProducts = ({ data, isLoading }: { data: LatestProductItem[]; isLoading: boolean }) => {
  const getStatusChip = (status: string) => {
    if (status === "active")
      return (
        <span className="text-xs font-semibold w-fit flex gap-2 text-green-600 bg-green-100 px-2 py-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <g clip-path="url(#clip0_1808_89063)">
              <mask
                id="mask0_1808_89063"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="12"
                height="13"
              >
                <path
                  d="M6.2002 11.5C6.85693 11.5008 7.50734 11.3719 8.11408 11.1205C8.72081 10.8692 9.27191 10.5005 9.7357 10.0355C10.2007 9.57171 10.5694 9.02062 10.8207 8.41388C11.072 7.80715 11.201 7.15673 11.2002 6.5C11.201 5.84328 11.072 5.19286 10.8207 4.58613C10.5694 3.97939 10.2007 3.4283 9.7357 2.9645C9.27191 2.49954 8.72081 2.13081 8.11408 1.87948C7.50734 1.62816 6.85693 1.49919 6.2002 1.5C5.54347 1.49919 4.89306 1.62816 4.28632 1.87948C3.67959 2.13081 3.12849 2.49954 2.6647 2.9645C2.19974 3.4283 1.831 3.97939 1.57968 4.58613C1.32835 5.19286 1.19939 5.84328 1.2002 6.5C1.19939 7.15673 1.32835 7.80715 1.57968 8.41388C1.831 9.02062 2.19974 9.57171 2.6647 10.0355C3.12849 10.5005 3.67959 10.8692 4.28632 11.1205C4.89306 11.3719 5.54347 11.5008 6.2002 11.5Z"
                  fill="white"
                  stroke="white"
                  stroke-width="1.33333"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.2002 6.5L5.7002 8L8.7002 5"
                  stroke="black"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </mask>
              <g mask="url(#mask0_1808_89063)">
                <path d="M-0.667969 0.5H12.6654V12.5H-0.667969V0.5Z" fill="#15803D" />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_1808_89063">
                <rect width="12" height="12" fill="white" transform="translate(0.200195 0.5)" />
              </clipPath>
            </defs>
          </svg>
          تم الموافقة
        </span>
      );
    else if (status === "not-active")
      return (
        <span className="text-xs font-semibold w-fit text-red-600 flex gap-2  bg-red-100 px-2 py-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.1422 2.55806C10.3862 2.80214 10.3862 3.19787 10.1422 3.44194L3.14214 10.442C2.89806 10.686 2.50233 10.686 2.25826 10.442C2.01418 10.1979 2.01418 9.80211 2.25826 9.55806L9.25826 2.55806C9.50236 2.31398 9.89806 2.31398 10.1422 2.55806Z"
              fill="#D00416"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.25826 2.55806C2.50233 2.31398 2.89806 2.31398 3.14214 2.55806L10.1422 9.55806C10.3862 9.80211 10.3862 10.1979 10.1422 10.442C9.89806 10.686 9.50236 10.686 9.25826 10.442L2.25826 3.44194C2.01418 3.19787 2.01418 2.80214 2.25826 2.55806Z"
              fill="#D00416"
            />
          </svg>
          مرفوض
        </span>
      );
    else
      return (
        <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">قيد الانتظار</span>
      );
  };
  return (
    <Card className="p-0 w-full max-h-96 overflow-y-auto lg:col-span-2">
      <div className="flex w-fit gap-2 py-5 px-6    items-start mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M13.0261 21.948C12.6888 21.9824 12.3464 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.6849 21.9311 13.3538 21.8 14"
            stroke="#141B34"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 8V12L13.5 13.5"
            stroke="#141B34"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M21.9504 18.407C22.0165 18.4457 22.0166 18.5423 21.9505 18.5811L16.1493 21.9861C16.0707 22.0322 15.9774 21.9562 16.0049 21.8686L17.0661 18.494L16.005 15.1315C15.9774 15.044 16.0706 14.9679 16.1492 15.0138L21.9504 18.407Z"
            stroke="#141B34"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
        <h3 className="font-bold text-gray-800">أحدث المنتجات (20)</h3>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <SkeletonLoader className="h-48 m-6" />
        ) : (
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="text-gray-500">
                {["رقم المنتج", "حالة الطلب", "التاجر", "تاريخ الإنشاء"].map((h) => (
                  <th key={h} className="font-semibold p-3 px-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((p: LatestProductItem) => (
                <tr key={p.id} className="border-t border-input text-black text-[12px] font-[500]">
                  <td className="p-3 px-6 font-medium text-black underline">#{p.id}</td>
                  <td className="p-3 px-6">{getStatusChip(p.status)}</td>
                  <td className="p-3 px-6">{p.name}</td>
                  <td className="p-3 px-6">4/2/2025 - 05:00PM</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
};

const RecentReports = ({ data, isLoading }: { data: RecentReportItem[]; isLoading: boolean }) => {
  const getStatusChip = (status: string) => {
    if (status === "processing")
      return (
        <span className="text-xs font-semibold text-[#4A4A4A] bg-[#F1F5F9] px-2 py-1 rounded-full">
          بانتظار رد العميل{" "}
        </span>
      );
    if (status === "resolved")
      return <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">تم الحل</span>;
    if (status === "rejected")
      return <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">مرفوض</span>;
    return <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{status}</span>;
  };

  return (
    <Card className="p-0">
      <div className="flex gap-2 items-center p-6 pb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 15C8.46574 15.621 9.06966 16.125 9.76393 16.4721C10.4582 16.8193 11.2238 17 12 17C12.7762 17 13.5418 16.8193 14.2361 16.4721C14.9303 16.125 15.5343 15.621 16 15M8.009 9H8M16 9H15.991"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h3 className="font-bold text-gray-800">الشكاوي ({data?.length || 0})</h3>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <SkeletonLoader className="h-32 m-6" />
        ) : (
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="text-black px-5 bg-[#FAFAFA]">
                {["رقم الشكوي", "نوع الشكوي", "المنتج", "المستخدم", "الحالة"].map((h) => (
                  <th key={h} className="font-semibold p-3 px-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r: RecentReportItem) => (
                <tr key={r.id} className="border-t border-input text-black text-[12px] font-[500]">
                  <td className="p-3 px-6 font-medium text-black underline">#{r.id}</td>
                  <td className="p-3 px-6">{r.type}</td>
                  <td className="p-3 px-6">{r.product}</td>
                  <td className="p-3 px-6">{r.user}</td>
                  <td className="p-3 px-6">{getStatusChip(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
};

const StoresAnalytics = () => {
  // Using 'analytics' endpoint which provides all the necessary data directly
  const { data, isLoading } = useAnalyticsQuery("analytics", "current_year");

  // The chart data should ideally come from the API, like 'lastDaysStores'
  const chartData = useMemo(
    () => [
      { day: "Day 1", count: 0 },
      { day: "Day 2", count: 0 },
      { day: "Day 3", count: 0 },
      { day: "Day 4", count: 0 },
      { day: "Day 5", count: 0 },
      { day: "Day 6", count: 3 },
      { day: "Day 7", count: 0 },
    ],
    []
  );

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="text-right">
          <p className="text-sm text-[#9291A5] font-normal">احصائيات</p>
          <h3 className="font-bold text-[#202020] text-sm">المتاجر ({isLoading ? "..." : data?.totalStores || 0})</h3>
        </div>
        {/* The small line chart for the past days */}
      </div>

      {/* Stats Section */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <StatRow
            isLoading={isLoading}
            label="متجر"
            textColor="text-main"
            title="متاجر الشهر"
            value={data?.totalStoresThisMonth || 0}
            subLabel="الشهر الماضي"
            subValue={data?.totalStoresLastMonth || 0}
          />{" "}
          <div className=" h-16">
            {isLoading ? (
              <SkeletonLoader className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" hide />
                  <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#5B87B9"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#406896", strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            <p className="text-center text-[10px] text-gray-400 mt-1">متاجر الايام الماضية</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatRow
          isLoading={isLoading}
          label="متجر"
          title="متاجر اليوم"
          value={data?.totalStoresThisDay || 0}
          subLabel="متاجر الامس"
          subValue={data?.totalStoresYesterday || 0}
        />
        <StatRow
          isLoading={isLoading}
          label="متجر"
          title="جميع المتاجر"
          value={data?.totalStores || 0}
          subLabel="هذه السنة"
          subValue={data?.totalStoresThisYear || 0}
        />
        {/* Empty div for layout alignment */}
        <div></div>
      </div>
    </Card>
  );
};
const customerOriginData = [
  { name: "مصر", value: 500, percentage: 40, color: "#10B981" },
  { name: "السعودية", value: 100, percentage: 10, color: "#3B82F6" },
  { name: "الاردن", value: 150, percentage: 15, color: "#60A5FA" },
  { name: "المغرب", value: 250, percentage: 25, color: "#374151" },
  { name: "اخري", value: 100, percentage: 10, color: "#F87171" },
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, payload }: PieLabelData) => {
  if (cx === undefined || cy === undefined || midAngle === undefined || outerRadius === undefined) {
    return null;
  }
  const radius = outerRadius * 0.7;
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
      {payload?.name ?? ""}
    </text>
  );
};

export const CustomerOriginAnalytics = () => {
  return (
    <div className="bg-white h-full rounded-xl w-full shadow-sm p-6 w-full " dir="rtl">
      <h2 className="text-lg font-bold text-gray-800 mb-6 text-right">من أين أتى العملاء</h2>
      <div className="flex items-center justify-between">
        <div className="w-1/3 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerOriginData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={45}
                dataKey="value"
                stroke="none"
              >
                {customerOriginData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-2/3">
          <div className="flex text-xs text-gray-500 font-semibold border-b pb-2">
            <div className="w-1/3 flex items-center justify-end gap-1">
              الدولة <ArrowUpDown size={12} />
            </div>
            <div className="w-1/3 flex items-center justify-center gap-1">
              نسبة العملاء <ArrowUpDown size={12} />
            </div>
            <div className="w-1/3 flex items-center justify-center gap-1">
              عدد العملاء <ArrowUpDown size={12} />
            </div>
          </div>
          <div className="mt-2 space-y-2">
            {customerOriginData.map((item) => (
              <div key={item.name} className="flex items-center text-sm">
                <div className="w-1/3 flex items-center justify-end gap-2">
                  <span className="font-semibold">{item.name}</span>
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                </div>
                <div className="w-1/3 flex justify-center">
                  <span
                    className="px-4 py-1 rounded-full border text-xs font-bold"
                    style={{
                      color: item.color,
                      borderColor: item.color,
                      backgroundColor: `${item.color}1A`,
                    }}
                  >
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-1/3 text-center font-bold text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default function AnalyticsDashboard() {
  const { data: latestsData, isLoading: latestsLoading } = useAnalyticsQuery("latests", "current_month");
  const { data: contentData, isLoading: contentLoading } = useAnalyticsQuery("content", "current_month");
  const navLinks = [
    { label: "ملخص المنصة", href: "/admin", isActive: true },
    { label: "التقارير", href: "/admin/analytics/stores" },
    { label: "المنتجات", href: "/admin/analytics/products" },
  ];

  return (
    <div>
      {" "}
      <PageHeader
        navLinks={navLinks}
        helpButton={{ label: "مساعدة", href: "#" }}
      />
      <div className="bg-gray-50 w-full min-h-screen p-4 sm:p-8" dir="rtl">
        <div className="grid grid-cols-12 gap-4">
          <div className="mb-8 col-span-8 flex flex-col gap-4">
            <ContentAnalytics />
            <CustomerOriginAnalytics />
          </div>
          <div className="col-span-4 flex flex-col gap-4">
            <CustomersAnalytics />
            <StoresAnalytics data={contentData?.storesGrowthChart || []} isLoading={contentLoading} />
            <ProductsAnalytics />
          </div>
        </div>{" "}
        <div className="  grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <TopRatedStores data={latestsData?.hightRatedStores || []} isLoading={latestsLoading} />
          </div>
          <div className="col-span-2">
            <LatestProducts data={latestsData?.latestsProducts || []} isLoading={latestsLoading} />
          </div>
        </div>
        <div className="mt-10">
          <RecentReports data={latestsData?.recentReports || []} isLoading={latestsLoading} />
        </div>
      </div>
    </div>
  );
}
