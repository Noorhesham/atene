// src/components/DashboardHome.tsx
import MaxWidthDashboard from "./MaxWidthDashboard";
import StatsDashboard from "./StatsDashboard";
import { WatchStats, FollowersStats } from "./Dash1";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useAnalyticsQuery } from "@/hooks/useAnalyticsMerchant";
import { CustomerOriginAnalytics } from "@/pages/admin/analysis/AdminAnalysis";
import { ArrowLeft, RefreshCw, TrendingUp, ChevronLeft } from "lucide-react";

// Define the merchant analytics types based on the API response
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

interface MerchantAnalyticsData {
  current_month_views: number;
  last_month_views: number;
  current_day_views: number;
  yesterday_views: number;
  current_week_views: number;
  all_time_views: number;
  current_year_views: number;
}

interface OrderItem {
  id: number;
  product_id: number;
  product: any;
  variation_id: number | null;
  variation: any;
  quantity: number;
  price: number;
  price_after_discount: number;
}

interface LatestOrder {
  id: number;
  reference_id: string;
  status: string;
  client_id: number;
  client: {
    id: number;
    avatar: string | null;
    avatar_url: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_active: number;
    date_of_birth: string | null;
    gender: string;
    referral_code: string | null;
    verified_code: string | null;
    last_login_at: string;
  };
  name: string;
  email: string;
  phone: string;
  notes: string;
  address: string;
  sub_total: number;
  discount_total: number;
  shipping_cost: number;
  total: number;
  items: OrderItem[];
  created_at?: string;
}

// Static most viewed products data
const mostViewedProducts = [
  {
    id: 1,
    name: "تيشرت صيفي مميز",
    image: "https://aatene.com/storage/gallery/p14zTryVxjC299pKXJE0jrY59KU9G6g3e6PRtdtH.png",
    views: 150,
    isTop: true,
  },
  {
    id: 2,
    name: "بنطلون اسود",
    image: "https://aatene.com/storage/gallery/BPB6esp7lBEHXvm05CATJuFD0lHsWuQvhSYUKitn.png",
    views: 50,
    isTop: false,
  },
  {
    id: 3,
    name: "بنطلوب كلاسيك ابيض",
    image: "https://aatene.com/storage/gallery/bjwQMmwFB2igF32DmyM4qUMD1Kmg9ZwcpmWLiSFt.png",
    views: 40,
    isTop: false,
  },
];

const DashboardHome = () => {
  const period = "current_month";

  // Fetch all necessary analytics data with period parameter
  const { data: contentData, isLoading: isLoadingContent } = useAnalyticsQuery("content", period);
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useAnalyticsQuery("analytics");
  const { data: latestsData, isLoading: isLoadingLatests } = useAnalyticsQuery("latests");

  // Memoize processed data to prevent re-renders
  const latestsOrders = useMemo(() => latestsData?.latestsOrders || [], [latestsData]);

  // Handle loading state for the entire page
  if (isLoadingContent || isLoadingAnalytics || isLoadingLatests) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // Helper function to get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-[#F1F5F9] text-[#4A4A4A] rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            جاري التجهيز
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            مكتملة
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            ملغية
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            {status}
          </span>
        );
    }
  };

  // Helper function to format time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "اليوم";
    if (diffInDays === 1) return "منذ يوم";
    if (diffInDays < 30) return `منذ ${diffInDays} أيام`;
    if (diffInDays < 60) return "منذ شهر";
    if (diffInDays < 90) return "منذ شهرين";
    return `منذ ${Math.floor(diffInDays / 30)} أشهر`;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50" dir="rtl">
      <MaxWidthDashboard className="w-full mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 mb-8">
          <div className="flex flex-col  col-span-5 gap-6">
            <StatsDashboard data={contentData as unknown as MerchantContentAnalytics} />
            <CustomerOriginAnalytics />
          </div>

          <div className="grid grid-cols-1 col-span-3 gap-6">
            <div className="flex px-20 py-10 bg-[#f6edd6] relative items-center flex-col gap-6">
              <img src="/image 22.svg" alt="Points" />
              <p className="text-[#AAA] text-[18px] text-center">نقاطك الحالية</p>
              <span className="text-[#444] text-[32px] font-bold">0 نقطة</span>
              <Button className="bg-gradient-to-l w-full from-[#FFCA67] to-[#FFA600]">شراء النقاط</Button>
            </div>
            <WatchStats
              data={analyticsData as unknown as MerchantAnalyticsData}
              chartData={(contentData as unknown as MerchantContentAnalytics)?.productsGrowthChart}
            />
            <FollowersStats data={contentData as unknown as MerchantContentAnalytics} />
          </div>
        </div>

        {/* Latest Orders and Most Viewed Products Section */}
        <div className=" grid grid-cols-6 gap-6 mb-8">
          {" "}
          {/* Most Viewed Products Section */}
          <div className=" w-full col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-gray-900">الأكثر مشاهدة</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">قائمة المنتجات التي حققت أكثر مبيعات</p>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mostViewedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                    {index + 1}
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600">عدد المشاهدات {product.views} مشاهدة</span>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          product.isTop ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.views} مشاهدة
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll indicators */}
            <div className="flex justify-center mt-4 space-x-1">
              {[1, 2, 3].map((i) => (
                <ChevronLeft key={i} className="w-4 h-4 text-gray-400" />
              ))}
            </div>
          </div>
          {/* Latest Orders Section */}
          <div className="w-full col-span-4 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="العودة للصفحة السابقة"
                  aria-label="العودة للصفحة السابقة"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">احدث الطلبات ({latestsOrders.length})</h2>
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="تحديث البيانات"
                aria-label="تحديث البيانات"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">رقم الطلب</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">حالة الطلب</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">العميل</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">تم الانشاء</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">تاريخ الانشاء</th>
                  </tr>
                </thead>
                <tbody>
                  {latestsOrders.slice(0, 5).map((order: LatestOrder) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium  text-black underline">#{order.reference_id}</td>
                      <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {order.name ||
                          `${order.client?.first_name || ""} ${order.client?.last_name || ""}`.trim() ||
                          "غير محدد"}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {order.created_at ? getTimeAgo(order.created_at) : "غير محدد"}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {order.created_at ? formatDate(order.created_at) : "غير محدد"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </MaxWidthDashboard>
    </div>
  );
};
export default DashboardHome;
