import React from "react";
import { Pagination } from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

interface EntityListProps<T> {
  entities: T[];
  selectedEntity: T | null;
  onSelectEntity: (entity: T) => void;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  renderEntity: (entity: T) => React.ReactNode;
  entityType: string;
  totalRecords: number;
}

function EntityList<T extends { id: number }>({
  entities,
  selectedEntity,
  onSelectEntity,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  renderEntity,
  entityType,
  totalRecords,
}: EntityListProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-gray-800">الكل (0)</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-gray-800">الكل (0)</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-red-500 p-4 text-center">
          <div>
            <p className="font-medium">حدث خطأ في تحميل البيانات</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-bold text-gray-800">الكل ({totalRecords})</h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#E7EAEE] scrollbar-track-transparent hover:scrollbar-thumb-[#D0D5DD]">
        {entities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 p-4">
            <p>لا يوجد {entityType} للعرض</p>
          </div>
        ) : (
          <ul>
            {entities.map((entity) => (
              <li
                key={entity.id}
                className={`cursor-pointer transition-colors ${
                  selectedEntity?.id === entity.id ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => onSelectEntity(entity)}
              >
                {renderEntity(entity)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}

export default EntityList;
