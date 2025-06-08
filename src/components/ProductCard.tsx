import { Link } from "react-router-dom";
import { ProductSectionProps } from "@/types/product";
import { Star } from "lucide-react";
import { DefaultProductImage } from "./ui/default-product-image";

interface ProductCardProps {
  product: Partial<ProductSectionProps>;
}

const ProductCard = ({ product }: ProductCardProps) => {
  if (!product) {
    return null;
  }

  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="relative shadow-md overflow-hidden rounded-lg h-64">
        {product.cover || (product.images && product.images.length > 0) ? (
          <img
            src={product.cover || product.images?.[0]?.src}
            alt={product.images?.[0]?.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <DefaultProductImage />
        )}
        {product.discount && product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            {product.discount}% خصم
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold line-clamp-2 text-main text-right">{product.title || product.name}</h3>
        {product.shortDescription && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2 text-right">{product.shortDescription}</p>
        )}
        <div className="flex items-center justify-between mt-1">
          <div className="text-right">
            <div className="text-sm font-bold">{product.price ? `${product.price} جنيه` : "السعر غير متوفر"}</div>
            {product.originalPrice && product.price && product.originalPrice > product.price && (
              <div className=" text-gray-500 line-through text-sm">{product.originalPrice} جنيه</div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" fill="oklch(79.5% 0.184 86.047)" />
            <span className="text-sm text-gray-600">
              {product.rating || 0} ({product.reviewCount || 0})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
