import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdminEntity, ApiCategory } from "@/hooks/useUsers";
import { Plus, Search, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface CategoryWithSubs extends ApiCategory {
  subCategories?: CategoryWithSubs[];
}

const CategoryTree: React.FC<{
  categories: CategoryWithSubs[];
  onDelete: (id: number) => void;
  level?: number;
}> = ({ categories, onDelete, level = 0 }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleExpanded = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className={`space-y-2 ${level > 0 ? "mr-6 border-r border-gray-200 pr-4" : ""}`}>
      {categories.map((category) => (
        <div key={category.id} className="space-y-2">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {category.subCategories && category.subCategories.length > 0 && (
                  <button onClick={() => toggleExpanded(category.id)} className="text-gray-500 hover:text-gray-700">
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
                <div className="flex items-center gap-3">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-10 h-10 rounded-md object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">صورة</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">الرقم: {category.id}</p>
                  </div>
                </div>
                <Badge variant={category.status === "active" ? "default" : "secondary"}>
                  {category.status === "active" ? "نشط" : "غير نشط"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/admin/categories/edit/${category.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 ml-1" />
                    تعديل
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 ml-1" />
                  حذف
                </Button>
              </div>
            </div>
          </Card>

          {category.subCategories && category.subCategories.length > 0 && expandedCategories.has(category.id) && (
            <CategoryTree categories={category.subCategories} onDelete={onDelete} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
};

const CategoriesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: categories,
    isLoading,
    error,
    remove,
    setSearchQuery: setApiSearchQuery,
  } = useAdminEntity("categories");

  // Transform flat categories into hierarchical structure
  const buildCategoryTree = (cats: ApiCategory[]): CategoryWithSubs[] => {
    const categoryMap = new Map<number, CategoryWithSubs>();
    const rootCategories: CategoryWithSubs[] = [];

    // First pass: create all category objects
    cats.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, subCategories: [] });
    });

    // Second pass: build hierarchy
    cats.forEach((cat) => {
      const categoryWithSubs = categoryMap.get(cat.id)!;
      if (cat.parent_id === null) {
        rootCategories.push(categoryWithSubs);
      } else {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.subCategories = parent.subCategories || [];
          parent.subCategories.push(categoryWithSubs);
        }
      }
    });

    return rootCategories;
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
      try {
        await remove(id);
        toast.success("تم حذف التصنيف بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء حذف التصنيف");
        console.error("Delete error:", error);
      }
    }
  };

  const handleSearch = () => {
    setApiSearchQuery(searchQuery);
  };

  const categoryTree = buildCategoryTree(categories);

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
          <h1 className="text-2xl font-bold text-gray-900">إدارة التصنيفات</h1>
          <p className="text-gray-600">إدارة تصنيفات المنتجات والفئات الفرعية</p>
        </div>
        <Link to="/admin/categories/add">
          <Button className="bg-main hover:bg-main/90">
            <Plus className="w-4 h-4 ml-2" />
            إضافة تصنيف جديد
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في التصنيفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <Button onClick={handleSearch} variant="outline">
            بحث
          </Button>
        </div>
      </Card>

      {/* Categories Tree */}
      <div className="space-y-4">
        {categoryTree.length > 0 ? (
          <CategoryTree categories={categoryTree} onDelete={handleDelete} />
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">لا توجد تصنيفات بعد</p>
            <Link to="/admin/categories/add">
              <Button className="bg-main hover:bg-main/90">
                <Plus className="w-4 h-4 ml-2" />
                إضافة أول تصنيف
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
