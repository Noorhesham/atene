import React from "react";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiUser, ApiStore, ApiProduct } from "@/types";
import { Pagination } from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

interface EntityListProps<T extends { id: number }> {
  entityName: "users" | "stores" | "roles" | "permissions" | "products";
  selectedItem: T | null;
  onSelectItem: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  searchQuery?: string;
  pageSize?: number;
  queryParams?: Record<string, string>;
}

type EntityType = ApiUser | ApiStore | ApiProduct;

export function PaginatedList<T extends EntityType>({
  entityName,
  selectedItem,
  onSelectItem,
  renderItem,
  searchQuery = "",
  pageSize = 10,
  queryParams = {},
}: EntityListProps<T>) {
  const {
    data: items,
    isLoading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    setSearchQuery,
  } = useAdminEntityQuery(entityName, {
    initialPerPage: pageSize,
    queryParams,
  });
  console.log(items, "items");
  // Update search query in the hook when it changes
  React.useEffect(() => {
    setSearchQuery(searchQuery);
  }, [searchQuery, setSearchQuery]);

  // Reset page when search query changes
  React.useEffect(() => {
    if (searchQuery.trim() !== "") {
      setCurrentPage(1);
    }
  }, [searchQuery, setCurrentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  }

  if (!items?.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {searchQuery.trim() !== "" ? "لا يوجد نتائج للبحث" : "لا يوجد عناصر"}
      </div>
    );
  }

  return (
    <div className="flex  flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#E7EAEE] scrollbar-track-transparent hover:scrollbar-thumb-[#D0D5DD]">
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: selectedItem?.id === item.id ? "rgba(91, 136, 186, 0.20)" : "transparent",
            }}
            className={`cursor-pointer  first:rounded-t-lg `}
            onClick={() => onSelectItem(item as T)}
          >
            {renderItem(item as T)}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="border-t p-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
