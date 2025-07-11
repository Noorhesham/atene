import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
// Data for the line chart

// Data for the bar chart
const barData = [
  { name: "جمعة", value: 35, color: "#93C5FD" },
  { name: "خميس", value: 30, color: "#BFDBFE" },
  { name: "أربع", value: 38, color: "#3B82F6" },
  { name: "ثلاث", value: 30, color: "#BFDBFE" },
  { name: "اثنين", value: 30, color: "#BFDBFE" },
  { name: "احد", value: 30, color: "#BFDBFE" },
  { name: "سبت", value: 30, color: "#BFDBFE" },
];

// Sample data for the chart, mimicking the visual representation
const chartData = [
  { name: "Day 1", views: 0 },
  { name: "Day 2", views: 0 },
  { name: "Day 3", views: 0 },
  { name: "Day 4", views: 0 },
  { name: "Day 5", views: 300 }, // Peak value
  { name: "Day 6", views: 0 },
];

const WatchStats = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        {/* Main Title */}

        {/* Sub-header with Icon */}
        <div className="flex items-center gap-3">
          {/* Provided SVG Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path
              d="M21.544 10.8009C21.848 11.2269 22 11.4409 22 11.7559C22 12.0719 21.848 12.2849 21.544 12.7109C20.178 14.6269 16.689 18.7559 12 18.7559C7.31 18.7559 3.822 14.6259 2.456 12.7109C2.152 12.2849 2 12.0709 2 11.7559C2 11.4399 2.152 11.2269 2.456 10.8009C3.822 8.88486 7.311 4.75586 12 4.75586C16.69 4.75586 20.178 8.88586 21.544 10.8009Z"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              opacity="0.4"
              d="M15 11.7559C15 10.9602 14.6839 10.1971 14.1213 9.63454C13.5587 9.07193 12.7956 8.75586 12 8.75586C11.2044 8.75586 10.4413 9.07193 9.87868 9.63454C9.31607 10.1971 9 10.9602 9 11.7559C9 12.5515 9.31607 13.3146 9.87868 13.8772C10.4413 14.4398 11.2044 14.7559 12 14.7559C12.7956 14.7559 13.5587 14.4398 14.1213 13.8772C14.6839 13.3146 15 12.5515 15 11.7559Z"
              stroke="#252522"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>{" "}
          <div className="flex flex-col gap-1">
            <span className=" font-semibold text-[#9291A5] text-[14.753px]">احصائيات</span>
            <h2 className="font-tajawal font-bold text-[#202020] text-[14.753px]">مشاهدة الملف الشخصي ( 650 )</h2>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart and Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
        {" "}
        {/* Right Section: Monthly Stats */}
        <div className=" order-0 flex flex-col items-center text-center">
          <p className="font-ping-ar-lt font-normal text-[18px] text-[#8E8C84]">مشاهدات الشهر</p>
          <p className="font-tajawal font-bold text-[18px] text-[#406896] my-2">500 مشاهدة</p>
          <div className=" rounded-md px-3 py-1.5 text-[8px] text-[#8E8C84]">الشهر الماضي 200 مشاهدة</div>
        </div>
        {/* Left Section: Chart */}
        <div className=" flex flex-col items-center">
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid vertical={true} horizontal={false} strokeDasharray="5 5" stroke="#E5E7EB" />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#406896"
                strokeWidth={2.5}
                fillOpacity={0}
                dot={{ stroke: "#406896", strokeWidth: 2, r: 4, fill: "white" }}
                activeDot={{ r: 6, fill: "#406896" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-[#8E8C84] text-sm mt-2 font-tajawal">مشاهدة الأيام الماضية</p>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-200" />

      {/* Bottom Stats Section */}
      <div className="grid grid-cols-2 gap-4 text-center">
        {/* All-time Views */}
        <div className="flex flex-col items-start">
          <p className="font-ping-ar-lt font-normal text-[12px] text-[#8E8C84]">جميع المشاهدات</p>
          <p className="font-tajawal font-bold text-[18px] text-gray-800 my-2">650 مشاهدة</p>
          <div className="inline-block bg-[#F9F9F8] rounded-md px-3 py-1.5 text-xs text-[#8E8C84] font-tajawal">
            هذه السنة 200K مشاهدة
          </div>
        </div>

        {/* Today's Views */}
        <div className="flex flex-col items-start">
          <p className="font-ping-ar-lt font-normal text-[12px] text-[#8E8C84]">مشاهدات اليوم</p>
          <p className="font-tajawal font-bold text-[18px] text-gray-800 my-2">150 مشاهدة</p>
          <div className="inline-block bg-[#F9F9F8] rounded-md px-3 py-1.5 text-xs text-[#8E8C84] font-tajawal">
            مشاهدات الامس 200 مشاهدة
          </div>
        </div>
      </div>
    </div>
  );
};

const FollowersStats = () => {
  const chartData = [
    { day: "سبت", base: 10, middle: 5, top: 13 },
    { day: "احد", base: 10, middle: 5, top: 13 },
    { day: "اثنين", base: 10, middle: 5, top: 13 },
    { day: "ثلاث", base: 10, middle: 5, top: 13 },
    { day: "اربع", base: 10, middle: 5, top: 13, peak: 8 }, // The day with the darkest bar
    { day: "خميس", base: 10, middle: 5, top: 13 },
    { day: "جمعة", base: 10, middle: 5, top: 13 },
  ].reverse(); // Reverse to match the order in the image (جمعة to سبت)
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 w-full max-w-2xl mx-auto font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2">
          {/* Calendar Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="text-sm text-gray-700">الكل</span>
          {/* Dropdown Arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        {/* Main Title */}
        <div className="text-right">
          <p className="text-sm text-gray-400">احصائيات</p>
          <h2 className="text-lg font-bold text-gray-800">المتابعين لك ( 40 )</h2>
        </div>
      </div>

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 0,
            left: -20, // Adjust to align Y-axis labels
            bottom: 5,
          }}
          barGap={20} // Space between bars
          barCategoryGap="30%" // Width of the bars
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 14 }}
            dy={10} // Pushes labels down
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            ticks={[10, 20, 30, 40]}
            domain={[0, 42]}
            tick={{ fill: "#9CA3AF", fontSize: 14 }}
          />
          {/* Base of the bar */}
          <Bar dataKey="base" stackId="a" fill="#E0E7FF" radius={[8, 8, 0, 0]} />
          {/* Light blue middle part */}
          <Bar dataKey="middle" stackId="a" fill="#C7D2FE" />
          {/* Darker blue top part */}
          <Bar dataKey="top" stackId="a" fill="#A5B4FC" radius={[8, 8, 0, 0]} />
          {/* The darkest blue peak */}
          <Bar dataKey="peak" stackId="a" fill="#4338CA" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { FollowersStats, WatchStats };
