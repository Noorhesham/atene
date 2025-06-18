import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxwidthWrapper";

export default function TopNavBar() {
  return (
    <MaxWidthWrapper noPadding className="bg-white border-b border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex items-center justify-between h-[42px]">
          {/* Left Side */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1 text-[13px] text-[#414141] hover:text-black">
              <span>دولار</span>
              <ChevronDown size={14} className="text-[#414141]" />
            </button>
            <button className="flex items-center gap-1.5 text-[13px] text-[#414141] hover:text-black">
              <img src="/black.svg" alt="UAE Flag" className="w-4 h-4" />
              <span>السوق الإ</span>
              <ChevronDown size={14} className="text-[#414141]" />
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center">
            <Link to="/hot-deals" className="px-4 text-[13px] text-[#414141] hover:text-black">
              العروض الساخنة
            </Link>
            <Link to="/gift-boxes" className="px-4 text-[13px] text-[#414141] hover:text-black">
              صناديق الهدايا
            </Link>
            <Link to="/jobs" className="px-4 text-[13px] text-[#414141] hover:text-black">
              وظائف
            </Link>
            <Link to="/ads" className="px-4 text-[13px] text-[#414141] hover:text-black">
              اعلانات
            </Link>
            <div className="relative group px-4">
              <button className="flex items-center gap-1 text-[13px] text-[#414141] hover:text-black">
                <span>خدمات</span>
                <ChevronDown size={14} className="text-[#414141]" />
              </button>
            </div>
            <button className="flex items-center gap-1 px-4 text-[13px] text-[#414141] hover:text-black">
              <span>كل الفئات</span>
              <ChevronDown size={14} className="text-[#414141]" />
            </button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
