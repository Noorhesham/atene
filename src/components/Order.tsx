import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

const Order = ({ orderDir, setOrderDir }: { orderDir: "asc" | "desc"; setOrderDir: (dir: "asc" | "desc") => void }) => {
  const handleOrderChange = (dir: "asc" | "desc") => {
    setOrderDir(dir);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          style={{
            backgroundColor: "rgba(91, 136, 186, 0.20)",
          }}
          variant="outline"
          className="gap-2 font-[500] text-main border-main"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M9.3477 6.95718H15.4347M9.3477 10.0007H13.152M9.3477 13.0441H11.6303M9.3477 3.9137H16.9564M5.16292 16.8485V3.15283M5.16292 16.8485C4.63031 16.8485 3.63509 15.3313 3.26074 14.9463M5.16292 16.8485C5.69552 16.8485 6.69074 15.3313 7.06509 14.9463"
              stroke="#2D496A"
              stroke-width="1.1413"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          ترتيب
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <div className="flex flex-col">
          <button
            onClick={() => handleOrderChange("asc")}
            className={`w-full text-right px-4 py-2.5 text-sm font-medium flex justify-between items-center hover:bg-gray-50 ${
              orderDir === "asc" ? "text-main" : "text-gray-600"
            }`}
          >
            <span>تصاعدي</span>
            {orderDir === "asc" && <ChevronLeft size={16} />}
          </button>
          <button
            onClick={() => handleOrderChange("desc")}
            className={`w-full text-right px-4 py-2.5 text-sm font-medium flex justify-between items-center hover:bg-gray-50 ${
              orderDir === "desc" ? "text-main" : "text-gray-600"
            }`}
          >
            <span>تنازلي</span>
            {orderDir === "desc" && <ChevronLeft size={16} />}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Order;
