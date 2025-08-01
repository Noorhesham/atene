import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { useAuth } from "@/context/AuthContext";
import type { EntityTypeMap } from "@/types";

const getEntityActionLabel = (
  entityType: keyof EntityTypeMap | string,
  action: "approve" | "edit" | "delete"
): string => {
  const entityLabels: Record<string, { approve: string; edit: string; delete: string }> = {
    stores: {
      approve: "موافقة المتجر",
      edit: "تعديل بيانات المتجر",
      delete: "حذف المتجر",
    },
    roles: {
      approve: "تفعيل الدور",
      edit: "تعديل الدور",
      delete: "حذف الدور",
    },
    users: {
      approve: "تفعيل المستخدم",
      edit: "تعديل بيانات المستخدم",
      delete: "حذف المستخدم",
    },
    products: {
      approve: "تفعيل المنتج",
      edit: "تعديل بيانات المنتج",
      delete: "حذف المنتج",
    },
    categories: {
      approve: "تفعيل الفئة",
      edit: "تعديل الفئة",
      delete: "حذف الفئة",
    },
    attributes: {
      approve: "تفعيل الخاصية",
      edit: "تعديل الخاصية",
      delete: "حذف الخاصية",
    },
  };

  return entityLabels[entityType]?.[action] || `${action} العنصر`;
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  to?: string;
}

interface BaseEntity {
  id: number;
  name?: string;
  title?: string;
  status?: string;
  slug?: string;
  type?: string;
  [key: string]: string | number | undefined;
}

interface ActionsProps {
  title: string;
  isActive?: boolean;
  onApprove?: () => void;
  editLink?: string;
  isUpdating?: boolean;
  className?: string;
  customActions?: React.ReactNode;
  // New props for entity deletion
  entity?: BaseEntity;
  entityType?: keyof EntityTypeMap;
  deleteMessage?: string;
  onDeleteSuccess?: () => void;
}

const ActionButton = ({
  icon,
  label,
  onClick,
  variant = "default",
  className = "",
  disabled,
  loading,
  to,
}: ActionButtonProps) => {
  const ButtonContent = (
    <Button className={`w-full ${className}`} variant={variant} onClick={onClick} disabled={disabled || loading}>
      {icon} {loading ? "جاري المعالجة..." : label}
    </Button>
  );

  if (to) {
    return (
      <Link to={to} className="w-full">
        {ButtonContent}
      </Link>
    );
  }

  return ButtonContent;
};

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  entity,
  entityType,
  deleteMessage,
  onDeleteSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  entity: BaseEntity;
  entityType: keyof EntityTypeMap;
  deleteMessage?: string;
  onDeleteSuccess?: () => void;
}) => {
  const { user } = useAuth();
  const userType = useMemo(() => (user?.user?.user_type === "admin" ? "admin" : "dashboard"), [user]);
  const entityQuery = useAdminEntityQuery(entityType, {}, userType);
  const { remove, isDeleting } = entityQuery;

  const entityName = entity.name || entity.title || `العنصر #${entity.id}`;

  const handleDelete = async () => {
    try {
      await remove(entity.id);
      onDeleteSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to delete entity:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center">تأكيد حذف {entityType === "roles" ? "الدور" : "العنصر"}</DialogTitle>
          <DialogDescription className="text-center">
            {deleteMessage || `هل أنت متأكد من حذف "${entityName}"؟`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <Trash2 size={32} className="text-red-600" />
          </div>

          <p className="text-gray-600 text-center mb-2">
            سيتم حذف: <span className="font-medium">{entityName}</span>
          </p>

          <p className="text-red-600 text-sm text-center mb-8">لا يمكن التراجع عن هذا الإجراء وسيتم الحذف نهائياً</p>

          <div className="flex gap-3 w-full max-w-sm">
            <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isDeleting}>
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Actions = ({
  title,
  isActive = false,
  onApprove,
  editLink,
  isUpdating = false,
  className = "",
  customActions,
  entity,
  entityType,
  deleteMessage,
  onDeleteSuccess,
}: ActionsProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();

  // Determine user type and format edit link accordingly
  const userType = useMemo(() => (user?.user?.user_type === "admin" ? "admin" : "dashboard"), [user]);
  const formattedEditLink = useMemo(() => {
    if (!editLink) return undefined;

    // Remove any existing /admin/ or /merchant/ from the path
    const cleanPath = editLink.replace(/\/(admin|merchant)\//g, "/");

    // Add the correct prefix based on user type
    return `/${userType}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
  }, [editLink, userType]);

  const handleDeleteClick = () => {
    if (entity && entityType) {
      setShowDeleteModal(true);
    }
  };
  /**
   * page edit
   *  edit left
   * هيكله تنظيم فبيدج
   */
  return (
    <div className="">
      <Card className={`border grid grid-cols-1 md:grid-cols-3 w-full  gap-4 border-gray-200 shadow-sm ${className}`}>
        <CardContent className="p-6 ">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

          <div className="flex gap-3">
            {!isActive && onApprove && (
              <ActionButton
                icon={<Check size={16} className="ml-2" />}
                label={getEntityActionLabel(entityType || "stores", "approve")}
                onClick={onApprove}
                className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-lg px-4 py-2 text-sm font-medium"
                disabled={isUpdating}
                loading={isUpdating}
              />
            )}

            {formattedEditLink && (
              <ActionButton
                icon={<Edit size={16} className="ml-2" />}
                label={getEntityActionLabel(entityType || "stores", "edit")}
                className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg px-4 py-2 text-sm font-medium"
                to={formattedEditLink}
              />
            )}

            {entity && entityType && (
              <ActionButton
                icon={<Trash2 size={16} className="ml-2" />}
                label={getEntityActionLabel(entityType, "delete")}
                onClick={handleDeleteClick}
                className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg px-4 py-2 text-sm font-medium"
              />
            )}

            {customActions}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {entity && entityType && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          entity={entity}
          entityType={entityType}
          deleteMessage={deleteMessage}
          onDeleteSuccess={onDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Actions;
