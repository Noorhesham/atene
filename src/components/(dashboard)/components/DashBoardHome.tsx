// src/components/DashboardHome.tsx
import MaxWidthDashboard from "./MaxWidthDashboard";
import CustomerDistributionChart from "./PieChartHome";
import StatsDashboard from "./StatsDashboard";
import { WatchStats, FollowersStats } from "./Dash1";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useAnalyticsQuery } from "@/hooks/useAnalytics";

const DashboardHome = () => {
  // Fetch all necessary analytics data
  const { data: contentData, isLoading: isLoadingContent } = useAnalyticsQuery("content", "current_month");
  const { data: customersData, isLoading: isLoadingCustomers } = useAnalyticsQuery("customers", "current_month");
  const { data: overviewData, isLoading: isLoadingOverview } = useAnalyticsQuery("analytics");
  const { data: latestsData, isLoading: isLoadingLatests } = useAnalyticsQuery("latests");

  // Memoize processed data to prevent re-renders
  const latestsOrders = useMemo(() => latestsData?.latestsOrders || [], [latestsData]);
  const topCustomers = useMemo(() => {
    if (!latestsData?.latestsOrders) return [];
    // Creating a "Top Customers" list from recent orders as a placeholder
    const customerMap = new Map();
    latestsData.latestsOrders.forEach((order) => {
      if (order.client) {
        if (!customerMap.has(order.client.id)) {
          customerMap.set(order.client.id, {
            id: order.client.id,
            name: `${order.client.first_name || ""} ${order.client.last_name || ""}`.trim() || order.client.email,
            orders: 0,
            amount: 0,
          });
        }
        const customer = customerMap.get(order.client.id);
        customer.orders += 1;
        customer.amount += order.total;
      }
    });
    return Array.from(customerMap.values()).map((c) => ({ ...c, amount: c.amount.toFixed(2) }));
  }, [latestsData]);

  // Handle loading state for the entire page
  if (isLoadingContent || isLoadingCustomers || isLoadingOverview || isLoadingLatests) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50" dir="rtl">
      <MaxWidthDashboard className="w-full mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col gap-6">
            <StatsDashboard data={contentData} />
            <CustomerDistributionChart data={customersData?.customers} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex px-20 py-10 bg-[#f6edd6] relative items-center flex-col gap-6">
              <img src="/image 22.svg" alt="Points" />
              <p className="text-[#AAA] text-[18px] text-center">نقاطك الحالية</p>
              <span className="text-[#444] text-[32px] font-bold">0 نقطة</span>
              <Button className="bg-gradient-to-l w-full from-[#FFCA67] to-[#FFA600]">شراء النقاط</Button>
            </div>
            <WatchStats data={overviewData} chartData={contentData?.storesGrowthChart} />
            <FollowersStats data={customersData?.customers} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow-sm ">
            <h2 className="text-xl font-semibold mb-4">الطلبات الأخيرة</h2>
            <div className="space-y-3">
              {latestsOrders.slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{item.name || item.client.name}</p>
                    <p className="text-sm text-gray-600">{item.email}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{item.total} ريال</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white p-6 rounded-lg shadow-sm ">
            <h2 className="text-xl font-semibold mb-4">أبرز العملاء</h2>
            <div className="space-y-3">
              {topCustomers.slice(0, 5).map((customer) => (
                <div key={customer.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.orders} طلبات</p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{customer.amount} ريال</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MaxWidthDashboard>
    </div>
  );
};
export default DashboardHome;
