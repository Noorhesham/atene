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
} from "recharts";
import { Calendar, Users, Store, Package, ShoppingCart, AlertCircle, ChevronLeft, RefreshCw } from "lucide-react";
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
              <Line type="monotone" dataKey="count" stroke="#4A5568" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

const ProductsAnalytics = () => {
  const { data, isLoading } = useAnalyticsQuery("analytics", "current_month");
  const chartData = useMemo(() => data?.productsGrowthChart || [], [data]);
  const StatRow = ({
    label,
    value,
    subLabel,
    subValue,
  }: {
    label: string;
    value: number;
    subLabel: string;
    subValue: number;
  }) => (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">
        {isLoading ? <SkeletonLoader className="h-8 w-16 mt-1" /> : value}
        <span className="text-base font-normal"> منتج</span>
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {subLabel}: {isLoading ? "..." : subValue}
      </p>
    </div>
  );
  return (
    <Card className="p-6">
      <h2 className="font-bold text-gray-800 mb-4">
        احصائيات المنتجات ({isLoading ? "..." : data?.totalProducts || 0})
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatRow
          label="منتجات الشهر"
          value={data?.totalProductsThisMonth || 0}
          subLabel="الشهر الماضي"
          subValue={data?.totalProductsLastMonth || 0}
        />
        <StatRow
          label="منتجات اليوم"
          value={data?.totalProductsThisDay || 0}
          subLabel="منتجات الامس"
          subValue={data?.totalProductsYesterday || 0}
        />
      </div>
      <div className="border-t pt-4">
        <StatRow
          label="جميع المنتجات"
          value={data?.totalProducts || 0}
          subLabel="هذه السنة"
          subValue={data?.totalProductsThisYear || 0}
        />
      </div>
      <div className="h-24 mt-4">
        {isLoading ? (
          <SkeletonLoader className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        )}
        <p className="text-center text-xs text-gray-400 mt-1">منتجات الأيام الماضية</p>
      </div>
    </Card>
  );
};

const CustomerOrigin = ({ data, isLoading }: { data: any[]; isLoading: boolean }) => (
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
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 space-y-2 my-auto">
          {data.map((item) => (
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

const TopRatedStores = ({ data, isLoading }: { data: any[]; isLoading: boolean }) => (
  <Card className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-gray-800">المتاجر الأكثر تقييماً</h3>
      <ChevronLeft className="w-5 h-5 text-gray-400" />
    </div>
    {isLoading ? (
      <SkeletonLoader className="h-32" />
    ) : (
      <div className="space-y-3">
        {data.map((store, index) => (
          <div key={store.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-400">{index + 1}</span>
              <img
                src={`https://i.pravatar.cc/150?img=${store.id}`}
                className="w-10 h-10 rounded-full"
                alt={store.name}
              />
              <span className="font-semibold">{store.name}</span>
            </div>
            <div className="text-sm text-gray-500">{store.reviews_count} تقييم</div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

const LatestProducts = ({ data, isLoading }: { data: any[]; isLoading: boolean }) => {
  const getStatusChip = (status: string) => {
    if (status.includes("موافقة"))
      return <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">{status}</span>;
    if (status.includes("مرفوض"))
      return <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">{status}</span>;
    return <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">{status}</span>;
  };
  return (
    <Card className="p-0 lg:col-span-2">
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
              {data.map((p) => (
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

const RecentReports = ({ data, isLoading }: { data: any[]; isLoading: boolean }) => (
  <Card className="p-0">
    <div className="flex justify-between items-center p-6 pb-2">
      <h3 className="font-bold text-gray-800">الشكاوي (10)</h3>
      <RefreshCw className="w-5 h-5 text-gray-400 cursor-pointer" />
    </div>
    <div className="overflow-x-auto">
      {isLoading ? (
        <SkeletonLoader className="h-32 m-6" />
      ) : (
        <table className="w-full text-sm text-right">
          <thead>
            <tr className="text-gray-500">
              {["رقم الشكوي", "الطلب", "حالة الشكوي"].map((h) => (
                <th key={h} className="font-semibold p-3 px-6">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 px-6 font-medium text-blue-600">#{r.id}</td>
                <td className="p-3 px-6">{r.order_id}</td>
                <td className="p-3 px-6 text-green-600">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </Card>
);

export default function AdminAnalysis() {
  const { data: latestsData, isLoading: latestsLoading } = useAnalyticsQuery("latests", "current_month");

  return (
    <div className="bg-gray-50 w-full min-h-screen p-4 sm:p-6" dir="rtl">
      {/* Top Row: big analytics + right column */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 lg:col-span-8">
          <ContentAnalytics />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <ProductsAnalytics />
          <CustomerOrigin data={latestsData?.customerOrigins || []} isLoading={latestsLoading} />
          <TopRatedStores data={latestsData?.hightRatedStores || []} isLoading={latestsLoading} />
        </div>
      </div>

      {/* Bottom Row: latest tables stacked */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <LatestProducts data={latestsData?.latestsProducts || []} isLoading={latestsLoading} />
        </div>
        <div className="col-span-12">
          <RecentReports data={latestsData?.recentReports || []} isLoading={latestsLoading} />
        </div>
      </div>
    </div>
  );
}
