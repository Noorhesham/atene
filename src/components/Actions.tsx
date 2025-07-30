import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

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

interface ActionsProps {
  title: string;
  isActive?: boolean;
  onApprove?: () => void;
  onDelete?: () => void;
  editLink?: string;
  isUpdating?: boolean;
  className?: string;
  customActions?: React.ReactNode;
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

const Actions = ({
  title,
  isActive = false,
  onApprove,
  onDelete,
  editLink,
  isUpdating = false,
  className = "",
  customActions,
}: ActionsProps) => {
  return (
    <Card className={`mb-4 ${className}`}>
      <CardContent className="flex gap-3 flex-col">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <div className="flex justify-between w-full items-center mb-4 px-1">
          <div className="grid lg:grid-cols-3 grid-cols-2 w-full items-center gap-2">
            {!isActive && onApprove && (
              <ActionButton
                icon={<Check size={16} />}
                label="موافقة"
                onClick={onApprove}
                className="hover:text-main bg-main text-white"
                disabled={isUpdating}
                loading={isUpdating}
              />
            )}

            {editLink && (
              <ActionButton
                icon={<Edit size={16} />}
                label="تعديل البيانات"
                className="hover:text-main bg-blue-200 text-main"
                to={editLink}
              />
            )}

            {onDelete && (
              <ActionButton
                icon={<Trash2 size={16} />}
                label="حذف"
                onClick={onDelete}
                variant="destructive"
                className="bg-red-500 text-white"
              />
            )}

            {customActions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Actions;
