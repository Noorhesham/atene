"use client";

import { useState } from "react";
import { ChevronDown, Heart, Grid3X3, MessageSquare } from "lucide-react";
import MaxWidthWrapper from "./MaxwidthWrapper";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import MobileNav from "./MobileNav";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categoryOpen: boolean;
  setCategoryOpen: (open: boolean) => void;
  categories: string[];
}

/**
 * Navbar component with interactive state
 * Exactly matches the provided design with RTL support for Arabic
 */
const NavbarWithState = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("جميع الفئات");

  // Sample categories
  const categories = ["جميع الفئات", "الإلكترونيات", "الملابس", "المنزل والحديقة", "الجمال والعناية الشخصية"];

  return (
    <div className="w-full shadow-sm" dir="rtl">
      {/* Mobile Navigation */}
      <MobileNav
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <MaxWidthWrapper className="bg-white border-b border-gray-200 !py-5">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-4">
              <img src="/black.svg" className="h-10" alt="logo" />
            </Link>

            <div className="flex-1 max-w-2xl mx-[77px] ">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categoryOpen={categoryOpen}
                setCategoryOpen={setCategoryOpen}
                categories={categories}
              />
            </div>

            <div className="flex items-center gap-5">
              <NavIcons />
              <UserMenu />
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
};

// Extracted SearchBar component
const SearchBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categoryOpen,
  setCategoryOpen,
  categories,
}: SearchBarProps) => {
  return (
    <div className="relative flex">
      <input
        type="text"
        className="w-full border border-[#287CDA] rounded-md h-10 py-2 pr-3 focus:outline-none"
        placeholder="البحث"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        className="absolute left-0 top-0 lg:text-base text-sm bg-[#287CDA] text-white px-6 rounded-l-md h-10 flex items-center"
        aria-label="بحث"
      >
        البحث
      </button>
      <div className="absolute left-20 top-0 h-full flex items-center">
        <div className="relative">
          <button
            className="flex items-center gap-1 px-3 text-black text-sm h-full"
            onClick={() => setCategoryOpen(!categoryOpen)}
            aria-label={categoryOpen ? "إغلاق قائمة الفئات" : "فتح قائمة الفئات"}
          >
            <span>{selectedCategory}</span>
            <ChevronDown size={16} />
          </button>

          {categoryOpen && (
            <div
              className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
              role="listbox"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCategoryOpen(false);
                  }}
                  role="option"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Extracted NavIcons component
const NavIcons = () => {
  return (
    <div className="flex items-center gap-5 text-gray-500">
      <button className="hover:text-gray-700" aria-label="الرسائل">
        <MessageSquare size={20} />
      </button>
      <button className="hover:text-gray-700" aria-label="المفضلة">
        <Heart size={20} />
      </button>
      <button className="hover:text-gray-700" aria-label="الفئات">
        <Grid3X3 size={20} />
      </button>
    </div>
  );
};

export default NavbarWithState;
