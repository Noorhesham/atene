import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiReport } from "@/types";
import { useState } from "react";
import { Loader2, Trash2, FileText, User, Calendar, Hash, Paperclip, MessageSquare, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const SingleReportView = ({ report, onBack }: { report: ApiReport; onBack: () => void }) => {
  const { remove, isDeleting } = useAdminEntityQuery("reports");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      await remove(report.id);
      onBack(); // Go back to the list after successful deletion
    } catch (error) {
      console.error("Failed to delete report:", error);
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
    <div className="flex items-center gap-3 text-sm py-3 border-b last:border-none">
      <div className="text-gray-500">{icon}</div>
      <span className="text-gray-500 w-28">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6" dir="rtl">
      <header className="flex justify-between items-center pb-4 border-b mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">شكوي رقم: {report.id}</h2>
          <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">تحت المراجعة</span>
          <span className="text-sm text-gray-500">قسم الشكوي: الشحن</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 disabled:bg-red-300"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            حذف الشكوي
          </button>
          {/* Status dropdown can be added here */}
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
          <InfoRow icon={<FileText className="w-5 h-5" />} label="نوع الشكوي" value={report.type} />
          <InfoRow icon={<User className="w-5 h-5" />} label="العميل" value={report.user || "غير محدد"} />
          <InfoRow
            icon={<Calendar className="w-5 h-5" />}
            label="تاريخ الشكوي"
            value={new Date(report.created_at!).toLocaleString("ar-EG")}
          />
          <InfoRow icon={<Hash className="w-5 h-5" />} label="رقم الطلب" value={report.order_id || "غير محدد"} />
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3">هنا مثال لوصف المشكلة</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{report.content}</p>
        </div>

        <div className="mb-6">
          <InfoRow
            icon={<Paperclip className="w-5 h-5" />}
            label="المرفقات"
            value={
              <div className="flex items-center gap-2">
                {Array.isArray(report.media) && report.media.length > 0 ? (
                  report.media.map((file: { name: string }, index: number) => (
                    <a
                      key={index}
                      href="#"
                      className="text-xs flex items-center gap-1 bg-gray-100 border px-2 py-1 rounded-md text-gray-700 hover:bg-gray-200"
                    >
                      {file.name}
                    </a>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">لا توجد مرفقات</span>
                )}
              </div>
            }
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> اضافة رد...
          </h4>
          <textarea
            className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="اكتب ردك هنا..."
          ></textarea>
          <div className="flex justify-between items-center mt-3">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              اضافة
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
              <Paperclip className="w-4 h-4" />
              ارفاق ملفات
            </button>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
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
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  حذف الشكوى
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
