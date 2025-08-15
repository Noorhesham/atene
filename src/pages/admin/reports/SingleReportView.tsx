import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiReport } from "@/types";
import { useState } from "react";
import {
  Loader2,
  Trash2,
  FileText,
  User,
  Calendar,
  Hash,
  Paperclip,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_BASE_URL } from "@/constants/api";
import toast from "react-hot-toast";

export const SingleReportView = ({ report, onBack }: { report: ApiReport; onBack: () => void }) => {
  const { remove, isDeleting } = useAdminEntityQuery("reports");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleDelete = async () => {
    try {
      await remove(report.id);
      onBack(); // Go back to the list after successful deletion
    } catch (error) {
      console.error("Failed to delete report:", error);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/admin/reports/${report.id}/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success("تم تحديث حالة الشكوى بنجاح");
      // Optionally refresh the report data or update the local state
    } catch (error) {
      console.error("Failed to update report status:", error);
      toast.error("فشل في تحديث حالة الشكوى");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "finished":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "processing":
        return "قيد المعالجة";
      case "finished":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div className="flex items-center  w-fit gap-6 py-4 border-b border-gray-100 last:border-none">
      <div className="flex items-center gap-3 text-sm">
        <div className="text-black">{icon}</div>
        <span className="font-semibold text-black">{label}</span>
      </div>
      <div className="flex-1 text-left text-sm font-semibold text-black">{value}</div>
    </div>
  );

  // This is the styled file attachment component
  const FileAttachment = ({ name, type }: { name: string; type: "image" | "pdf" | "doc" }) => (
    <a
      href="#"
      className="flex items-center gap-2 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors"
    >
      {type === "image" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      )}
      {type !== "image" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M10 12v-1h4v1" />
          <path d="M10 18v-2h4v2" />
          <path d="M10 15h4" />
        </svg>
      )}
      <span>{name}</span>
      {type === "pdf" && <span className="text-[10px] bg-red-200 text-red-700 font-bold px-1 rounded-sm">PDF</span>}
      {type === "doc" && <span className="text-[10px] bg-blue-200 text-blue-700 font-bold px-1 rounded-sm">DOC</span>}
    </a>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-4" dir="rtl">
      {/* --- Header Section --- */}
      <div
        style={{ backgroundColor: "rgba(91, 135, 185, 0.1)" }}
        className=" rounded-lg p-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-main">شكوي رقم: {report.id}</h2>
            <div className="flex  gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">حالة الشكوي:</span>
                <span className="bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">تحت المراجعة</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">تصنيف الشكوي:</span>
                <span className="font-semibold text-gray-700">الشحن</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-red-100 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 text-sm font-semibold"
              >
                تحت المراجعة
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            {/* DropdownMenuContent would go here */}
          </DropdownMenu>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className="text-sm font-semibold"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Trash2 className="w-4 h-4 ml-2" />}
            حذف الشكوي
          </Button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="px-4 pt-4">
        <InfoRow
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path
                d="M17.5 5.5C18.3284 5.5 19 6.17157 19 7C19 7.82843 18.3284 8.5 17.5 8.5C16.6716 8.5 16 7.82843 16 7C16 6.17157 16.6716 5.5 17.5 5.5Z"
                stroke="#717171"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.99989 14.5005L9.99989 17.5005M2.77389 11.6445C1.77089 12.7645 1.74989 14.4545 2.66989 15.6445C4.4569 17.9643 6.5361 20.0435 8.85589 21.8305C10.0459 22.7505 11.7359 22.7295 12.8559 21.7265C15.8835 19.0183 18.7284 16.1126 21.3719 13.0285C21.6388 12.7217 21.8031 12.3392 21.8419 11.9345C22.0059 10.1385 22.3449 4.96447 20.9399 3.56047C19.5349 2.15647 14.3619 2.49447 12.5659 2.65947C12.1611 2.69825 11.7786 2.86258 11.4719 3.12947C8.38776 5.77268 5.48207 8.61724 2.77389 11.6445Z"
                stroke="#717171"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
          label="نوع الشكوي"
          value={report.type || "المنتج تم استلامه ولم يكن مطابق للوصف"}
        />
        <InfoRow
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path
                d="M11 13.5H16M8 13.5H8.009M13 17.5H8M16 17.5H15.991M18 2.5V4.5M6 2.5V4.5M3 8.5H21M2.5 12.743C2.5 8.386 2.5 6.207 3.752 4.853C5.004 3.5 7.02 3.5 11.05 3.5H12.95C16.98 3.5 18.996 3.5 20.248 4.854C21.5 6.207 21.5 8.386 21.5 12.744V13.257C21.5 17.614 21.5 19.793 20.248 21.147C18.996 22.5 16.98 22.5 12.95 22.5H11.05C7.02 22.5 5.004 22.5 3.752 21.146C2.5 19.793 2.5 17.614 2.5 13.256V12.743Z"
                stroke="#717171"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
          label="تاريخ الشكوي"
          value={new Date(report.created_at!).toLocaleString("en-GB").replace(",", "")}
        />
        <InfoRow
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.24597 7.5C7.24597 10.12 9.37597 12.25 11.996 12.25C14.616 12.25 16.746 10.12 16.746 7.5C16.746 4.88 14.616 2.75 11.996 2.75C9.37597 2.75 7.24597 4.88 7.24597 7.5ZM8.74597 7.5C8.74597 5.71 10.206 4.25 11.996 4.25C13.786 4.25 15.246 5.71 15.246 7.5C15.246 9.29 13.786 10.75 11.996 10.75C10.206 10.75 8.74597 9.29 8.74597 7.5ZM4.24597 19.5C4.24597 21.02 5.47597 22.25 6.99597 22.25H16.996C18.516 22.25 19.746 21.02 19.746 19.5C19.746 16.33 17.166 13.75 13.996 13.75H9.99597C6.82597 13.75 4.24597 16.33 4.24597 19.5ZM5.74597 19.5C5.74861 18.3736 6.19723 17.2942 6.99369 16.4977C7.79014 15.7013 8.86961 15.2526 9.99597 15.25H13.996C15.1223 15.2526 16.2018 15.7013 16.9983 16.4977C17.7947 17.2942 18.2433 18.3736 18.246 19.5C18.246 20.19 17.686 20.75 16.996 20.75H6.99597C6.30597 20.75 5.74597 20.19 5.74597 19.5Z"
                fill="#717171"
              />
            </svg>
          }
          label="العميل"
          value={report.user || "كيراس عادل"}
        />
        <InfoRow
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path
                d="M4 9.5H20M4 15.5H20M10 3.5L8 21.5M16 3.5L14 21.5"
                stroke="#717171"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
          label="رقم الطلب"
          value={report.order_id || "1234"}
        />
        <InfoRow
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14 3.3125C17.97 3.3125 19.97 3.3125 21.36 4.7025C22.75 6.0925 22.75 8.0825 22.75 12.0625V14.0625C22.75 18.0325 22.75 20.0325 21.36 21.4225C19.97 22.8125 17.97 22.8125 14 22.8125H10C6.03 22.8125 4.03 22.8125 2.64 21.4225C1.25 20.0325 1.25 18.0425 1.25 14.0625V12.0625C1.25 8.0925 1.25 6.0925 2.64 4.7025C4.03 3.3125 6.03 3.3125 10 3.3125H14ZM3.7 5.7625C2.75 6.7125 2.75 8.5025 2.75 12.0625H2.74V14.0625C2.74 15.5025 2.75 16.6525 2.81 17.5725L5.59 14.4525C6.28 13.6625 7.63 13.6225 8.37 14.3725L10 16.0025L14.13 11.8725C14.86 11.1425 16.18 11.1625 16.9 11.9325L21.23 16.6525C21.25 15.9125 21.25 15.0625 21.25 14.0625V12.0625C21.25 8.5025 21.25 6.7125 20.3 5.7625C19.35 4.8125 17.56 4.8125 14 4.8125H10C6.44 4.8125 4.65 4.8125 3.7 5.7625ZM10 21.3125H14V21.3025C17.56 21.3025 19.35 21.3025 20.3 20.3525C20.7 19.9625 20.93 19.4025 21.06 18.6425L20.95 18.5625L15.8 12.9425C15.64 12.7725 15.35 12.7625 15.19 12.9225L10.53 17.5825C10.25 17.8625 9.75 17.8625 9.47 17.5825L7.31 15.4225C7.27017 15.3847 7.2232 15.3551 7.17183 15.3356C7.12046 15.3161 7.06572 15.307 7.01081 15.3089C6.95589 15.3107 6.9019 15.3235 6.85197 15.3464C6.80204 15.3694 6.75718 15.402 6.72 15.4425L3.15 19.4625C3.28 19.8225 3.46 20.1225 3.7 20.3625C4.65 21.3125 6.44 21.3125 10 21.3125ZM10.75 9.5625C10.75 10.8025 9.74 11.8125 8.5 11.8125C7.26 11.8125 6.25 10.8025 6.25 9.5625C6.25 8.3225 7.26 7.3125 8.5 7.3125C9.74 7.3125 10.75 8.3225 10.75 9.5625ZM9.25 9.5625C9.25 9.1525 8.91 8.8125 8.5 8.8125C8.09 8.8125 7.75 9.1525 7.75 9.5625C7.75 9.9725 8.09 10.3125 8.5 10.3125C8.91 10.3125 9.25 9.9725 9.25 9.5625Z"
                fill="#717171"
              />
            </svg>
          }
          label="المرفقات"
          value={
            <div className="flex items-center gap-2">
              <FileAttachment name="image.png" type="image" />
              <FileAttachment name="doc.pdf" type="pdf" />
            </div>
          }
        />

        <div className="pt-6 text-sm text-gray-600 leading-relaxed">
          <p>
            {report.content ||
              "هنا مثال لوصف المشكلة ويمكن أن يكون هذا الوصف شامل وعميق لوصف المشكلة. هنا مثال لوصف المشكلة ويمكن أن يكون هذا الوصف شامل وعميق لوصف المشكلة."}
          </p>
        </div>
      </main>

      {/* Delete Confirmation Modal (kept from your original code) */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              تأكيد الحذف
            </DialogTitle>
            <DialogDescription className="text-right">
              هل أنت متأكد من حذف هذه الشكوى؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" /> حذف الشكوى
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
