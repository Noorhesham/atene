import { Search } from "lucide-react";

export const Header = ({ mode, onAddOrder }: { mode: string; onAddOrder: () => void }) => {
  if (mode === "edit") {
    return (
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="w-full lg:w-auto">
          <p className="text-gray-500 mt-1 text-lg">الطلبات / طلب جديد</p>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onAddOrder} className="flex flex-col gap-4 mb-6">
      {/* العنوان */}
      <div className="w-full">
        <p className="text-gray-500 mt-1 text-sm text-right">الرئيسية / الطلبات</p>
      </div>

      {/* الشريط */}
      <div className="w-full flex  items-center gap-8 justify-between">
        {" "}
        {/* يمين: حقل البحث */}
        <div className="relative w-full ">
          <input
            type="text"
            placeholder="ابحث برقم الطلب"
            className="w-full py-2.5 pr-10 pl-4 text-sm border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-main/50 placeholder:text-gray-400"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
