import MainHeading from "@/components/MainHeading";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import FavouritesSlider from "@/components/FavouritesSlider";
import React from "react";

// Dummy data using images from public folder
const favouriteProducts = [
  {
    id: "1",
    title: "LAROSAC",
    image: "/Frame 1000005447 (1).png",
    price: 200,
    originalPrice: 230,
    type: "product" as const,
  },
  {
    id: "2",
    title: "أحمر شفاه مات",
    image: "/Frame 1000005447 (2).png",
    price: 150,
    originalPrice: 180,
    type: "product" as const,
  },
  {
    id: "3",
    title: "LANEIGE",
    image: "/Frame 1000005447 (4).png",
    price: 300,
    originalPrice: 350,
    type: "product" as const,
  },
  {
    id: "4",
    title: "بودرة خدود وردية",
    image: "/Frame 1000005447 (5).png",
    price: 120,
    originalPrice: 150,
    type: "product" as const,
  },
];

const marketingProducts = [
  {
    id: "7",
    title: "عنوان المنتج عنوان المنتج عنوان المنتج",
    image: "/unsplash_9Huby3g9fN0.png",
    price: 199,
    originalPrice: 299,
    type: "product" as const,
  },
  {
    id: "8",
    title: "عنوان المنتج عنوان المنتج عنوان المنتج",
    image: "/unsplash_em37kS8WJJQ.png",
    price: 299,
    originalPrice: 399,
    type: "product" as const,
  },
  {
    id: "9",
    title: "عنوان المنتج عنوان المنتج عنوان المنتج",
    image: "/unsplash_Zf80cYcxSFA.png",
    price: 399,
    originalPrice: 499,
    type: "product" as const,
  },
  {
    id: "10",
    title: "عنوان المنتج عنوان المنتج عنوان المنتج",
    image: "/unsplash_oIlix2slmsI.png",
    price: 499,
    originalPrice: 599,
    type: "product" as const,
  },
];

const jobOffers = [
  {
    id: "11",
    title: "نظام تسجيل الدخول لم يكتمل بعد",
    image: "/Frame 1000005466.png",
    description: "سيتم تنفيذه في المستقبل القريب",
    category: "تطوير البرمجيات",
    type: "job" as const,
  },
  {
    id: "12",
    title: "نظام تسجيل الدخول لم يكتمل بعد",
    image: "/Frame 1000005520.png",
    description: "سيتم تنفيذه في المستقبل القريب",
    category: "التصميم",
    type: "job" as const,
  },
  {
    id: "13",
    title: "نظام تسجيل الدخول لم يكتمل بعد",
    image: "/Frame 1000005523.png",
    description: "سيتم تنفيذه في المستقبل القريب",
    category: "تحليل البيانات",
    type: "job" as const,
  },
  {
    id: "14",
    title: "نظام تسجيل الدخول لم يكتمل بعد",
    image: "/Frame 1261155013.png",
    description: "سيتم تنفيذه في المستقبل القريب",
    category: "إدارة المشاريع",
    type: "job" as const,
  },
];

const services = [
  {
    id: "15",
    title: "EtnixByron",
    image: "/Frame 1000005519 (1).png",
    description: "زي الجينيات القنبلة الرائع لمهرجان بوهيمي",
    type: "service" as const,
    author: {
      name: "EtnixByron",
    },
    price: 350,
    reviewCount: 32,
    followers: ["/CommenterAvatar.png", "/CommenterAvatar (1).png", "/Frame 1261155013.png"],
  },
  {
    id: "16",
    title: "خدمات تقنية",
    image: "/Frame 1000005520 (1).png",
    description: "نظام تسجيل الدخول لم يكتمل بعد. سيتم تنفيذه في المستقبل القريب",
    type: "service" as const,
    author: {
      name: "Jenny Wilson",
    },
    price: 250,
    reviewCount: 45,
    followers: ["/CommenterAvatar.png", "/CommenterAvatar (1).png", "/Frame 1261155013.png"],
  },
  {
    id: "17",
    title: "خدمات تسويقية",
    image: "/Frame 1000005520.png",
    description: "نظام تسجيل الدخول لم يكتمل بعد. سيتم تنفيذه في المستقبل القريب",
    type: "service" as const,
    author: {
      name: "Abanob Ashraf",
    },
    price: 400,
    reviewCount: 28,
    followers: ["/CommenterAvatar.png", "/CommenterAvatar (1).png", "/Frame 1261155013.png"],
  },
];

const Favourites = () => {
  return (
    <MaxWidthWrapper>
      <div className="space-y-8">
        {/* المفضلة */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <MainHeading text="المفضلة" />
            <p className="text-primary cursor-pointer hover:underline">المزيد</p>
          </div>
          <FavouritesSlider items={favouriteProducts} type="products" />
        </div>

        {/* المنتجات */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <MainHeading text="المنتجات" />
            <p className="text-primary cursor-pointer hover:underline">المزيد</p>
          </div>
          <FavouritesSlider items={marketingProducts} type="products" />
        </div>

        {/* الوظائف */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <MainHeading text="الوظائف" />
            <p className="text-primary cursor-pointer hover:underline">المزيد</p>
          </div>
          <FavouritesSlider items={jobOffers} type="jobs" />
        </div>

        {/* الخدمات */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <MainHeading text="الخدمات" />
            <p className="text-primary cursor-pointer hover:underline">المزيد</p>
          </div>
          <FavouritesSlider items={services} type="services" />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Favourites;
