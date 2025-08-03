// src/components/StatsDashboard.tsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Megaphone, Shirt, Heart, Phone, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Data types from the API
interface ContentAnalytics {
  totalProducts: number;
  totalOrders: number;
  totalCompletedOrders: number;
  totalCanceledOrders: number;
  storesGrowthChart: { date: string; count: number }[];
  // Assuming favorites and calls might come in the future
  totalFavorites?: number;
  totalChats?: number;
  totalCalls?: number;
}

interface StatsDashboardProps {
  data?: ContentAnalytics;
}

const StatsDashboard = ({ data }: StatsDashboardProps) => {
  // Calculate percentages
  const totalOrders = data?.totalOrders || 0;
  const completedPercentage = totalOrders > 0 ? Math.round((data?.totalCompletedOrders / totalOrders) * 100) : 0;
  const canceledPercentage = totalOrders > 0 ? Math.round((data?.totalCanceledOrders / totalOrders) * 100) : 0;

  // Format chart data
  const lineChartData =
    data?.storesGrowthChart.map((item) => ({
      name: new Date(item.date).toLocaleDateString("ar-EG-u-nu-latn", { day: "2-digit", month: "2-digit" }),
      value: item.count,
    })) || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-gray-700" />
          <span className="text-lg font-semibold text-gray-800">المحتوى (الشهر الحالي)</span>
        </div>
        <Select defaultValue="this-month">
          <SelectTrigger className="w-[180px] border-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <SelectValue placeholder="اختر الشهر" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">الشهر الحالي</SelectItem>
            <SelectItem value="last-month">الشهر الماضي</SelectItem>
            <SelectItem value="last-3-months">آخر 3 أشهر</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards & Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
        {/* Right Column */}
        <div className="space-y-6">
          <StatCard
            icon={<Shirt className="w-6 h-6 text-[#3B82F6]" />}
            title="اجمالي المنتجات"
            value={data?.totalProducts?.toString() || "0"}
            iconBg="bg-blue-100"
          />
          <StatCard
            icon={<Heart className="w-6 h-6 text-green-500" />}
            title="الاضافة للمفضلة"
            value={data?.totalFavorites?.toString() || "0"} // Placeholder
            iconBg="bg-green-100"
          />
          <ProgressCard title="طلبات مكتملة" percentage={completedPercentage} color="bg-green-500" />
        </div>

        {/* Left Column */}
        <div className="space-y-6">
          <StatCard
            icon={<MessageSquare className="w-6 h-6 text-gray-600" />}
            title="الدردشات"
            value={data?.totalChats?.toString() || "0"} // Placeholder
            iconBg="bg-gray-200"
          />
          <StatCard
            icon={<Phone className="w-6 h-6 text-sky-500" />}
            title="المكالمات"
            value={data?.totalCalls?.toString() || "0"} // Placeholder
            iconBg="bg-sky-100"
          />
          <ProgressCard title="طلبات مرفوضة" percentage={canceledPercentage} color="bg-red-500" />
        </div>
      </div>

      {/* Line Chart for Store Growth */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#395A7D" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#395A7D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={12} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "8px",
                direction: "rtl",
              }}
            />
            <Area type="monotone" dataKey="value" stroke="transparent" fill="url(#chartGradient)" />
            <Line type="monotone" dataKey="value" stroke="#395A7D" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  iconBg,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  iconBg: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${iconBg}`}>{icon}</div>
      <p className="text-md font-medium text-gray-700">{title}</p>
    </div>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

const ProgressCard = ({ title, percentage, color }: { title: string; percentage: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <p className="text-md font-medium text-gray-700">{title}</p>
      <span className={`text-sm font-bold ${color.replace("bg", "text")}`}>{percentage}%</span>
    </div>
    <Progress value={percentage} className={`h-2 [&>div]:${color}`} />
  </div>
);

export default StatsDashboard;
