import React, { useState } from "react";
import { Pagination } from "@/pages/productPage/Pagination";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import MaxWidthWrapper from "./MaxwidthWrapper";

const dummyProducts = Array.from({ length: 16 }).map((_, i) => ({
  id: `${i + 1}`,
  slug: `product-${i + 1}`,
  title: "Filtro Retentor de Fiapos para Secadora Brastemp",
  price: 150.0,
  seller: "Kareem Market",
  rating: 4,
  cover:
    i % 4 === 0
      ? "/unsplash_9Huby3g9fN0.png"
      : i % 4 === 1
      ? "/unsplash_em37kS8WJJQ.png"
      : i % 4 === 2
      ? "/unsplash_Zf80cYcxSFA.png"
      : "/unsplash_oIlix2slmsI.png",
  isNew: true,
  isFavorite: false,
  discount: 24,
}));

const categories = [
  { name: "الكل", count: 377 },
  { name: "ملابس", count: 3 },
  { name: "مجوهرات", count: 30 },
  { name: "إلكترونيات", count: 70 },
  { name: "أدوات منزلية", count: 10 },
  { name: "مستحضرات تجميل", count: 200 },
  { name: "ألعاب", count: 164 },
];

const StoreProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const totalPages = 12;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <MaxWidthWrapper className="">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" dir="rtl">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          {" "}
          <div className="relative w-full sm:w-72">
            <Input
              type="search"
              placeholder="بحث في 377 منتج"
              className="rounded-full w-full pl-10 pr-4 h-11 border-[#287CDA] focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="absolute bg-[#287CDA] rounded-full p-2 left-2 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-white rotate-90" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg mt-5 p-4 space-y-3">
            <h3 className="font-bold  text-[#282828] text-base">فئات المتجر</h3>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full flex justify-between items-center text-right text-sm font-medium p-2 transition-colors ${
                  activeCategory === cat.name
                    ? "border-r-4 border-[#287CDA] text-[#287CDA] bg-[#F8FAFC]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeCategory === cat.name ? "bg-[#287CDA] text-white" : "bg-gray-200"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="flex justify-between border-b border-input items-center">
            {/* Top Bar */} <h3 className="font-bold text-lg mb-4 text-right">افضل المنتجات </h3>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-6">
            {dummyProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden">
                <div className="relative">
                  <img src={product.cover} alt={product.title} className="w-full h-[247px] object-cover" />
                  <div className="absolute top-3 right-3 bg-[#4CAF50] text-white text-xs px-2 py-1 rounded">جديد</div>
                </div>
                <div className="p-3">
                  <h3 className="text-[16px] text-[#606060] font-normal mb-2 line-clamp-2">{product.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="flex lg:mt-10 mt-5 border-b border-input justify-between items-center">
            {/* Top Bar */} <h3 className="font-bold text-lg mb-4 text-right">كل المنتجات </h3>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-6">
            {dummyProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden">
                <div className="relative">
                  <img src={product.cover} alt={product.title} className="w-full h-[247px] object-cover" />
                  <div className="absolute top-3 right-3 bg-[#4CAF50] text-white text-xs px-2 py-1 rounded">جديد</div>
                </div>
                <div className="p-3">
                  <h3 className="text-[16px] text-[#606060] font-normal mb-2 line-clamp-2">{product.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </MaxWidthWrapper>
  );
};

export default StoreProducts;
