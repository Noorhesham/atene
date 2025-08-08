import { useState } from "react";
import { ArrowRight, HelpCircle } from "lucide-react";
import { SingleReportView } from "./SingleReportView";
import { ReportsTable } from "./ReportsTable";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("customers");
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const handleSelectReport = (report: any) => {
    setSelectedReport(report);
  };

  const handleBackToList = () => {
    setSelectedReport(null);
  };

  return (
    <div className="p-4 w-full sm:p-8 bg-gray-100 min-h-screen" dir="rtl">
      <header className="mb-6">
        {selectedReport ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={handleBackToList} className="flex items-center gap-1 hover:text-gray-800">
              <ArrowRight className="w-4 h-4" />
              <span>الشكاوي</span>
            </button>
            <span>/</span>
            <span>بلاغات الزبائن</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">{selectedReport.id}</span>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm font-semibold">
              {["بلاغات الزبائن", "بلاغات المتاجر", "بلاغات المنتجات"].map((tab, index) => (
                <button
                  key={tab}
                  className={`py-2 px-1 ${index === 0 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
              <HelpCircle className="w-4 h-4" />
              <span>مساعدة</span>
            </button>
          </div>
        )}
      </header>

      {selectedReport ? (
        <SingleReportView report={selectedReport} onBack={handleBackToList} />
      ) : (
        <ReportsTable onSelectReport={handleSelectReport} />
      )}
    </div>
  );
}
