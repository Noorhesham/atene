import { useState } from "react";
import { SingleReportView } from "./SingleReportView";
import { ReportsTable } from "./ReportsTable";
import { PageHeader } from "../PageHeader";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const handleSelectReport = (report: any) => {
    setSelectedReport(report);
  };

  const handleBackToList = () => {
    setSelectedReport(null);
  };

  return (
    <>
      <PageHeader
        navLinks={[{ label: "بلاغات الزبائن ", href: "/admin/reports" }]}
        helpButton={{ label: "مساعدة", href: "/admin/reports/help" }}
      />
      <div className="p-4 w-full sm:p-8 bg-gray-100 min-h-screen" dir="rtl">
        {selectedReport ? (
          <SingleReportView report={selectedReport} onBack={handleBackToList} />
        ) : (
          <ReportsTable onSelectReport={handleSelectReport} />
        )}
      </div>
    </>
  );
}
