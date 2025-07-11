import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Megaphone, Shirt, Heart, Phone, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Define types for chart data and props
interface LineData {
  name: string;
  value: number;
}

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: LineData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: LineData }>;
  label?: string;
}

// Data for the line chart
const lineData: LineData[] = [
  { name: "19/11", value: 4.2 },
  { name: "21/11", value: 4.8 },
  { name: "23/11", value: 3.8 },
  { name: "25/11", value: 4.5 },
  { name: "27/11", value: 5.6 },
  { name: "29/11", value: 5.2 },
  { name: "1/12", value: 4.9 },
  { name: "2/12", value: 5.3 },
  { name: "3/12", value: 5.8 },
  { name: "4/12", value: 5.1 },
  { name: "5/12", value: 4.7 },
  { name: "6/12", value: 5.0 },
  { name: "7/12", value: 5.5 },
  { name: "8/12", value: 5.1 },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length && label === "3/12") {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg text-center">
        <p className="text-gray-800 font-semibold">4 منتجات</p>
        <p className="text-gray-500 text-xs">3 ديسمبر</p>
      </div>
    );
  }
  return null;
};

// Custom Active Dot Component
const CustomActiveDot = (props: DotProps) => {
  const { cx, cy, payload } = props;
  if (cx !== undefined && cy !== undefined && payload?.name === "3/12") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="#395A7D" stroke="#fff" strokeWidth={2} />
        <line x1={cx} y1={cy} x2={cx} y2={250} stroke="#395A7D" strokeWidth={1} />
      </g>
    );
  }
  return null;
};

const StatsDashboard = () => {
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
            value="0"
            iconBg="bg-blue-100"
          />
          <StatCard
            icon={<MessageSquare className="w-6 h-6 text-gray-600" />}
            title="الدردشات"
            value="0"
            iconBg="bg-gray-200"
          />
          <ProgressCard title="طلبات مكتملة" percentage={30} color="bg-green-500" />
        </div>

        {/* Left Column */}
        <div className="space-y-6">
          <StatCard
            icon={<Heart className="w-6 h-6 text-green-500" />}
            title="الاضافة للمفضلة"
            value="0"
            iconBg="bg-green-100"
          />
          <StatCard icon={<Phone className="w-6 h-6 text-sky-500" />} title="المكالمات" value="0" iconBg="bg-sky-100" />
          <ProgressCard title="طلبات مرفوضة" percentage={30} color="bg-red-500" />
        </div>
      </div>

      {/* Line Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#395A7D" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#395A7D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              axisLine={false}
              tickLine={false}
              domain={[0, 6]}
              ticks={[0, 2, 3, 4, 5, 6]}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area type="monotone" dataKey="value" stroke="transparent" fill="url(#chartGradient)" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#395A7D"
              strokeWidth={2.5}
              dot={false}
              activeDot={<CustomActiveDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
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

// Reusable Progress Card Component
const ProgressCard = ({ title, percentage, color }: { title: string; percentage: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <p className="text-md font-medium text-gray-700">{title}</p>
      <span className={`text-sm font-bold ${color.replace("bg", "text")}`}>{percentage}%</span>
    </div>
    <Progress
      value={percentage}
      className="h-2 [&>div]:bg-red-500"
      style={{ "--progress-color": color } as React.CSSProperties}
    />
  </div>
);

export default StatsDashboard;
