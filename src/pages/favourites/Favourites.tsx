import MainHeading from "@/components/MainHeading";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import FavouritesSlider from "@/components/FavouritesSlider";
import React, { useState, useEffect } from "react";
import { getAllFavorites } from "@/utils/api/product";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

// Static data for favorites (commented out - using API now)
// const favouriteProducts = [
//   {
//     id: "1",
//     title: "LAROSAC",
//     image: "/Frame 1000005447 (1).png",
//     price: 200,
//     originalPrice: 230,
//     type: "product" as const,
//   },
//   {
//     id: "2",
//     title: "ZARA",
//     image: "/Frame 1000005447 (2).png",
//     price: 150,
//     originalPrice: 180,
//     type: "product" as const,
//   },
//   {
//     id: "3",
//     title: "H&M",
//     image: "/Frame 1000005447 (4).png",
//     price: 120,
//     originalPrice: 150,
//     type: "product" as const,
//   },
// ];

// const marketingProducts = [
//   {
//     id: "1",
//     title: "متجر الأزياء",
//     image: "/Frame 1000005447 (5).png",
//     type: "product" as const,
//     description: "متجر متخصص في الأزياء النسائية",
//   },
//   {
//     id: "2",
//     title: "متجر الإلكترونيات",
//     image: "/Frame 1000005447 (6).png",
//     type: "product" as const,
//     description: "متجر متخصص في الإلكترونيات",
//   },
// ];

// const jobOffers = [
//   {
//     id: "1",
//     title: "مصمم جرافيك",
//     image: "/Frame 1000005447 (7).png",
//     type: "job" as const,
//     description: "مطلوب مصمم جرافيك للعمل بدوام كامل",
//   },
//   {
//     id: "2",
//     title: "مطور ويب",
//     image: "/Frame 1000005447 (8).png",
//     type: "job" as const,
//     description: "مطلوب مطور ويب للعمل عن بعد",
//   },
// ];

// const services = [
//   {
//     id: "1",
//     title: "تصميم مواقع",
//     image: "/Frame 1000005447 (9).png",
//     type: "service" as const,
//     description: "خدمات تصميم وتطوير المواقع",
//   },
//   {
//     id: "2",
//     title: "تسويق إلكتروني",
//     image: "/Frame 1000005520.png",
//     type: "service" as const,
//     description: "خدمات التسويق الإلكتروني",
//   },
// ];

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

interface FavoriteAPIItem {
  favs_id: string;
  favs_type: "product" | "store" | "service" | "job";
  product?: {
    title?: string;
    cover?: string;
    images?: Array<{ src: string }>;
    price?: number;
    original_price?: number;
  };
  store?: {
    name?: string;
    logo?: string;
    cover?: string;
    description?: string;
  };
  service?: {
    title?: string;
    image?: string;
    description?: string;
  };
  job?: {
    title?: string;
    image?: string;
    description?: string;
  };
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
        const transformedFavorites: FavoriteItem[] = response.favorites.map((fav: any) => {
          if (fav.favs_type === "product" && fav.product) {
            const product = fav.product as FavoriteAPIItem["product"];
            return {
              id: fav.favs_id,
              title: product?.title || "منتج غير معروف",
              image: product?.cover || product?.images?.[0]?.src || "/placeholder.png",
              price: product?.price,
              originalPrice: product?.original_price,
              type: "product" as const,
            };
          } else if (fav.favs_type === "store" && fav.store) {
            const store = fav.store as FavoriteAPIItem["store"];
            return {
              id: fav.favs_id,
              title: store?.name || "متجر غير معروف",
              image: store?.logo || store?.cover || "/placeholder.png",
              type: "product" as const, // Map store to product type for display
              description: store?.description,
            };
          } else if (fav.favs_type === "service" && fav.service) {
            const service = fav.service as FavoriteAPIItem["service"];
            return {
              id: fav.favs_id,
              title: service?.title || "خدمة غير معروفة",
              image: service?.image || "/placeholder.png",
              type: "service" as const,
              description: service?.description,
            };
          } else if (fav.favs_type === "job" && fav.job) {
            const job = fav.job as FavoriteAPIItem["job"];
            return {
              id: fav.favs_id,
              title: job?.title || "وظيفة غير معروفة",
              image: job?.image || "/placeholder.png",
              type: "job" as const,
              description: job?.description,
            };
          }

          // Fallback for unknown types
          return {
            id: fav.favs_id,
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
