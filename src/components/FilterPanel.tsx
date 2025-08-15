import { ChevronLeft } from "lucide-react";

const FilterPanel = ({
  categories,
  activeFilter,
  onFilterChange,
}: {
  categories: {
    name: string;
    value: string | null;
    active?: boolean;
    count?: number;
  }[];
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}) => (
  <div className="w-full shadow-sm rounded-lg">
    <div className="pb-20">
      <ul className="space-y-1">
        {categories?.map((cat: any, index: number) => (
          <li className="first:rounded-t-md overflow-hidden" key={index}>
            <button
              style={{
                backgroundColor: activeFilter === cat.value ? "rgba(91, 136, 186, 0.20)" : "transparent",
                opacity: activeFilter === cat.value ? 1 : 0.5,
              }}
              onClick={() => onFilterChange(cat.value)}
              className={`w-full text-right px-4 py-4  first:rounded-md text-sm font-medium flex justify-between items-center`}
            >
              <div className="flex items-center gap-2">
                <span className=" text-main">{cat.name}</span>
                {cat.count && <span className="text-xs text-gray-500">({cat.count || 0})</span>}
              </div>
              {activeFilter === cat.value && <ChevronLeft size={16} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
export default FilterPanel;
