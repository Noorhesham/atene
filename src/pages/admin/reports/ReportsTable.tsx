import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { RefreshCw } from "lucide-react";

export const ReportsTable = ({ onSelectReport }: { onSelectReport: (report: any) => void }) => {
  const { data: reports, isLoading, totalRecords } = useAdminEntityQuery("reports");

  const getStatusChip = (status: string) => {
    switch (status) {
      case "processing":
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
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 15C8.46574 15.621 9.06966 16.125 9.76393 16.4721C10.4582 16.8193 11.2238 17 12 17C12.7762 17 13.5418 16.8193 14.2361 16.4721C14.9303 16.125 15.5343 15.621 16 15M8.009 9H8M16 9H15.991"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h2 className="text-lg font-bold">بلاغات الزبائن ({totalRecords})</h2>
          </div>
          <p className="text-sm text-gray-500">بلاغات مقدمة من الزبائن ضد (تاجر، منتج، أو النظام)</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5.83325 17.5V15M5.83325 15C5.05659 15 4.66825 15 4.36242 14.8733C4.16007 14.7896 3.97621 14.6668 3.82135 14.5119C3.6665 14.357 3.54368 14.1732 3.45992 13.9708C3.33325 13.665 3.33325 13.2767 3.33325 12.5C3.33325 11.7233 3.33325 11.335 3.45992 11.0292C3.54368 10.8268 3.6665 10.643 3.82135 10.4881C3.97621 10.3332 4.16007 10.2104 4.36242 10.1267C4.66825 10 5.05659 10 5.83325 10C6.60992 10 6.99825 10 7.30409 10.1267C7.50643 10.2104 7.69029 10.3332 7.84515 10.4881C8.00001 10.643 8.12282 10.8268 8.20658 11.0292C8.33325 11.335 8.33325 11.7233 8.33325 12.5C8.33325 13.2767 8.33325 13.665 8.20658 13.9708C8.12282 14.1732 8.00001 14.357 7.84515 14.5119C7.69029 14.6668 7.50643 14.7896 7.30409 14.8733C6.99825 15 6.60992 15 5.83325 15ZM14.1666 17.5V12.5M14.1666 5V2.5M14.1666 5C13.3899 5 13.0016 5 12.6958 5.12667C12.4934 5.21043 12.3095 5.33325 12.1547 5.4881C11.9998 5.64296 11.877 5.82682 11.7933 6.02917C11.6666 6.335 11.6666 6.72333 11.6666 7.5C11.6666 8.27667 11.6666 8.665 11.7933 8.97083C11.877 9.17318 11.9998 9.35704 12.1547 9.5119C12.3095 9.66675 12.4934 9.78957 12.6958 9.87333C13.0016 10 13.3899 10 14.1666 10C14.9433 10 15.3316 10 15.6374 9.87333C15.8398 9.78957 16.0236 9.66675 16.1785 9.5119C16.3333 9.35704 16.4562 9.17318 16.5399 8.97083C16.6666 8.665 16.6666 8.27667 16.6666 7.5C16.6666 6.72333 16.6666 6.335 16.5399 6.02917C16.4562 5.82682 16.3333 5.64296 16.1785 5.4881C16.0236 5.33325 15.8398 5.21043 15.6374 5.12667C15.3316 5 14.9433 5 14.1666 5ZM5.83325 7.5V2.5"
              stroke="#393939"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>{" "}
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
                <th key={header} className="p-3 text-black font-semibold">
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
                  <td className="p-3 font-medium text-black underline">#{report.id}</td>
                  <td className="p-3 text-black underline">{report.user}</td>
                  <td className="p-3 text-black underline">{report.type}</td>
                  <td className="p-3 underline font-semibold">{report.store}</td>
                  <td className="p-3 text-black underline">الشحن</td>
                  <td className="p-3 text-black">منذ يومين</td>
                  <td className="p-3 text-black">{formatDate(report.created_at!)}</td>
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
