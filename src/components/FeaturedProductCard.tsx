import React from "react";
import { Heart, Eye } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  image: string;
  isNew?: boolean;
  isFavorite?: boolean;
  views?: number;
  price?: number;
  rating?: number;
  seller?: string;
  subtitle?: string;
  type: "simple" | "detailed";
}

interface FeaturedProductCardProps {
  product: Product;
}

const FeaturedProductCard = ({ product }: FeaturedProductCardProps) => {
  return (
    <div className="w-[210px] rounded-lg border border-gray-200 bg-white overflow-hidden group">
      <div className="relative h-[247px]">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
            جديد
          </span>
        )}
        {product.isFavorite !== undefined && (
          <button
            className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm p-1.5 rounded-full text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Toggle Favorite"
          >
            <Heart className={`w-4 h-4 ${product.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        )}
      </div>
      <div className="p-3">
        {product.type === "simple" ? (
          <p className="text-sm text-center font-semibold text-gray-700 truncate">{product.title}</p>
        ) : (
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 truncate">{product.subtitle}</p>
            <div className="flex justify-between items-center mt-2">
              <div className="text-left">
                <p className="font-bold text-blue-600 text-sm">₪{product.price}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">{product.rating?.toFixed(1)}</span>
                  {/* Simple star rating for brevity */}
                  <span className="text-yellow-400">★★★★★</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">{product.views}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{product.seller}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProductCard;
