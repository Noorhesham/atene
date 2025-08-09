// src/components/Dash1.tsx
import React from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

// Data types from APIs
interface MerchantAnalyticsData {
  current_month_views: number;
  last_month_views: number;
  current_day_views: number;
  yesterday_views: number;
  current_week_views: number;
  all_time_views: number;
  current_year_views: number;
}

interface WatchStatsProps {
  data?: MerchantAnalyticsData;
  chartData?: { date: string; count: number }[];
}

const WatchStats = ({ data, chartData = [] }: WatchStatsProps) => {
  const formattedChartData = chartData.map((item) => ({
    name: new Date(item.date).toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric" }),
    views: item.count,
  }));

  return (
    <div className="bg-white rounded-xl w-full  border border-gray-200 p-6 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-[#9291A5] text-[14.753px]">احصائيات المشاهدات</span>
            <h2 className="font-tajawal font-bold text-[#202020] text-[14.753px]">
              مشاهدة الملف الشخصي ( {data?.current_year_views || 0} )
            </h2>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
        <div className="order-0 flex flex-col items-center text-center">
          <p className="font-normal text-[18px] text-[#8E8C84]">مشاهدات الشهر</p>
          <p className="font-bold text-[18px] text-[#406896] my-2">{data?.current_month_views || 0} مشاهدة</p>
          <div className="rounded-md px-3 py-1.5 text-xs text-[#8E8C84]">
            الشهر الماضي {data?.last_month_views || 0} مشاهدة
          </div>
        </div>
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="158" height="71" viewBox="0 0 158 71" fill="none">
            <path d="M155 67.9404L128 4.44043L102.5 67.9404H77H49H25.5H0.5" stroke="#5B87B9" stroke-width="3" />
            <circle cx="3" cy="3" r="3" transform="matrix(-1 0 0 1 106 64.4404)" fill="#406896" />
            <circle cx="3" cy="3" r="3" transform="matrix(-1 0 0 1 158 64.4404)" fill="#406896" />
            <circle cx="3" cy="3" r="3" transform="matrix(-1 0 0 1 81 64.4404)" fill="#406896" />
            <circle cx="3" cy="3" r="3" transform="matrix(-1 0 0 1 56 64.4404)" fill="#406896" />
            <circle cx="3" cy="3" r="3" transform="matrix(-1 0 0 1 31 64.4404)" fill="#406896" />
            <circle cx="3" cy="3" r="3" transform="matrix(-1 0 0 1 6 64.4404)" fill="#406896" />
            <circle cx="3" cy="3" r="3" transform="matrix(-1 0 0 1 131 1.44043)" fill="#406896" />
          </svg>
          <p className="text-[#8E8C84] text-sm mt-2 font-tajawal">نمو المشاهدات بالأيام الماضية</p>
        </div>
      </div>
      <hr className="my-6 border-gray-200" />
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="flex flex-col items-start">
          <p className="font-normal text-[12px] text-[#8E8C84]">جميع المشاهدات</p>
          <p className="font-bold text-[18px] text-gray-800 my-2">{data?.all_time_views || 0} مشاهدة</p>
          <div className="inline-block bg-[#F9F9F8] rounded-md px-3 py-1.5 text-xs text-[#8E8C84] font-tajawal">
            هذه السنة {data?.current_year_views || 0} مشاهدة
          </div>
        </div>
        <div className="flex flex-col items-start">
          <p className="font-normal text-[12px] text-[#8E8C84]">مشاهدات اليوم</p>
          <p className="font-bold text-[18px] text-gray-800 my-2">{data?.current_day_views || 0} مشاهدة</p>
          <div className="inline-block bg-[#F9F9F8] rounded-md px-3 py-1.5 text-xs text-[#8E8C84] font-tajawal">
            مشاهدات الامس {data?.yesterday_views || 0} مشاهدة
          </div>
        </div>
      </div>
    </div>
  );
};

interface MerchantContentAnalytics {
  totalProducts: number;
  favoriteProducts: number;
  inCompareProducts: number;
  converSation: number;
  totalOrders: number;
  totalCompletedOrders: number;
  totalCanceledOrders: number;
  productsGrowthChart: { date: string; count: number }[];
}

interface FollowersStatsProps {
  data?: MerchantContentAnalytics;
}

const FollowersStats = ({ data }: FollowersStatsProps) => {
  // Create followers data based on the merchant content analytics
  const followersData = {
    totalProducts: data?.totalProducts || 0,
    favoriteProducts: data?.favoriteProducts || 0,
    inCompareProducts: data?.inCompareProducts || 0,
    converSation: data?.converSation || 0,
    totalOrders: data?.totalOrders || 0,
    totalCompletedOrders: data?.totalCompletedOrders || 0,
    totalCanceledOrders: data?.totalCanceledOrders || 0,
  };

  const totalFollowers = Object.values(followersData).reduce((sum, count) => sum + count, 0);

  const chartData = Object.entries(followersData).map(([key, value]) => ({
    category: key,
    value: value,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 w-full  mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        {" "}
        <div className="text-right">
          <p className="text-sm text-gray-400">احصائيات</p>
          <h2 className="text-lg font-bold text-gray-800">إحصائيات المتجر ( {totalFollowers} )</h2>
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2">
          {" "}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="text-sm text-gray-700">هذا الشهر</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="category"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            dy={10}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 14 }} />
          <Tooltip cursor={{ fill: "rgba(224, 231, 255, 0.5)" }} />
          <Bar dataKey="value" fill="#4338CA" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { FollowersStats, WatchStats };
