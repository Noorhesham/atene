import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  Loader2,
  Trash2,
  ArrowLeft,
  Folder,
  FolderOpen,
  Save,
  GripVertical,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiCategory } from "@/types";
import ModalCustom from "@/components/ModalCustom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CategoryWithSubs {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  status: "active" | "inactive";
  parent_id: number | null;
  created_at?: string;
  updated_at?: string;
  subCategories?: CategoryWithSubs[];
}

interface TreeNode {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  status: "active" | "inactive";
  parent_id: number | null;
  created_at?: string;
  updated_at?: string;
  children: TreeNode[];
  level: number;
  isExpanded: boolean;
}

const SortableCategoryTreeItem: React.FC<{
  category: CategoryWithSubs;
  onDelete: (id: number) => Promise<void>;
  level?: number;
  onEdit: (category: CategoryWithSubs) => void;
  showDeleteConfirm: number | null;
  setShowDeleteConfirm: (id: number | null) => void;
  expandedCategories: Set<number>;
  toggleExpanded: (categoryId: number) => void;
  isOver: boolean;
}> = ({
  category,
  onDelete,
  level = 0,
  onEdit,
  showDeleteConfirm,
  setShowDeleteConfirm,
  expandedCategories,
  toggleExpanded,
  isOver,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });
  const hasChildren = category.subCategories && category.subCategories.length > 0;
  const isExpanded = expandedCategories.has(category.id);
  const indentLevel = level * 24; // 24px per level

  const dragStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="space-y-2">
      <Card
        ref={setNodeRef}
        style={dragStyles}
        className={`p-4 transition-all duration-200 ${level > 0 ? "border-l-4 border-blue-200 bg-blue-50/30" : ""} ${
          isDragging ? "opacity-50 bg-gray-100" : ""
        } ${isOver ? "bg-blue-50 border-blue-300" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3" style={{ marginLeft: `${indentLevel}px` }}>
            {/* Drag handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {hasChildren && (
              <button
                onClick={() => toggleExpanded(category.id)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
            {!hasChildren && (
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
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
                <h3 className={`font-semibold text-gray-900 ${level > 0 ? "text-sm" : "text-base"}`}>
                  {category.name}
                  {level > 0 && <span className="text-xs text-gray-500 mr-2">(فرعي)</span>}
                </h3>
                <p className="text-sm text-gray-500">الرقم: {category.id}</p>
                {level > 0 && <p className="text-xs text-blue-600">المستوى: {level}</p>}
              </div>
            </div>

            <Badge variant={category.status === "active" ? "default" : "secondary"}>
              {category.status === "active" ? "نشط" : "غير نشط"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              className="text-blue-600 hover:text-blue-700"
            >
              تعديل
            </Button>
            <ModalCustom
              isOpen={showDeleteConfirm === category.id}
              onOpenChange={(isOpen) => !isOpen && setShowDeleteConfirm(null)}
              btn={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </Button>
              }
              title="تأكيد الحذف"
              content={
                <p className="text-center">
                  هل أنت متأكد من حذف هذا التصنيف؟
                  {hasChildren && " سيتم حذف جميع التصنيفات الفرعية أيضاً."}
                  لا يمكن التراجع عن هذا الإجراء.
                </p>
              }
              functionalbtn={
                <div className="flex gap-2 w-full justify-end">
                  <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)}>
                    إلغاء
                  </Button>
                  <Button variant="destructive" onClick={() => onDelete(category.id)}>
                    حذف
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </Card>

      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <div className="space-y-2">
          {category.subCategories!.map((child) => (
            <SortableCategoryTreeItem
              key={child.id}
              category={child}
              onDelete={onDelete}
              level={level + 1}
              onEdit={onEdit}
              showDeleteConfirm={showDeleteConfirm}
              setShowDeleteConfirm={setShowDeleteConfirm}
              expandedCategories={expandedCategories}
              toggleExpanded={toggleExpanded}
              isOver={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryTreePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [overId, setOverId] = useState<string | number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const {
    data: categories,
    isLoading,
    error,
    remove,
    setSearchQuery: setApiSearchQuery,
    refetch,
    updateParent,
  } = useAdminEntityQuery("categories", {
    queryParams: {
      search: searchQuery,
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Transform flat categories into hierarchical structure
  const buildCategoryTree = useCallback((cats: ApiCategory[]): CategoryWithSubs[] => {
    const categoryMap = new Map<number, CategoryWithSubs>();
    const rootCategories: CategoryWithSubs[] = [];

    // First pass: create all category objects
    cats.forEach((cat) => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        status: cat.status,
        parent_id: cat.parent_id,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
        subCategories: [],
      });
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
  }, []);

  // Build tree structure for DnD
  const buildTree = useCallback((cats: ApiCategory[]): TreeNode[] => {
    const categoryMap = new Map<number, TreeNode>();
    const rootCategories: TreeNode[] = [];

    // Create tree nodes
    cats.forEach((cat) => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        status: cat.status,
        parent_id: cat.parent_id,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
        children: [],
        level: 0,
        isExpanded: true,
      });
    });

    // Build parent-child relationships
    cats.forEach((cat) => {
      const node = categoryMap.get(cat.id)!;
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        const parent = categoryMap.get(cat.parent_id)!;
        parent.children.push(node);
        node.level = parent.level + 1;
      } else {
        rootCategories.push(node);
      }
    });

    return rootCategories;
  }, []);

  // Flatten tree for sortable context
  const flattenTree = useCallback((nodes: TreeNode[]): TreeNode[] => {
    const result: TreeNode[] = [];

    const traverse = (node: TreeNode) => {
      result.push(node);
      if (node.isExpanded && node.children.length > 0) {
        node.children.forEach(traverse);
      }
    };

    nodes.forEach(traverse);
    return result;
  }, []);

  // Initialize tree data
  React.useEffect(() => {
    const tree = buildTree(categories);
    setTreeData(tree);
  }, [categories, buildTree]);

  const handleDelete = async (id: number) => {
    try {
      await remove(id);
      toast.success("تم حذف التصنيف بنجاح");
      setShowDeleteConfirm(null);
      refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف التصنيف");
      console.error("Delete error:", error);
    }
  };

  const handleSearch = () => {
    setApiSearchQuery(searchQuery);
  };

  const toggleExpanded = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAll = () => {
    const allIds = new Set<number>();
    const collectIds = (cats: CategoryWithSubs[]) => {
      cats.forEach((cat) => {
        allIds.add(cat.id);
        if (cat.subCategories) {
          collectIds(cat.subCategories);
        }
      });
    };
    collectIds(buildCategoryTree(categories));
    setExpandedCategories(allIds);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  // Find category in tree
  const findCategory = useCallback((id: number, nodes: TreeNode[]): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = findCategory(id, node.children);
      if (found) return found;
    }
    return null;
  }, []);

  // Remove category from tree
  const removeFromTree = useCallback((id: number, nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .filter((node) => node.id !== id)
      .map((node) => ({
        ...node,
        children: removeFromTree(id, node.children),
      }));
  }, []);

  // Add category to tree
  const addToTree = useCallback((category: TreeNode, parentId: number | null, nodes: TreeNode[]): TreeNode[] => {
    if (parentId === null) {
      return [...nodes, { ...category, level: 0 }];
    }

    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, { ...category, level: node.level + 1 }],
          isExpanded: true,
        };
      }
      if (node.children.length > 0) {
        return {
          ...node,
          children: addToTree(category, parentId, node.children),
        };
      }
      return node;
    });
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const activeCategory = findCategory(Number(active.id), treeData);
    if (!activeCategory) return;

    // Determine new parent
    let newParentId: number | null = null;
    if (over.id !== "root") {
      const overCategory = findCategory(Number(over.id), treeData);
      if (overCategory) {
        newParentId = overCategory.id;
      }
    }

    // Check if the move would create a cycle
    const wouldCreateCycle = (categoryId: number, potentialParentId: number | null): boolean => {
      if (potentialParentId === null) return false;
      if (potentialParentId === categoryId) return true;

      const parent = findCategory(potentialParentId, treeData);
      if (!parent) return false;

      return wouldCreateCycle(categoryId, parent.parent_id);
    };

    if (wouldCreateCycle(activeCategory.id, newParentId)) {
      return; // Prevent cycle
    }

    // Update tree structure
    let newTree = removeFromTree(activeCategory.id, treeData);
    const updatedCategory = { ...activeCategory, parent_id: newParentId };
    newTree = addToTree(updatedCategory, newParentId, newTree);

    setTreeData(newTree);
    setHasChanges(true);
  };

  const handleParentUpdate = async (updates: { id: number; parent_id: number | null }[]) => {
    if (!updateParent) {
      toast.error("لا يمكن تحديث العلاقات الأبوية");
      return;
    }

    try {
      await Promise.all(updates.map((update) => updateParent([{ id: update.id, parent_id: update.parent_id }])));
      await refetch();
      toast.success("تم حفظ التغييرات بنجاح");
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating parent relationships:", error);
      toast.error("حدث خطأ أثناء حفظ التغييرات");
    }
  };

  const saveChanges = async () => {
    const updates: { id: number; parent_id: number | null }[] = [];

    const extractUpdates = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        const originalCategory = categories.find((c) => c.id === node.id);
        if (originalCategory && originalCategory.parent_id !== node.parent_id) {
          updates.push({ id: node.id, parent_id: node.parent_id });
        }
        if (node.children.length > 0) {
          extractUpdates(node.children);
        }
      });
    };

    extractUpdates(treeData);

    if (updates.length > 0) {
      await handleParentUpdate(updates);
    } else {
      toast("لا توجد تغييرات للحفظ", { icon: "ℹ️" });
    }
  };

  const categoryTree = buildCategoryTree(categories);
  const flatData = flattenTree(treeData);
  const activeCategory = activeId ? findCategory(Number(activeId), treeData) : null;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-main" />
          <div className="text-gray-500 mr-2">جاري التحميل...</div>
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/categories")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            العودة للتصنيفات
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">هيكل التصنيفات</h1>
            <p className="text-gray-600">عرض هيكل التصنيفات والتصنيفات الفرعية</p>
          </div>
        </div>
        <Link to="/admin/categories/add">
          <Button className="bg-main hover:bg-main/90">
            <Plus className="w-4 h-4 ml-2" />
            إضافة تصنيف جديد
          </Button>
        </Link>
      </div>

      {/* Save Changes Banner */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-800">لديك تغييرات غير محفوظة في هيكل التصنيفات</p>
            <Button onClick={saveChanges} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
              <Save className="w-4 h-4 ml-2" />
              حفظ التغييرات
            </Button>
          </div>
        </div>
      )}

      {/* Search and Controls */}
      <Card className="p-4">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في التصنيفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} variant="outline">
              بحث
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={expandAll} variant="outline" size="sm">
              توسيع الكل
            </Button>
            <Button onClick={collapseAll} variant="outline" size="sm">
              طي الكل
            </Button>
          </div>
        </div>
      </Card>

      {/* Categories Tree with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={flatData.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {categoryTree.length > 0 ? (
              <div className="space-y-2">
                {categoryTree.map((category) => (
                  <SortableCategoryTreeItem
                    key={category.id}
                    category={category}
                    onDelete={handleDelete}
                    onEdit={(category) => {
                      navigate(`/admin/categories/edit/${category.id}`);
                    }}
                    showDeleteConfirm={showDeleteConfirm}
                    setShowDeleteConfirm={setShowDeleteConfirm}
                    expandedCategories={expandedCategories}
                    toggleExpanded={toggleExpanded}
                    isOver={overId === category.id}
                  />
                ))}
              </div>
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
        </SortableContext>

        <DragOverlay>
          {activeCategory ? (
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-2">
                {activeCategory.children.length > 0 ? (
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                ) : (
                  <Folder className="w-4 h-4 text-gray-500" />
                )}
                <span className="font-medium">{activeCategory.name}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default CategoryTreePage;
