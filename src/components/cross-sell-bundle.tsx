"use client";

import type { CrossSellBundleData, CrossSellProduct } from "@/types/product";
import { Plus } from "lucide-react";

interface CrossSellBundleProps {
  bundle: CrossSellBundleData;
}

const ProductItemCard = ({ product }: { product: CrossSellProduct }) => (
  <div className="flex flex-col items-center w-36 md:w-48 flex-shrink-0 p-2 md:p-3 border border-blue-500 rounded-md bg-white dark:bg-gray-800">
    <div className="relative w-full h-24 md:h-32 mb-2">
      <img
        src={product.cover || "/placeholder.svg?width=150&height=128&query=product+image"}
        alt={product.name}
        className="object-contain w-full h-full"
      />
    </div>
    <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-tight text-right w-full px-1 line-clamp-2">
      {product.name}
    </p>
  </div>
);

export default function CrossSellBundle({ bundle }: CrossSellBundleProps) {
  const { cross_sells, cross_sells_price, final_price } = bundle;

  return (
    <div dir="rtl" className="dark:bg-gray-900 w-full flex flex-col md:flex-row justify-center overflow-x-auto py-4">
      {/* Products Section - Scrollable on mobile */}
      <div className="flex items-center min-w-0">
        <div className="flex items-center space-x-2 md:space-x-3 space-x-reverse overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          {cross_sells.map((product, index) => (
            <div key={product.id} className="flex items-center space-x-2 md:space-x-3 space-x-reverse">
              <ProductItemCard product={product} />
              {index < cross_sells.length - 1 && (
                <Plus className="w-4 h-4 md:w-5 md:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Section - Fixed at bottom on mobile */}
      <div className="flex items-center justify-center flex-shrink-0 md:pl-4 md:pr-6 py-2 md:py-4 border-t md:border-t-0 mt-2 md:mt-0">
        <div className="text-2xl md:text-3xl text-gray-500 dark:text-gray-400 mx-2 md:mx-3">=</div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-500 whitespace-nowrap">
            {final_price?.toFixed(2)} ₪
          </div>
          <div className="text-sm md:text-lg text-[#414141] mt-0.5 md:mt-1">بدلاً من</div>
          <div className="text-sm md:text-base text-red-400 dark:text-gray-500 line-through whitespace-nowrap">
            {cross_sells_price?.toFixed(2)} ₪
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this to your global CSS or tailwind config
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }
// .scrollbar-hide {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// }
