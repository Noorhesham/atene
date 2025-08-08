import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { RefreshCw } from "lucide-react";

export const ReportsTable = ({ onSelectReport }: { onSelectReport: (report: any) => void }) => {
  const { data: reports, isLoading, totalRecords } = useAdminEntityQuery("reports");

  const getStatusChip = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">تحت المراجعة</span>
        );
      default:
        return <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const timePart = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    return `${datePart} - ${timePart}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold">بلاغات الزبائن ({totalRecords})</h2>
          <p className="text-sm text-gray-500">بلاغات مقدمة من الزبائن ضد (تاجر، منتج، أو النظام)</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RefreshCw className="w-4 h-4" />
          <span>تصفية</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="text-gray-500 bg-gray-50">
            <tr>
              {[
                "رقم الشكوي",
                "العميل",
                "نوع البلاغ",
                "ضد من",
                "القسم",
                "تم الانشاء",
                "تاريخ الانشاء",
                "حالة الشكوي",
              ].map((header) => (
                <th key={header} className="p-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="p-4 text-center">
                  جاري تحميل البلاغات...
                </td>
              </tr>
            ) : (
              reports.map((report: any) => (
                <tr key={report.id} onClick={() => onSelectReport(report)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="p-3 font-medium text-gray-800">#{report.id}</td>
                  <td className="p-3 text-gray-700">{report.user}</td>
                  <td className="p-3 text-gray-700">{report.type}</td>
                  <td className="p-3 text-blue-600 font-semibold">{report.store}</td>
                  <td className="p-3 text-gray-700">الشحن</td>
                  <td className="p-3 text-gray-700">منذ يومين</td>
                  <td className="p-3 text-gray-700">{formatDate(report.created_at!)}</td>
                  <td className="p-3">{getStatusChip(report.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
