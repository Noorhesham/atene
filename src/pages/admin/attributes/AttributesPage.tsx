import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiAttribute, ApiAttributeOption } from "@/types";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ModalCustom from "@/components/ModalCustom";

interface AttributeWithOptions extends ApiAttribute {
  options?: ApiAttributeOption[];
}

const AttributeCard: React.FC<{
  attribute: AttributeWithOptions;
  setAttributeToDelete: (attribute: AttributeWithOptions | null) => void;
}> = ({ attribute, setAttributeToDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {attribute.options && attribute.options.length > 0 && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 hover:text-gray-700">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{attribute.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={attribute.status === "active" ? "default" : "secondary"}>
                {attribute.status === "active" ? "نشط" : "غير نشط"}
              </Badge>
              {attribute.options && <span className="text-sm text-gray-500">{attribute.options.length} خيار</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/admin/attributes/edit/${attribute.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAttributeToDelete(attribute)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Options List */}
      {isExpanded && attribute.options && attribute.options.length > 0 && (
        <div className="mt-4 mr-7 space-y-2">
          <h4 className="text-sm font-medium text-gray-600">الخيارات المتاحة:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {attribute.options.map((option) => (
              <div key={option.id} className="p-2 bg-gray-50 rounded border text-sm">
                {option.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

const AttributesPage: React.FC = () => {
  const [attributeToDelete, setAttributeToDelete] = useState<AttributeWithOptions | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    data: attributes = [],
    isLoading,
    error,
    refetch,
    remove: deleteAttribute,
  } = useAdminEntityQuery("attributes");

  const handleDelete = async (id: number) => {
    await deleteAttribute(id);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">خطأ في تحميل البيانات: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة خصائص المنتجات</h1>
          <p className="text-gray-600">إدارة خصائص المنتجات مثل اللون، الحجم، الوزن وغيرها</p>
        </div>
        <Link to="/admin/attributes/add">
          <Button className="bg-main hover:bg-main/90">
            <Plus className="w-4 h-4 ml-2" />
            إضافة خاصية جديدة
          </Button>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      <ModalCustom
        isOpen={!!attributeToDelete}
        onOpenChange={(open) => !open && setAttributeToDelete(null)}
        title="تأكيد حذف الخاصية"
        btn={<></>}
        content={
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <Trash2 size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">هل أنت متأكد من حذف هذه الخاصية؟</h3>
            {attributeToDelete && (
              <p className="text-gray-600 text-center mb-2">
                سيتم حذف الخاصية: <span className="font-medium">{attributeToDelete.title}</span>
              </p>
            )}
            <p className="text-red-600 text-sm text-center mb-8">
              لا يمكن التراجع عن هذا الإجراء وسيتم حذف الخاصية نهائياً
            </p>
            <div className="flex gap-3 w-full max-w-sm">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={async () => {
                  if (!attributeToDelete) return;
                  setIsDeleting(true);
                  try {
                    await handleDelete(attributeToDelete.id);

                    setAttributeToDelete(null);
                  } catch (error) {
                    console.error("Failed to delete attribute:", error);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting}
              >
                {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setAttributeToDelete(null)}
                disabled={isDeleting}
              >
                إلغاء
              </Button>
            </div>
          </div>
        }
      />

      {/* Attributes List */}
      <div className="space-y-4">
        {attributes.length > 0 ? (
          attributes.map((attribute: AttributeWithOptions) => (
            <AttributeCard key={attribute.id} attribute={attribute} setAttributeToDelete={setAttributeToDelete} />
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">لا توجد خصائص بعد</p>
            <Link to="/admin/attributes/add">
              <Button className="bg-main hover:bg-main/90">
                <Plus className="w-4 h-4 ml-2" />
                إضافة أول خاصية
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AttributesPage;
