import { ChevronLeft } from "lucide-react";

export const FilterPanel = ({ categories }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-gray-800">الكل</h2>
      <button className="p-1 rounded-md hover:bg-gray-100" title="Toggle Panel">
        <ChevronLeft size={20} />
      </button>
    </div>
    <ul>
      {categories.map((cat, index) => (
        <li
          key={index}
          className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
            cat.active ? "bg-blue-50 text-main font-bold" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center gap-2">{cat.name}</span>
          <ChevronLeft size={16} />
        </li>
      ))}
    </ul>
  </div>
);
export default FilterPanel;
