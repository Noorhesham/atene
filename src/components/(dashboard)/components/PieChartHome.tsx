// src/components/PieChartHome.tsx
import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Data structure expected by the component
interface DailyCustomerData {
  name: string; // Day of the week
  count: number;
  percentage: number;
  color: string;
  lightColor: string;
}

interface CustomerDistributionChartProps {
  data?: Record<string, number>; // e.g., { "Friday": 1, "Saturday": 3 }
}

const dayColors: Record<string, { color: string; lightColor: string }> = {
  Saturday: { color: "#10B981", lightColor: "#D1FAE5" },
  Sunday: { color: "#FBBF24", lightColor: "#FEF9C3" },
  Monday: { color: "#38BDF8", lightColor: "#E0F2FE" },
  Tuesday: { color: "#374151", lightColor: "#F3F4F6" },
  Wednesday: { color: "#F87171", lightColor: "#FEE2E2" },
  Thursday: { color: "#8B5CF6", lightColor: "#EDE9FE" },
  Friday: { color: "#EC4899", lightColor: "#FCE7F3" },
};
const dayArabicNames: Record<string, string> = {
  Saturday: "السبت",
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
};

const CustomerDistributionChart = ({ data = {} }: CustomerDistributionChartProps) => {
  const totalCustomers = Object.values(data).reduce((sum, count) => sum + count, 0);

  const chartData: DailyCustomerData[] = Object.entries(data).map(([day, count]) => {
    const percentage = totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0;
    return {
      name: dayArabicNames[day] || day,
      count,
      percentage,
      color: dayColors[day]?.color || "#A8A29E",
      lightColor: dayColors[day]?.lightColor || "#F5F5F4",
    };
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-6 text-right text-gray-800">توزيع العملاء حسب اليوم</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" dir="rtl">
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} عميل`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-200">
            <div className="flex items-center justify-start gap-1 text-sm font-medium text-gray-500">
              <span>اليوم</span>
              <ChevronsUpDown className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-500">
              <span>نسبة العملاء</span>
              <ChevronsUpDown className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-500">
              <span>عدد العملاء</span>
              <ChevronsUpDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {chartData.map((item) => (
              <div key={item.name} className="grid grid-cols-3 gap-4 items-center">
                <div className="flex items-center justify-start gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex justify-center">
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full border"
                    style={{
                      color: item.color,
                      borderColor: item.color,
                      backgroundColor: item.lightColor,
                    }}
                  >
                    {item.percentage}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold text-gray-800">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDistributionChart;
