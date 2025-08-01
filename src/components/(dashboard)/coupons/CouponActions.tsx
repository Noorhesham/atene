import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { ApiCoupon } from "@/hooks/useUsers";
import { useCoupons } from "@/hooks/useCoupons";
import ModalCustom from "@/components/ModalCustom";
import { AddCouponForm } from "./CouponForm";

interface CouponActionsProps {
  coupon: ApiCoupon;
  onDeleteSuccess?: () => void;
  editLink?: string;
}

export const CouponActions = ({ coupon, onDeleteSuccess, editLink }: CouponActionsProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { remove, isDeleting } = useCoupons();

  const handleDelete = async () => {
    try {
      await remove(coupon.id);
      onDeleteSuccess?.();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete coupon:", error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {editLink && (
          <ModalCustom
            btn={
              <Button variant="ghost" size="icon" className="w-8 h-8 text-main bg-blue-50 hover:bg-blue-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </Button>
            }
            content={
              <AddCouponForm
                closeModal={() => setShowDeleteModal(false)}
                editingCoupon={{
                  id: coupon.id,
                  code: coupon.code,
                  type: coupon.type,
                  value: coupon.value,
                  start_date: coupon.start_date,
                  end_date: coupon.end_date,
                  categories: coupon.categories,
                  products: coupon.products,
                  store_id: coupon.store_id || undefined,
                  store: coupon.store,
                }}
              />
            }
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-red-500 bg-red-50 hover:bg-red-100"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">تأكيد حذف الكوبون</DialogTitle>
            <DialogDescription className="text-center">هل أنت متأكد من حذف الكوبون "{coupon.code}"؟</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <Trash2 size={32} className="text-red-600" />
            </div>

            <p className="text-gray-600 text-center mb-2">
              سيتم حذف: <span className="font-medium">{coupon.code}</span>
            </p>

            <p className="text-red-600 text-sm text-center mb-8">لا يمكن التراجع عن هذا الإجراء وسيتم الحذف نهائياً</p>

            <div className="flex gap-3 w-full max-w-sm">
              <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
