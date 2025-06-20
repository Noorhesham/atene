import { ChevronDown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxwidthWrapper";
import { useState } from "react";

export default function TopNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <MaxWidthWrapper noPadding className="bg-white border-b border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[42px]" dir="rtl">
          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center">
            <button className="flex items-center gap-1 px-4 text-[13px] text-[#414141] hover:text-black">
              <span>كل الفئات</span>
              <ChevronDown size={14} className="text-[#414141]" />
            </button>
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 text-[13px] text-[#414141] hover:text-black">
                <span>خدمات</span>
                <ChevronDown size={14} className="text-[#414141]" />
              </button>
            </div>
            <Link to="/ads" className="px-4 text-[13px] text-[#414141] hover:text-black">
              اعلانات
            </Link>
            <Link to="/jobs" className="px-4 text-[13px] text-[#414141] hover:text-black">
              وظائف
            </Link>
            <Link to="/gift-boxes" className="px-4 text-[13px] text-[#414141] hover:text-black">
              صناديق الهدايا
            </Link>
            <Link to="/hot-deals" className="px-4 text-[13px] text-[#414141] hover:text-black">
              العروض الساخنة
            </Link>
          </div>

          {/* Left Side */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-[13px] text-[#414141] hover:text-black">
                <img src="/black.svg" alt="UAE Flag" className="w-4 h-4" />
                <span>السوق الإ</span>
                <ChevronDown size={14} className="text-[#414141]" />
              </button>
              <button className="flex items-center gap-1 text-[13px] text-[#414141] hover:text-black">
                <span>دولار</span>
                <ChevronDown size={14} className="text-[#414141]" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#414141] hover:text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-2" dir="rtl">
            <div className="space-y-2 pb-3">
              <Link
                to="/hot-deals"
                className="block px-4 py-2 text-[13px] text-[#414141] hover:text-black hover:bg-gray-50"
              >
                العروض الساخنة
              </Link>
              <Link
                to="/gift-boxes"
                className="block px-4 py-2 text-[13px] text-[#414141] hover:text-black hover:bg-gray-50"
              >
                صناديق الهدايا
              </Link>
              <Link to="/jobs" className="block px-4 py-2 text-[13px] text-[#414141] hover:text-black hover:bg-gray-50">
                وظائف
              </Link>
              <Link to="/ads" className="block px-4 py-2 text-[13px] text-[#414141] hover:text-black hover:bg-gray-50">
                اعلانات
              </Link>
              <button className="w-full text-right px-4 py-2 text-[13px] text-[#414141] hover:text-black hover:bg-gray-50">
                خدمات
              </button>
              <button className="w-full text-right px-4 py-2 text-[13px] text-[#414141] hover:text-black hover:bg-gray-50">
                كل الفئات
              </button>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <button className="w-full text-right px-4 py-2 text-[13px] text-[#414141] hover:text-black hover:bg-gray-50 flex items-center gap-1 justify-end">
                <span>دولار</span>
                <ChevronDown size={14} className="text-[#414141]" />
              </button>
              <button className="w-full text-right px-4 py-2 text-[13px] text-[#414141] hover:text-black hover:bg-gray-50 flex items-center gap-1.5 justify-end">
                <img src="/black.svg" alt="UAE Flag" className="w-4 h-4" />
                <span>السوق الإ</span>
                <ChevronDown size={14} className="text-[#414141]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
}
