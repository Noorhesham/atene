// components/CategoryScroll.tsx
import React from "react";
import { Categories } from "@/types/product";
import { Link } from "react-router-dom";

interface CategoryScrollProps {
  categories: Categories;
}

const CategoryScroll = ({ categories }: CategoryScrollProps) => {
  if (!categories?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-12 gap-1 ">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.slug}`}
          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center p-2">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-gray-700">{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryScroll;
