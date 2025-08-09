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
import {
  Calendar,
  Users,
  Store,
  Package,
  ShoppingCart,
  AlertCircle,
  ChevronLeft,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
import { useAnalyticsQuery } from "@/hooks/useAnalyticsQuery";

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

const PeriodSelector = ({ period, setPeriod }: { period: Period; setPeriod: (p: Period) => void }) => {
  const periodOptions: { label: string; value: Period }[] = [
    { label: "الشهر الحالي", value: "current_month" },
    { label: "آخر شهر", value: "last_month" },
    { label: "الأسبوع الحالي", value: "current_week" },
    { label: "آخر أسبوع", value: "last_week" },
    { label: "اليوم", value: "current_day" },
  ];
  return (
    <div className="relative">
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value as Period)}
        className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="تحديد الفترة"
        title="تحديد الفترة"
      >
        {periodOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
};

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
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    bgColor: string;
  }) => (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${bgColor}`}>{icon}</div>
      <div>
        <p className="text-sm font-bold text-gray-800">{isLoading ? <SkeletonLoader className="h-5 w-8" /> : value}</p>
        <p className="text-xs text-gray-500">{title}</p>
      </div>
    </div>
  );
  const chartData = useMemo(() => data?.storesGrowthChart || [], [data]);
  const completedOrders = data?.totalCompletedOrders || 0;
  const canceledOrders = data?.totalCanceledOrders || 0;
  const completedPercentage = data?.totalOrders > 0 ? (completedOrders / data.totalOrders) * 100 : 0;
  const canceledPercentage = data?.totalOrders > 0 ? (canceledOrders / data.totalOrders) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5" /> إحصائيات المنصة
        </h2>
        <PeriodSelector period={period} setPeriod={setPeriod} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 mb-6">
        <StatCard
          title="إجمالي التجار"
          value={data?.totalMerchants || 0}
          icon={<Users size={20} className="text-blue-500" />}
          bgColor="bg-blue-100"
        />
        <StatCard
          title="إجمالي المتاجر"
          value={data?.totalStores || 0}
          icon={<Store size={20} className="text-green-500" />}
          bgColor="bg-green-100"
        />
        <StatCard
          title="متاجر تحتاج لموافقة"
          value={data?.notActiveStores || 0}
          icon={<AlertCircle size={20} className="text-red-500" />}
          bgColor="bg-red-100"
        />
        <div />
        <StatCard
          title="إجمالي المنتجات"
          value={data?.totalProducts || 0}
          icon={<Package size={20} className="text-indigo-500" />}
          bgColor="bg-indigo-100"
        />
        <div />
        <StatCard
          title="منتجات تحتاج لموافقة"
          value={data?.notActiveProducts || 0}
          icon={<ShoppingCart size={20} className="text-yellow-500" />}
          bgColor="bg-yellow-100"
        />
      </div>
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm font-semibold">
          <span>طلبات مكتملة ({completedOrders})</span>
          <span>{Math.round(completedPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${completedPercentage}%` }}></div>
        </div>
      </div>
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm font-semibold">
          <span>طلبات مرفوضة ({canceledOrders})</span>
          <span>{Math.round(canceledPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${canceledPercentage}%` }}></div>
        </div>
      </div>
      <div className="h-64">
        {isLoading ? (
          <SkeletonLoader className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 6]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "0.5rem", direction: "rtl" }}
                labelStyle={{ fontWeight: "bold" }}
                formatter={(value, name, props) => [`${value} تجار`, `بتاريخ ${props.payload.date}`]}
              />
              <Line type="monotone" dataKey="count" stroke="#406896" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

const ProductsAnalytics = () => {
  const { data, isLoading } = useAnalyticsQuery("content", "current_month");

  // Compact 7-bar chart like the screenshot
  const chartData = useMemo(
    () => [
      { day: "1", count: 5 },
      { day: "2", count: 8 },
      { day: "3", count: 3 },
      { day: "4", count: 12 },
      { day: "5", count: 7 },
      { day: "6", count: 9 },
      { day: "7", count: 6 },
    ],
    []
  );

  const StatRow = ({
    title,
    value,
    badgeLabel,
    badgeValue,
  }: {
    title: string;
    value: number;
    badgeLabel: string;
    badgeValue: number;
  }) => (
    <div className="py-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-gray-700">{title}</h4>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-800">{isLoading ? "..." : value}</span>
          <span className="text-sm">منتج</span>
        </div>
      </div>
      <div className="mt-1 flex justify-end">
        <span className="text-[10px] text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">
          {badgeLabel} {isLoading ? "..." : badgeValue}
        </span>
      </div>
    </div>
  );

  return (
    <Card className="p-4">
      <div className="flex justify-start mb-3">
        <h3 className="font-bold text-right text-gray-800 text-sm">
          احصائيات المنتجات ({isLoading ? "..." : data?.totalProducts || 0})
        </h3>
      </div>

      <div className="grid grid-cols-12 gap-6 items-center">
        {/* Left: Bar chart */}
        {/* Right: Stats */}
        <div className="col-span-12 md:col-span-7">
          <div className="grid grid-cols-2 gap-6">
            <StatRow
              title="منتجات الشهر"
              value={data?.totalProductsThisMonth || 500}
              badgeLabel="الشهر الماضي"
              badgeValue={data?.totalProductsLastMonth || 200}
            />
            <StatRow
              title="منتجات اليوم"
              value={data?.totalProductsThisDay || 150}
              badgeLabel="منتجات الأمس"
              badgeValue={data?.totalProductsYesterday || 200}
            />
          </div>
          <div className="mt-4">
            <StatRow
              title="جميع المنتجات"
              value={data?.totalProducts || 650}
              badgeLabel="هذه السنة"
              badgeValue={data?.totalProductsThisYear || 200000}
            />
          </div>
        </div>{" "}
        <div className="col-span-12 md:col-span-5">
          <div className="h-28">
            {isLoading ? (
              <SkeletonLoader className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="count" fill="#406896" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-1">منتجات الايام الماضية</p>
        </div>
      </div>
    </Card>
  );
};
// Types used in multiple widgets
type CustomersMap = Record<string, number>;
type CustomerOriginItem = { country: string; count: number; percentage: number; color: string };
type RatedStoreItem = { id: number; name: string; reviews_count: number; logo_url?: string };
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
        <h2 className="font-bold text-gray-800">العملاء ({isLoading ? "..." : totalCustomers})</h2>
        <PeriodSelector period={period} setPeriod={setPeriod} />
      </div>
      <div className="h-40">
        {isLoading ? (
          <SkeletonLoader className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 40]}
                ticks={[0, 10, 20, 30, 40]}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
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
const CustomerOrigin = ({ data, isLoading }: { data: CustomerOriginItem[]; isLoading: boolean }) => (
  <Card className="p-6">
    <h3 className="font-bold text-gray-800 mb-4">من أين أتى العملاء</h3>
    {isLoading ? (
      <SkeletonLoader className="h-48" />
    ) : (
      <div className="flex gap-4">
        <div className="w-1/2 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="country"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={40}
                paddingAngle={5}
              >
                {data.map((entry: CustomerOriginItem, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 space-y-2 my-auto">
          {data.map((item: CustomerOriginItem) => (
            <div key={item.country}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-600">{item.country}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </Card>
);

const TopRatedStores = ({ data, isLoading }: { data: RatedStoreItem[]; isLoading: boolean }) => (
  <Card className="p-6 max-h-96  overflow-y-auto w-full">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-gray-800">المتاجر الأكثر تقييماً</h3>
      <ChevronLeft className="w-5 h-5 text-gray-400" />
    </div>
    {isLoading ? (
      <SkeletonLoader className="h-32" />
    ) : (
      <div className="space-y-3">
        {data.map((store: RatedStoreItem, index: number) => (
          <div key={store.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-400">{index + 1}</span>
              <img src={store.logo_url} className="w-10 h-10 rounded-full" alt={store.name} />
              <span className="font-semibold">{store.name}</span>
            </div>
            <div className="text-sm text-gray-500">{store.reviews_count} تقييم</div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

const LatestProducts = ({ data, isLoading }: { data: LatestProductItem[]; isLoading: boolean }) => {
  const getStatusChip = (status: string) => {
    if (status.includes("موافقة"))
      return <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">{status}</span>;
    if (status.includes("مرفوض"))
      return <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">{status}</span>;
    return <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">{status}</span>;
  };
  return (
    <Card className="p-0 w-full max-h-96 overflow-y-auto lg:col-span-2">
      <div className="flex justify-between items-center p-6 pb-2">
        <h3 className="font-bold text-gray-800">أحدث المنتجات (20)</h3>
        <RefreshCw className="w-5 h-5 text-gray-400 cursor-pointer" />
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
                <tr key={p.id} className="border-t">
                  <td className="p-3 px-6 font-medium text-blue-600">#{p.id}</td>
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
    if (status === "pending")
      return (
        <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">قيد الانتظار</span>
      );
    if (status === "resolved")
      return <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">تم الحل</span>;
    if (status === "rejected")
      return <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">مرفوض</span>;
    return <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{status}</span>;
  };

  return (
    <Card className="p-0">
      <div className="flex justify-between items-center p-6 pb-2">
        <h3 className="font-bold text-gray-800">الشكاوي ({data?.length || 0})</h3>
        <RefreshCw className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <SkeletonLoader className="h-32 m-6" />
        ) : (
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="text-gray-500">
                {["رقم الشكوي", "نوع الشكوي", "المنتج", "المستخدم", "الحالة"].map((h) => (
                  <th key={h} className="font-semibold p-3 px-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r: RecentReportItem) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 px-6 font-medium text-blue-600">#{r.id}</td>
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
const StoresGrowthChart = ({ data, isLoading }: { data: { date: string; count: number }[]; isLoading: boolean }) => {
  // Normalize chart data with short date for axis
  const chartData = useMemo(() => {
    return (data ?? []).map((item) => ({
      ...item,
      short: new Date(item.date).toLocaleDateString("ar-EG", { day: "2-digit", month: "2-digit" }),
    }));
  }, [data]);

  // Helpers to calculate aggregates like screenshot
  const now = useMemo(() => new Date(), []);
  const ymd = (d: Date) => d.toISOString().slice(0, 10);
  const isSameMonth = (d: Date, ref: Date) => d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
  const prevMonth = useMemo(() => new Date(now.getFullYear(), now.getMonth() - 1, 1), [now]);
  const yesterday = useMemo(() => {
    const y = new Date(now);
    y.setDate(now.getDate() - 1);
    return y;
  }, [now]);

  const toDate = (s: string) => new Date(s);

  const totalStores = useMemo(() => chartData.reduce((sum, it) => sum + (Number(it.count) || 0), 0), [chartData]);
  const storesThisMonth = useMemo(
    () => chartData.filter((it) => isSameMonth(toDate(it.date), now)).reduce((s, it) => s + Number(it.count || 0), 0),
    [chartData, now]
  );
  const storesLastMonth = useMemo(
    () =>
      chartData.filter((it) => isSameMonth(toDate(it.date), prevMonth)).reduce((s, it) => s + Number(it.count || 0), 0),
    [chartData, prevMonth]
  );
  const storesToday = useMemo(
    () => chartData.filter((it) => ymd(toDate(it.date)) === ymd(now)).reduce((s, it) => s + Number(it.count || 0), 0),
    [chartData, now]
  );
  const storesYesterday = useMemo(
    () =>
      chartData.filter((it) => ymd(toDate(it.date)) === ymd(yesterday)).reduce((s, it) => s + Number(it.count || 0), 0),
    [chartData, yesterday]
  );
  const storesThisYear = useMemo(
    () =>
      chartData
        .filter((it) => toDate(it.date).getFullYear() === now.getFullYear())
        .reduce((s, it) => s + Number(it.count || 0), 0),
    [chartData, now]
  );

  const StatRow = ({
    title,
    value,
    badgeLabel,
    badgeValue,
  }: {
    title: string;
    value: number;
    badgeLabel: string;
    badgeValue: number;
  }) => (
    <div className="py-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-gray-700">{title}</h4>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-800">{isLoading ? "..." : value}</span>
          <span className="text-sm">متجر</span>
        </div>
      </div>
      <div className="mt-1 flex justify-end">
        <span className="text-[10px] text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">
          {badgeLabel} {isLoading ? "..." : badgeValue}
        </span>
      </div>
    </div>
  );

  return (
    <Card className="p-4">
      <div className="flex justify-start mb-3">
        <h3 className="font-bold text-right text-gray-800 text-sm">
          احصائيات المتاجر ({isLoading ? "..." : totalStores})
        </h3>
      </div>
      <div className="grid grid-cols-12 gap-6 items-center">
        <div className="col-span-12 md:col-span-7">
          <div className="grid grid-cols-2 gap-6">
            <StatRow
              title="متاجر الشهر"
              value={storesThisMonth || 500}
              badgeLabel="الشهر الماضي"
              badgeValue={storesLastMonth || 200}
            />
            <StatRow
              title="متاجر اليوم"
              value={storesToday || 150}
              badgeLabel="متاجر الأمس"
              badgeValue={storesYesterday || 200}
            />
          </div>
          <div className="my-3 border-t" />
          <div className="grid grid-cols-2 gap-6">
            <StatRow
              title="جميع المتاجر"
              value={totalStores || 650}
              badgeLabel="هذه السنة"
              badgeValue={storesThisYear || 200000}
            />
            <div />
          </div>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="h-28">
            {isLoading ? (
              <SkeletonLoader className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="short" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, "dataMax + 1"]} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-right text-[11px] text-gray-400 mt-1">متاجر الأيام الماضية</p>
        </div>
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
  return (
    <div className="bg-gray-50 w-full min-h-screen p-4 sm:p-8" dir="rtl">
      <div className="grid grid-cols-12 gap-4">
        <div className="mb-8 col-span-8 flex flex-col gap-4">
          <ContentAnalytics />
          <CustomerOriginAnalytics />
        </div>
        <div className="col-span-4 flex flex-col gap-4">
          <CustomersAnalytics />
          <StoresGrowthChart data={contentData?.storesGrowthChart || []} isLoading={contentLoading} />
          <ProductsAnalytics />
        </div>
      </div>{" "}
      <div className="flex  gap-4">
        <LatestProducts data={latestsData?.latestsProducts || []} isLoading={latestsLoading} />
        <TopRatedStores data={latestsData?.hightRatedStores || []} isLoading={latestsLoading} />
      </div>
      <div className="mt-10">
        <RecentReports data={latestsData?.recentReports || []} isLoading={latestsLoading} />
      </div>
    </div>
  );
}
