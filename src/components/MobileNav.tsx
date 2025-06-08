import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Heart, Grid3X3, MessageSquare, Menu, X, Search } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

interface MobileNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const menuVariants = {
  closed: {
    x: "100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  open: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const searchVariants = {
  closed: {
    y: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  open: {
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

export default function MobileNav({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: MobileNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (mobileSearchOpen) setMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <button
          className="p-2 hover:bg-gray-100 rounded-md"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/">
          <img src="/black.svg" className="h-8" alt="logo" />
        </Link>

        <button
          className="p-2 hover:bg-gray-100 rounded-md"
          onClick={toggleMobileSearch}
          aria-label={mobileSearchOpen ? "إغلاق البحث" : "فتح البحث"}
        >
          <Search size={24} />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={toggleMobileMenu}
            />
            <motion.div
              className="fixed inset-y-0 right-0 w-4/5 bg-white z-50"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                    <img src="/black.svg" className="h-8" alt="logo" />
                  </Link>
                  <button onClick={toggleMobileMenu} aria-label="إغلاق القائمة">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col gap-4">
                    <UserMenu />
                    <motion.div
                      className="flex flex-col gap-3 py-4 border-t"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        to="/messages"
                        className="flex items-center gap-2 text-gray-700 hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <MessageSquare size={20} />
                        <span>الرسائل</span>
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center gap-2 text-gray-700 hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Heart size={20} />
                        <span>المفضلة</span>
                      </Link>
                      <Link
                        to="/categories"
                        className="flex items-center gap-2 text-gray-700 hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Grid3X3 size={20} />
                        <span>الفئات</span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {mobileSearchOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={toggleMobileSearch}
            />
            <motion.div
              className="fixed inset-x-0 top-0 bg-white z-50"
              variants={searchVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">البحث</h2>
                  <button onClick={toggleMobileSearch} aria-label="إغلاق البحث">
                    <X size={24} />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-700 h-10  rounded-md py-2 pr-3 focus:outline-none"
                    placeholder="البحث"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="absolute left-0 top-0 h-10 bg-primary text-white px-4 rounded-l-md"
                    aria-label="بحث"
                  >
                    البحث
                  </button>
                  <div className="mt-4">
                    <button
                      className="flex items-center gap-1 text-gray-600 text-sm"
                      onClick={() => setCategoryOpen(!categoryOpen)}
                      aria-label={categoryOpen ? "إغلاق قائمة الفئات" : "فتح قائمة الفئات"}
                    >
                      <span>{selectedCategory}</span>
                      <ChevronDown size={16} />
                    </button>
                    <AnimatePresence>
                      {categoryOpen && (
                        <motion.div
                          className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {categories.map((category) => (
                            <button
                              key={category}
                              className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setSelectedCategory(category);
                                setCategoryOpen(false);
                              }}
                            >
                              {category}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
