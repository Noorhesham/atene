import { useState } from "react";
import { useAnalyticsQuery } from "@/hooks/useAnalyticsQuery";
import { Users, Store, AlertCircle, Package, ShoppingCart, Calendar } from "lucide-react";
import { useMemo } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Bar } from "recharts";
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

// --- Content Analytics Component (First Image) ---
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
  const totalOrders = completedOrders + canceledOrders;
  const completedPercentage = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
  const canceledPercentage = totalOrders > 0 ? (canceledOrders / totalOrders) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6" dir="rtl">
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

      <div className="space-y-5 mb-6">
        {/* Completed bar */}
        <div>
          <div className="flex justify-start text-sm font-semibold mb-1">
            <span>طلبات مكتملة ({completedOrders})</span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <span
              className="absolute text-[10px] font-bold text-green-600 -top-4"
              style={{ left: `${Math.min(100, Math.max(0, completedPercentage))}%`, transform: "translateX(-50%)" }}
            >
              {Math.round(completedPercentage)}%
            </span>
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, completedPercentage))}%` }}
            />
          </div>
        </div>

        {/* Canceled bar */}
        <div>
          <div className="flex justify-start text-sm font-semibold mb-1">
            <span>طلبات مرفوضة ({canceledOrders})</span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <span
              className="absolute text-[10px] font-bold text-rose-500 -top-4"
              style={{ left: `${Math.min(100, Math.max(0, canceledPercentage))}%`, transform: "translateX(-50%)" }}
            >
              {Math.round(canceledPercentage)}%
            </span>
            <div
              className="h-full bg-rose-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, canceledPercentage))}%` }}
            />
          </div>
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
              <Line type="monotone" dataKey="count" stroke="#4A5568" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const CustomersAnalytics = () => {
  const [period, setPeriod] = useState<Period>("current_month");
  const { data, isLoading } = useAnalyticsQuery("customers", period);

  const chartData = useMemo(() => {
    if (!data?.customers)
      return [] as { name: string; total: number; part1: number; part2: number; part3: number; part4: number }[];
    // To create the stacked effect from the image, we split each value into parts
    return Object.entries(data.customers).map(([name, value]) => {
      const v = Number(value || 0);
      return {
        name,
        total: v,
        part1: v * 0.4,
        part2: v * 0.3,
        part3: v * 0.2,
        part4: v * 0.1,
      };
    });
  }, [data]);

  const totalCustomers = useMemo(() => {
    if (!data?.customers) return 0;
    return Object.values(data.customers).reduce((sum: number, val: unknown) => sum + Number(val || 0), 0);
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-gray-800">احصائيات العملاء ({isLoading ? "..." : totalCustomers})</h2>
        <PeriodSelector period={period} setPeriod={setPeriod} />
      </div>
      <div className="h-64">
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
              <Bar dataKey="part1" stackId="a" fill="#E0E7FF" barSize={30} radius={[4, 4, 0, 0]} />
              <Bar dataKey="part2" stackId="a" fill="#C7D2FE" barSize={30} />
              <Bar dataKey="part3" stackId="a" fill="#A5B4FC" barSize={30} />
              <Bar dataKey="part4" stackId="a" fill="#6366F1" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const AdminAnalysis = () => {
  return (
    <div className="bg-gray-50 min-h-screen w-full p-4 sm:p-8" dir="rtl">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <ContentAnalytics />
        </div>
        <div className="col-span-4">
          <CustomersAnalytics />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalysis;
