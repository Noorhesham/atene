import MaxWidthDashboard from "./MaxWidthDashboard";
import CustomerDistributionChart from "./PieChartHome";
import StatsDashboard from "./StatsDashboard";
import { WatchStats, FollowersStats } from "./Dash1";
import { Button } from "@/components/ui/button";

const DashboardHome = () => {
  // Sample data for charts

  const tableData = [
    { id: 1, name: "محمد أحمد", email: "mohamed@email.com", phone: "123456789", status: "نشط", amount: "250.00" },
    { id: 2, name: "فاطمة علي", email: "fatema@email.com", phone: "987654321", status: "نشط", amount: "180.00" },
    { id: 3, name: "أحمد محمود", email: "ahmed@email.com", phone: "456789123", status: "غير نشط", amount: "320.00" },
    { id: 4, name: "سارة حسن", email: "sara@email.com", phone: "789123456", status: "نشط", amount: "150.00" },
    { id: 5, name: "عمر خالد", email: "omar@email.com", phone: "321654987", status: "نشط", amount: "290.00" },
  ];

  const customers = [
    { id: 1, name: "عبد الله محمد", email: "abdullah@email.com", phone: "123456789", orders: 5, amount: "1,250.00" },
    { id: 2, name: "مريم أحمد", email: "mariam@email.com", phone: "987654321", orders: 3, amount: "850.00" },
    { id: 3, name: "يوسف علي", email: "youssef@email.com", phone: "456789123", orders: 8, amount: "2,100.00" },
    { id: 4, name: "نور الدين", email: "nour@email.com", phone: "789123456", orders: 2, amount: "420.00" },
    { id: 5, name: "ليلى حسن", email: "layla@email.com", phone: "321654987", orders: 6, amount: "1,680.00" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 " dir="rtl">
      <MaxWidthDashboard className="w-full mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col gap-6">
            <StatsDashboard /> <CustomerDistributionChart />
          </div>
          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Line Chart */}
            <div className="flex  px-20 py-10 bg-[#f6edd6] relative items-center flex-col gap-6">
              <img src="/image 22.svg" alt="" />
              <p className=" text-[#AAA] text-[18px] text-center">نقاطك الحالية</p>
              <span className="text-[#444] text-[32px] font-bold">0 نقطة </span>
              <Button className=" bg-gradient-to-l w-full from-[#FFCA67] to-[#FFA600]">شراء النقط</Button>
            </div>
            <WatchStats />

            {/* Bar Chart */}
            <FollowersStats />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">الطلبات الأخيرة</h2>
            <div className="space-y-3">
              {tableData.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.email}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{item.amount} ريال</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "نشط" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">أفضل العملاء</h2>
            <div className="space-y-3">
              {customers.map((customer) => (
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">جدول البيانات التفصيلي</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الرقم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المبلغ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "نشط" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount} ريال</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </MaxWidthDashboard>
    </div>
  );
};
export default DashboardHome;
