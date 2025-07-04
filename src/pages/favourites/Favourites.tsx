import MainHeading from "@/components/MainHeading";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import FavouritesSlider from "@/components/FavouritesSlider";
import React, { useState, useEffect } from "react";
import { getAllFavorites } from "@/utils/api/product";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface FavoriteItem {
  id: string;
  title?: string;
  image: string;
  category?: string;
  type: "product" | "job" | "service" | "reviews";
  rating?: number;
  price?: number;
  originalPrice?: number;
  description?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

interface APIFavoriteProduct {
  id: number;
  slug: string;
  name: string;
  cover: string;
  is_favorite: boolean;
  in_compare: boolean;
  price: number;
  price_after_discount: number;
  discount_present: number;
  description?: string; // Optional for store type
}

interface APIFavoriteItem {
  id: number;
  favs_type: "product" | "store" | "service" | "job";
  favs: APIFavoriteProduct;
}

interface APIResponse {
  favorites: APIFavoriteItem[];
}

const Favourites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getAllFavorites();

        // Transform API response to match our component structure
        const transformedFavorites: FavoriteItem[] = response.favorites.map((fav: APIFavoriteItem) => {
          if (fav.favs_type === "product" && fav.favs) {
            return {
              id: fav.id.toString(),
              title: fav.favs.name,
              image: fav.favs.cover,
              price: fav.favs.price_after_discount,
              originalPrice: fav.favs.price,
              type: "product" as const,
            };
          } else if (fav.favs_type === "store" && fav.favs) {
            return {
              id: fav.id.toString(),
              title: fav.favs.name,
              image: fav.favs.cover,
              type: "product" as const, // Map store to product type for display
              description: fav.favs.description,
            };
          } else if (fav.favs_type === "service" && fav.favs) {
            return {
              id: fav.id.toString(),
              title: fav.favs.name,
              image: fav.favs.cover,
              type: "service" as const,
              description: fav.favs.description,
            };
          } else if (fav.favs_type === "job" && fav.favs) {
            return {
              id: fav.id.toString(),
              title: fav.favs.name,
              image: fav.favs.cover,
              type: "job" as const,
              description: fav.favs.description,
            };
          }

          // Fallback for unknown types
          return {
            id: fav.id.toString(),
            title: "عنصر غير معروف",
            image: "/placeholder.png",
            type: "product" as const,
          };
        });

        setFavorites(transformedFavorites);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("فشل في تحميل المفضلة");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Separate favorites by type
  const productFavorites = favorites.filter((item) => item.type === "product");
  const storeFavorites = favorites.filter((item) => item.type === "product" && item.description); // Stores mapped as products with description
  const serviceFavorites = favorites.filter((item) => item.type === "service");
  const jobFavorites = favorites.filter((item) => item.type === "job");

  if (isLoading) {
    return (
      <MaxWidthWrapper>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MaxWidthWrapper>
    );
  }

  if (error) {
    return (
      <MaxWidthWrapper>
        <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      </MaxWidthWrapper>
    );
  }

  if (!user) {
    return (
      <MaxWidthWrapper>
        <div className="text-center p-8">
          <p className="text-gray-600">يجب تسجيل الدخول لعرض المفضلة</p>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className="space-y-8">
        {/* المنتجات المفضلة */}
        {productFavorites.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <MainHeading text="المنتجات المفضلة" />
              <p className="text-primary cursor-pointer hover:underline">المزيد</p>
            </div>
            <FavouritesSlider items={productFavorites} type="products" />
          </div>
        )}

        {/* المتاجر المفضلة */}
        {storeFavorites.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <MainHeading text="المتاجر المفضلة" />
              <p className="text-primary cursor-pointer hover:underline">المزيد</p>
            </div>
            <FavouritesSlider items={storeFavorites} type="products" />
          </div>
        )}

        {/* الوظائف المفضلة */}
        {jobFavorites.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <MainHeading text="الوظائف المفضلة" />
              <p className="text-primary cursor-pointer hover:underline">المزيد</p>
            </div>
            <FavouritesSlider items={jobFavorites} type="jobs" />
          </div>
        )}

        {/* الخدمات المفضلة */}
        {serviceFavorites.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <MainHeading text="الخدمات المفضلة" />
              <p className="text-primary cursor-pointer hover:underline">المزيد</p>
            </div>
            <FavouritesSlider items={serviceFavorites} type="services" />
          </div>
        )}

        {/* Empty state */}
        {favorites.length === 0 && (
          <div className="text-center p-8">
            <p className="text-gray-600">لا توجد عناصر في المفضلة</p>
            <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة منتجات أو متاجر إلى المفضلة</p>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default Favourites;
