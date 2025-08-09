import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
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
import { ApiCategory, useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Folder, FolderOpen } from "lucide-react";
import SortableTreeItem from "./SortableTreeItem";

interface CategoryTreeViewProps {
  //  categories: ApiCategory[];
  //  onParentUpdate: (updates: { id: number; parent_id: number | null }[]) => Promise<void>;
  isUpdating: boolean;
}

interface TreeNode extends ApiCategory {
  children: TreeNode[];
  level: number;
  isExpanded: boolean;
}

const CategoryTreeView: React.FC<CategoryTreeViewProps> = ({ isUpdating }) => {
  const { data: categories, updateParent, refetch } = useAdminEntityQuery("categories");
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [flatData, setFlatData] = useState<TreeNode[]>([]);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [overId, setOverId] = useState<string | number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleParentUpdate = async (updates: { id: number; parent_id: number | null }[]) => {
    if (!updateParent) {
      toast.error("لا يمكن تحديث العلاقات الأبوية");
      return;
    }

    try {
      await Promise.all(updates.map((update) => updateParent([{ id: update.id, parent_id: update.parent_id }])));
      await refetch();

      setHasChanges(false);
    } catch (error) {
      console.error("Error updating parent relationships:", error);
    }
  };

  // Build tree structure from flat categories
  const buildTree = useCallback((cats: ApiCategory[]): TreeNode[] => {
    const categoryMap = new Map<number, TreeNode>();
    const rootCategories: TreeNode[] = [];

    // Create tree nodes
    cats.forEach((cat) => {
      categoryMap.set(cat.id, {
        ...cat,
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
    setFlatData(flattenTree(tree));
  }, [categories, buildTree, flattenTree]);

  // Toggle node expansion
  const toggleExpanded = useCallback(
    (id: number) => {
      const updateExpanded = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return { ...node, isExpanded: !node.isExpanded };
          }
          if (node.children.length > 0) {
            return { ...node, children: updateExpanded(node.children) };
          }
          return node;
        });
      };

      const newTree = updateExpanded(treeData);
      setTreeData(newTree);
      setFlatData(flattenTree(newTree));
    },
    [treeData, flattenTree]
  );

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
    setFlatData(flattenTree(newTree));
    setHasChanges(true);
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

  const activeCategory = activeId ? findCategory(Number(activeId), treeData) : null;

  return (
    <div className="space-y-4 w-full">
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-800">لديك تغييرات غير محفوظة في هيكل التصنيفات</p>
            <Button onClick={saveChanges} disabled={isUpdating} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={flatData.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {flatData.map((category) => (
              <SortableTreeItem
                key={category.id}
                category={category}
                isOver={overId === category.id}
                onToggleExpanded={toggleExpanded}
              />
            ))}
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

      {flatData.length === 0 && <div className="text-center text-gray-500 py-8">لا توجد تصنيفات لعرضها</div>}
    </div>
  );
};

export default CategoryTreeView;
