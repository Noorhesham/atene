import { Link } from "react-router-dom";
import { ProductSectionProps } from "@/types/product";
import { Heart, Star } from "lucide-react";
import { DefaultProductImage } from "./ui/default-product-image";
import { useState, useEffect } from "react";
import { addToFavorites, removeFromFavorites, checkFavorite } from "@/utils/api/product";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
  product: Partial<ProductSectionProps> & {
    isNew?: boolean;
    seller?: string;
    isFavorite?: boolean;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is favorite on component mount
  useEffect(() => {
    if (user && product.id) {
      checkFavorite({
        favs_type: "product",
        favs_id: product.id.toString(),
      })
        .then((response) => {
          setIsFavorite(response.is_favorite);
        })
        .catch((error) => {
          console.error("Error checking favorite status:", error);
        });
    }
  }, [user, product.id]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();

    if (!user) {
      // You might want to show a login modal or redirect to login
      console.log("User must be logged in to add favorites");
      return;
    }

    if (!product.id) {
      console.error("Product ID is required");
      return;
    }

    setIsLoading(true);

    try {
      const favoriteData = {
        favs_type: "product" as const,
        favs_id: product.id.toString(),
      };

      if (isFavorite) {
        await removeFromFavorites(favoriteData);
        setIsFavorite(false);
      } else {
        await addToFavorites(favoriteData);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <Link to={`/products/${product.slug}`} className="group block text-right">
      <div className="relative overflow-hidden rounded-lg shadow-sm border border-gray-200">
        <div className="relative h-[360px] overflow-hidden">
          {product.cover || (product.images && product.images.length > 0) ? (
            <img
              src={product.cover || product.images?.[0]?.src}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <DefaultProductImage />
          )}
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md">جديد</span>
          )}
          {product.discount && product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
              -{product.discount}%
            </span>
          )}
        </div>
        <button
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-colors disabled:opacity-50"
          aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>
      <div className="mt-3 px-1">
        <h3 className="font-semibold text-sm lg:text-[22px] text-[#395A7D] truncate">{product.title}</h3>
        {product.seller && <p className="text-xs text-gray-500 mt-0.5">{product.seller}</p>}
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                (product.rating || 0) > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-[#389C54]  mt-1">{product.price ? `${product.price}₪` : ""}</p>
          <p className="text-sm font-bold text-[#395A7D]  line-through mt-1">
            {product.originalPrice ? `${product.originalPrice}₪` : ""}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
