import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ApiCategory } from "@/hooks/useUsersQuery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, FolderOpen, ChevronRight, ChevronDown, GripVertical, Image as ImageIcon } from "lucide-react";

interface TreeNode extends ApiCategory {
  children: TreeNode[];
  level: number;
  isExpanded: boolean;
}

interface SortableTreeItemProps {
  category: TreeNode;
  isOver: boolean;
  onToggleExpanded: (id: number) => void;
}

const SortableTreeItem: React.FC<SortableTreeItemProps> = ({ category, isOver, onToggleExpanded }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });

  const hasChildren = category.children.length > 0;
  const indentLevel = Math.min(category.level, 5); // Max 5 levels for visual clarity

  // DnD required styles
  const dragStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyles}
      className={`
        flex items-center gap-2 p-3 rounded-lg border transition-all duration-200
        ${isDragging ? "opacity-50 bg-gray-100" : ""}
        ${isOver ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}
        ${category.level > 0 ? "ml-4" : ""}
        hover:bg-gray-50
      `}
    >
      {/* Indentation for tree levels */}
      <div className={`flex-shrink-0`} style={{ width: `${indentLevel * 20}px` }} />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Expand/Collapse button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-6 h-6 p-0"
        onClick={() => onToggleExpanded(category.id)}
        disabled={!hasChildren}
      >
        {hasChildren ? (
          category.isExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )
        ) : (
          <div className="w-3 h-3" />
        )}
      </Button>

      {/* Folder icon */}
      <div className="flex-shrink-0">
        {hasChildren ? (
          category.isExpanded ? (
            <FolderOpen className="w-5 h-5 text-blue-500" />
          ) : (
            <Folder className="w-5 h-5 text-blue-500" />
          )
        ) : (
          <Folder className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Category image */}
      {category.image ? (
        <img src={category.image} alt={category.name} className="w-8 h-8 rounded object-cover border" />
      ) : (
        <div className="w-8 h-8 rounded bg-gray-100 border flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Category details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">{category.name}</span>
          <Badge variant={category.status === "active" ? "default" : "secondary"} className="text-xs">
            {category.status === "active" ? "نشط" : "غير نشط"}
          </Badge>
        </div>

        {hasChildren && <p className="text-sm text-gray-500 mt-1">{category.children.length} تصنيف فرعي</p>}
      </div>

      {/* Category ID for reference */}
      <div className="flex-shrink-0 text-xs text-gray-400">ID: {category.id}</div>
    </div>
  );
};

export default SortableTreeItem;
