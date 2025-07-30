import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdminEntityQuery, ApiAttribute, ApiAttributeOption } from "@/hooks/useUsersQuery";
import { Plus, Search, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface AttributeWithOptions extends ApiAttribute {
  options?: ApiAttributeOption[];
}

const AttributeCard: React.FC<{
  attribute: AttributeWithOptions;
  onDelete: (id: number) => void;
}> = ({ attribute, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`هل أنت متأكد من حذف الخاصية "${attribute.title}"؟`)) {
      try {
        await onDelete(attribute.id);
        toast.success("تم حذف الخاصية بنجاح");
      } catch (error) {
        toast.error("فشل في حذف الخاصية");
      }
    }
  };

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
          <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
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
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: attributes = [],
    isLoading,
    error,
    refetch,
    remove: deleteAttribute,
  } = useAdminEntityQuery("attributes", {
    queryParams: { search: searchQuery },
  });

  const handleSearch = () => {
    refetch();
  };

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

      {/* Attributes List */}
      <div className="space-y-4">
        {attributes.length > 0 ? (
          attributes.map((attribute: AttributeWithOptions) => (
            <AttributeCard key={attribute.id} attribute={attribute} onDelete={handleDelete} />
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
