import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CustomerData {
  name: string;
  count: number;
  percentage: number;
  color: string;
  lightColor: string;
}

const customerData: CustomerData[] = [
  { name: "مصر", count: 500, percentage: 40, color: "#10B981", lightColor: "#D1FAE5" },
  { name: "السعودية", count: 100, percentage: 10, color: "#FBBF24", lightColor: "#FEF9C3" },
  { name: "الاردن", count: 150, percentage: 15, color: "#38BDF8", lightColor: "#E0F2FE" },
  { name: "المغرب", count: 250, percentage: 25, color: "#374151", lightColor: "#F3F4F6" },
  { name: "اخري", count: 100, percentage: 10, color: "#F87171", lightColor: "#FEE2E2" },
];

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  payload?: CustomerData;
}

const renderCustomizedLabel = (props: CustomizedLabelProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props;

  if (midAngle === undefined || innerRadius === undefined || outerRadius === undefined || !payload) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="bold">
      {payload.name}
    </text>
  );
};

const CustomerDistributionChart = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-6 text-right text-gray-800">من اين تأتي العملاء</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" dir="rtl">
        {" "}
        {/* Left side: Pie Chart */}
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={2}
                dataKey="percentage"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {customerData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Right side: Data Table */}
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-200">
            <div className="flex items-center justify-start gap-1 text-sm font-medium text-gray-500">
              <span>الدولة</span>
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

          {/* Table Body */}
          <div className="mt-4 space-y-3">
            {customerData.map((item) => (
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
