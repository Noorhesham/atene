import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { Section } from "@/types/product";
import ModalCustom from "@/components/ModalCustom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

const SectionCard: React.FC<{
  section: Section;
  onDelete: (id: number) => void;
}> = ({ section, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();
  const userType = user?.user?.user_type === "admin" ? "admin" : "merchant";
  const { remove, isDeleting } = useAdminEntityQuery("sections", {}, userType);

  const handleDelete = async () => {
    try {
      await remove(section.id);
      onDelete(section.id);
      setShowDeleteModal(false);
      toast.success("تم حذف القسم بنجاح");
    } catch (error) {
      toast.error("فشل في حذف القسم");
    }
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{section.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default">نشط</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/admin/sections/edit/${section.id}`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">تأكيد حذف القسم</DialogTitle>
            <DialogDescription className="text-center">هل أنت متأكد من حذف "{section.name}"؟</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <Trash2 size={32} className="text-red-600" />
            </div>

            <p className="text-gray-600 text-center mb-2">
              سيتم حذف: <span className="font-medium">{section.name}</span>
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

// Section Creation Form Component
const SectionCreationForm: React.FC<{
  onSubmit: (data: { name: string }) => void;
  isSubmitting: boolean;
}> = ({ onSubmit, isSubmitting }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="section-name" className="block text-sm font-medium text-gray-700 mb-2">
          اسم القسم
        </label>
        <Input
          id="section-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: الإلكترونيات، الملابس، المجوهرات"
          className="w-full"
          required
        />
        <p className="text-sm text-gray-500 mt-1">اسم القسم كما سيظهر للمستخدمين</p>
      </div>
    </form>
  );
};

const SectionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: sections = [],
    isLoading,
    error,
    refetch,
    create: createSection,
  } = useAdminEntityQuery("sections", {
    queryParams: { search: searchQuery },
  });

  const handleSearch = () => {
    refetch();
  };

  const handleDelete = async (id: number) => {
    // The deletion is handled in the SectionCard component
    refetch();
  };

  const handleCreateSection = async (data: { name: string }) => {
    setIsSubmitting(true);
    try {
      await createSection(data);
      setIsAddModalOpen(false);
      refetch();
      toast.success("تم إنشاء القسم بنجاح");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "حدث خطأ أثناء إنشاء القسم";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة الأقسام</h1>
          <p className="text-gray-600">إدارة أقسام المنتجات مثل الإلكترونيات، الملابس، المجوهرات وغيرها</p>
        </div>
        <ModalCustom
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          title="إضافة قسم جديد"
          content={<SectionCreationForm onSubmit={handleCreateSection} isSubmitting={isSubmitting} />}
          functionalbtn={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>
                إلغاء
              </Button>
              <Button
                onClick={() => {
                  const form = document.querySelector("form");
                  if (form) {
                    form.dispatchEvent(new Event("submit", { bubbles: true }));
                  }
                }}
                disabled={isSubmitting}
                className="bg-main hover:bg-main/90"
              >
                {isSubmitting ? "جاري الإنشاء..." : "إنشاء القسم"}
              </Button>
            </div>
          }
          btn={
            <Button className="bg-main hover:bg-main/90">
              <Plus className="w-4 h-4 ml-2" />
              إضافة قسم جديد
            </Button>
          }
        />
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          placeholder="البحث في الأقسام..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-sm"
        />
        <Button onClick={handleSearch} variant="outline">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {sections.length > 0 ? (
          sections.map((section: Section) => <SectionCard key={section.id} section={section} onDelete={handleDelete} />)
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">لا توجد أقسام بعد</p>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-main hover:bg-main/90">
              <Plus className="w-4 h-4 ml-2" />
              إضافة أول قسم
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SectionsPage;
