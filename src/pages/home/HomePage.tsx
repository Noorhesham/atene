import HeroSlider from "@/components/HeroSlider";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import TopNavBar from "@/components/TopNavBar";
import SwiperCarousel from "./HomeCauroselSmall";
import FavouritesSlider from "@/components/FavouritesSlider";
import ServiceProvidersSlider from "@/components/ServiceProvidersSlider";
import FeaturedSellersSlider from "@/components/FeaturedSellersSlider";
import { ChevronLeft, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProductsSlider from "@/components/FeaturedProductsSlider";
import DealsAndOffers from "@/components/DealsAndOffers";
import ProductRow from "@/components/ProductRow";

const heroSlides = [
  {
    id: "1",
    title: "مجموعة جديدة",
    subtitle: "نحن نعرف كيف ستعمل الكائنات الكبيرة ، ولكن الأشياء على نطاق صغير .",
    buttonText: "تسوق الآن",
    buttonLink: "/shop",
    image: "/home slider.png",
    season: "صيف 2025",
  },
  {
    id: "2",
    title: "ابحث عن الملابس التي تناسب اسلوبك",
    subtitle: "تصفح مجموعتنا المتنوعة من الملابس المصنوعة بعناية، والمصممة لإبراز شخصيتك وتلبية ذوقك في الأناقة.",
    buttonText: "تسوق الآن",
    buttonLink: "/shop",
    image: "/home slider (1).png",
  },
];
const services = [
  {
    id: "15",
    title: "EtnixByron",
    image: "/unsplash_d1UPkiFd04A.png",
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
    image: "/unsplash_d1UPkiFd04A.png",
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
    image: "/1213.png",
    description: "نظام تسجيل الدخول لم يكتمل بعد. سيتم تنفيذه في المستقبل القريب",
    type: "service" as const,
    author: {
      name: "Abanob Ashraf",
    },
    price: 400,
    reviewCount: 28,
    followers: ["/CommenterAvatar.png", "/CommenterAvatar (1).png", "/Frame 1261155013.png"],
  },
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
    image: "/unsplash_d1UPkiFd04A.png",
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
    image: "/1213.png",
    description: "نظام تسجيل الدخول لم يكتمل بعد. سيتم تنفيذه في المستقبل القريب",
    type: "service" as const,
    author: {
      name: "Abanob Ashraf",
    },
    price: 400,
    reviewCount: 28,
    followers: ["/CommenterAvatar.png", "/CommenterAvatar (1).png", "/Frame 1261155013.png"],
  },
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
    image: "/unsplash_d1UPkiFd04A.png",
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
    image: "/1213.png",
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

const todayDeals = [
  {
    id: "1",
    title: "جزمة كعب مستعملة",
    image: "/Frame 1000005520.png",
    price: 200,
    originalPrice: 230,
    discount: 13,
    rating: 4.5,
  },
  {
    id: "2",
    title: "بانلي panasonic",
    image: "/Frame 1000005520 (1).png",
    price: 200,
    originalPrice: 230,
    discount: 13,
    rating: 4.5,
    isOfficial: true,
  },
  {
    id: "3",
    title: "كوتشي نايك",
    image: "/Frame 1000005519 (1).png",
    price: 200,
    originalPrice: 230,
    discount: 13,
    rating: 4.5,
  },
  {
    id: "4",
    title: "مكتب مودرن بسعر المصنع",
    image: "/Frame 1000005466.png",
    price: 200,
    originalPrice: 230,
    discount: 13,
    rating: 4.5,
  },
  {
    id: "5",
    title: "مجموعة العناية بالشفايف",
    image: "/Frame 1000005447 (7).png",
    price: 200,
    originalPrice: 230,
    discount: 13,
    rating: 4.5,
  },
  {
    id: "6",
    title: "بودرة اللؤلؤ للبشره",
    image: "/Frame 1000005447 (8).png",
    price: 200,
    originalPrice: 230,
    discount: 13,
    rating: 4.5,
  },
  {
    id: "7",
    title: "ستيل لأعمال الترابيزات",
    image: "/Frame 1000005447 (9).png",
    price: 200,
    originalPrice: 230,
    discount: 13,
    rating: 4.5,
  },
  {
    id: "8",
    title: "عطر الرجولة الجذابة",
    image: "/Frame 1000005523.png",
    price: 200,
    originalPrice: 230,
    discount: 13,
    rating: 4.5,
  },
];

const promoCategories = [
  {
    title: "أقل سعر خلال 90 يوم",
    images: ["/il_100x100.3400269364_k196.jpg (1).png", "/il_100x100.3400269364_k196.jpg (2).png"],
  },
  {
    title: "السكن المنزلي",
    images: ["/s2.png", "/ask1.png"],
  },
  {
    title: "المنتجات المميزة",
    images: ["/ask2.png", "/unsplash_em37kS8WJJQ.png"],
  },
];

const featuredProducts = [
  {
    id: "1",
    title: "اساور و انسيالات نحاس تصميم يدوى باحجار طبيعية",
    image: "/il_100x100.3400269364_k196.jpg (11).png",
  },
  { id: "2", title: "سلاسل وتوايس بنالى", image: "/il_100x100.3400269364_k196.jpg (12).png" },
  { id: "3", title: "عطر نادر للذوق الرفيع", image: "/il_100x100.3400269364_k196.jpg (13).png" },
  { id: "4", title: "سلسلة ستانلس", image: "/il_100x100.3400269364_k196.jpg (14).png" },
  { id: "5", title: "طقم قطعتين بنطلون شداد", image: "/il_100x100.3400269364_k196.jpg (15).png" },
];

const beautyProducts = [
  { id: "b1", title: "عطر", image: "/il_100x100.3400269364_k196.jpg (21).png", type: "simple" as const },
  {
    id: "b2",
    title: "سنسال الحب",
    image: "/il_100x100.3400269364_k196.jpg.png",
    isFavorite: true,
    type: "simple" as const,
  },
  {
    id: "b3",
    title: "طاقم اديداس ايطالي",
    image: "/il_100x100.3400269364_k196.jpg (3).png",
    type: "detailed" as const,
    price: 300,
    rating: 2.0,
    views: 700,
    seller: "اسم المتجر",
    subtitle: "O.TWO.O DREAM DIAMOND",
  },
  {
    id: "b4",
    title: "POWDER 22",
    image: "/il_100x100.3400269364_k196.jpg (4).png",
    isNew: true,
    type: "simple" as const,
    subtitle: "#22",
  },
];

const clothingProducts = [
  { id: "c1", title: "عطر", image: "/il_100x100.3400269364_k196.jpg (21).png", type: "simple" as const },
  {
    id: "c2",
    title: "طقم قطعتين ستان تركي عالي الجودة تحفة",
    image: "/il_100x100.3400269364_k196.jpg (5).png",
    type: "simple" as const,
  },
  {
    id: "c3",
    title: "يجد الطقم دة في قلبي تحفة",
    image: "/il_100x100.3400269364_k196.jpg (6).png",
    type: "simple" as const,
  },
  { id: "c4", title: "بنطلون شي ان", image: "/il_100x100.3400269364_k196.jpg (7).png", type: "simple" as const },
];

const kidsProducts = [
  { id: "k1", title: "عطر", image: "/il_100x100.3400269364_k196.jpg (21).png", type: "simple" as const },
  {
    id: "k2",
    title: 'كتاب تعليمي للأطفال "كيف تزيد من ذكاء طفلك وشغفه"',
    image: "/il_100x100.3400269364_k196.jpg (8).png",
    type: "simple" as const,
  },
  {
    id: "k3",
    title: "العاب كيدز اريا جديدة البيع لدواعي السفر",
    image: "/il_100x100.3400269364_k196.jpg (9).png",
    type: "simple" as const,
  },
  {
    id: "k4",
    title: 'كتاب تعليمي للأطفال "كيف تنظف اسنانك"',
    image: "/il_100x100.3400269364_k196.jpg (10).png",
    type: "simple" as const,
  },
];

const HomePage = () => {
  return (
    <div className="bg-[#F3F9FB]">
      <div className="bg-white">
        <HeroSlider slides={heroSlides} />
        <TopNavBar />
        <SwiperCarousel />
        <MaxWidthWrapper noPadding className="py-8 md:py-12">
          <div className="flex flex-col gap-4 px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <h2 className="text-2xl lg:text-4xl font-bold text-[#395A7D]">الخدمات مميزة</h2>
            </div>
            <FavouritesSlider slidesPerView={4} items={services} type="services" />
          </div>
        </MaxWidthWrapper>
        <ServiceProvidersSlider />
        <FeaturedSellersSlider />
        <MaxWidthWrapper className="min-h-[250px] h-auto lg:h-[250px] lg:my-12 my-6 rounded-2xl w-full relative overflow-hidden p-4 sm:p-6 md:p-0">
          <img src="/Rectangle 303 (1).png" alt="" className="w-full absolute top-0 left-0 h-full object-cover" />
          <div className="relative md:absolute inset-0 flex flex-col md:flex-row justify-between md:px-8 lg:px-12 text-white gap-4">
            <div className="flex flex-col gap-3 md:gap-4 my-auto">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-2">
                  <img src="/Frame 1000005520 (1).png" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" alt="" />
                  <div className="flex flex-col items-start justify-between">
                    <h3 className="text-xs sm:text-sm md:text-base"> اسم الشركة</h3>
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-2 h-2 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-lg sm:text-xl md:text-3xl lg:text-5xl max-w-xl font-bold order-1 md:order-2 leading-tight">
                مطلوب مطور php للعمل لدى شركة dah Technology
              </h2>
            </div>
            <button
              className="bg-[#23A6F0] text-white md:left-10 self-start md:absolute md:bottom-8 lg:bottom-10 
              text-xs sm:text-sm lg:text-[19px] hover:bg-gray-100 transition-colors 
              px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 h-fit rounded-full w-fit font-semibold"
            >
              عرض المزيد
            </button>
          </div>
        </MaxWidthWrapper>
        <MaxWidthWrapper noPadding className="py-8 md:py-16">
          <div className="flex flex-col gap-4 px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <h2 className="text-2xl lg:text-4xl font-bold text-[#395A7D]">الخدمات الأكثر شعبية</h2>
              <button
                className="bg-[#287CDA] text-white text-sm lg:text-[19px] self-start md:self-auto
             hover:bg-gray-100 flex items-center transition-colors px-4 sm:px-8 py-2 h-fit rounded-full w-fit font-semibold"
              >
                عرض الكل <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
            <FavouritesSlider slidesPerView={4} items={services} type="services" />
          </div>
        </MaxWidthWrapper>
        <MaxWidthWrapper noPadding className="px-4 md:px-0">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <h2 className="text-2xl lg:text-4xl font-bold text-[#395A7D]">المنتجات الأكثر شعبية</h2>
              <button
                className="bg-[#287CDA] text-white text-sm lg:text-[19px] self-start md:self-auto
                hover:bg-gray-100 flex items-center transition-colors px-4 sm:px-8 py-2 h-fit rounded-full w-fit font-semibold"
              >
                عرض الكل <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {favouriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    title: product.title,
                    images: [{ src: product.image, alt: product.title }],
                    price: product.price,
                    originalPrice: product.originalPrice,
                    discount: Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100),
                    rating: 4.5,
                    id: product.id,
                  }}
                />
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
        <MaxWidthWrapper className="px-4 md:px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <h2 className="text-2xl lg:text-4xl font-bold text-[#395A7D]">عروض اليوم الكبرى</h2>
              <button
                className="bg-[#287CDA] text-white text-sm lg:text-[19px] self-start md:self-auto
                hover:bg-gray-100 flex items-center transition-colors px-4 sm:px-8 py-2 h-fit rounded-full w-fit font-semibold"
              >
                عرض الكل <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6">
              {todayDeals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    title: product.title,
                    images: [{ src: product.image, alt: product.title }],
                    price: product.price,
                    originalPrice: product.originalPrice,
                    discount: product.discount,
                    rating: product.rating,
                    id: product.id,
                    isNew: product.isOfficial,
                  }}
                />
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
        <MaxWidthWrapper noPadding>
          <div
            className="relative w-full h-auto md:h-[320px] bg-[#1D4F8B] rounded-2xl overflow-hidden my-12 p-8 md:p-0"
            dir="rtl"
          >
            {/* Backgrounds */}
            <div className="absolute inset-0 w-full bg-[#1D4F8B]"></div>
            <div className="absolute top-0 -left-20 w-full md:w-[60%] h-full">
              <svg
                className="w-full h-full"
                width="522"
                height="251"
                viewBox="0 0 522 251"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M519.232 15.211C523.119 8.54447 518.31 0.173828 510.593 0.173828H10C4.47717 0.173828 0 4.65098 0 10.1738V240.174C0 245.697 4.47717 250.174 10 250.174H511.827C519.259 250.174 524.094 242.354 520.773 235.705L463.157 120.355C461.65 117.338 461.766 113.764 463.465 110.85L519.232 15.211Z"
                  fill="#277AD6"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full md:px-12 gap-8">
              {/* Right side: Text */}
              <div className="text-white text-right max-w-xs w-full">
                <h2 className="text-3xl md:text-4xl font-bold">سوبر سبتمبر</h2>
                <h3 className="text-2xl md:text-3xl font-bold mt-1">الاستعانة بمصادر دليل</h3>
                <p className="text-xs mt-4 leading-relaxed opacity-90">
                  كيفية الاستفادة من المنتجات المخفضة السعر, ثابتة مواعيد التسليم, والمدفوعات المرنة هذا الشهر
                </p>
                <button className="bg-[#F0F2F5] text-[#1D4F8B] font-bold px-8 py-3 rounded-full mt-6 hover:bg-gray-200 transition-colors w-full md:w-auto">
                  تعرف على المزيد
                </button>
              </div>

              {/* Left side: Cards */}
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                {promoCategories.map((category, index) => (
                  <div key={index} className="bg-white rounded-2xl p-3 w-full md:w-[250px] text-right">
                    <h4 className="font-semibold text-gray-800 mr-auto w-fit mb-4 pr-2">{category.title}</h4>
                    <div className="flex gap-2">
                      <img
                        src={category.images[0]}
                        alt={category.title}
                        className="w-1/2 h-28 object-cover rounded-lg"
                      />
                      <img
                        src={category.images[1]}
                        alt={category.title}
                        className="w-1/2 h-28 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      <div className="py-1">
        <CategoryShowcase />
      </div>
      <div className="py-1">
        <FeaturedProductsSlider products={featuredProducts} />
      </div>
      <div className="">
        <DealsAndOffers />
      </div>
      {/* Beauty and Accessories Section */}
      <div className="py-4">
        <ProductRow
          category={{ name: "الجمال والاكسسوارات", image: "/unsplash_em37kS8WJJQ (2).png" }}
          products={beautyProducts}
        />
      </div>
      {/* Clothing and Shoes Section */}
      <div className="py-4">
        <ProductRow
          category={{ name: "الملابس والأحذية", image: "/Frame 1000005521.svg" }}
          products={clothingProducts}
        />
      </div>
      {/* Kids Section */}
      <div className="py-4">
        <ProductRow category={{ name: "الأطفال", image: "/Frame 1000005521 (1).svg" }} products={kidsProducts} />
      </div>

      {/* New Footer-like section from image */}
      <div className="bg-gradient-to-b from-[#154274] to-[#287CDA] text-white py-12 md:py-20 px-4">
        <MaxWidthWrapper>
          <div className="flex flex-col md:flex-row justify-between items-center text-right gap-12 md:gap-16" dir="rtl">
            {/* Right side of image (text and stats) */}
            <div className="flex-1">
              <p className="text-base leading-relaxed max-w-lg">
                lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim في eros elementum
                tristique. DUIS CURSUS . MI QUIS VIVERRA ORNARE . EROS DOLOR Interdum nulla. UT Commodo Diam Libero
                Vitae erat.
              </p>
              <div className="flex mt-8 gap-8">
                <div>
                  <p className="text-4xl md:text-5xl font-bold">99%</p>
                  <p className="mt-2 text-sm max-w-[200px]">
                    lorem ipsum dolor sit amet, incectetur adipiscing leit. Superendisse varius enim في eros.
                  </p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold">100%</p>
                  <p className="mt-2 text-sm max-w-[200px]">
                    lorem ipsum dolor sit amet, incectetur adipiscing leit. Superendisse varius enim في eros.
                  </p>
                </div>
              </div>
            </div>

            {/* Left side of image (title, logo, button) */}
            <div className="flex-1 flex flex-col items-center md:items-start w-full">
              <div className="flex items-center gap-4">
                <img src="/LOGO-H-WHITE.svg" alt="A'atene Logo" className="w-32 md:w-40 h-auto" />
                <img src="/ad.svg" alt="A'atene A" className="w-16 h-16 md:w-20 md:h-20" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 max-w-md text-center md:text-right">
                إلقاء نظرة على أبعاد البيع الفريدة لدينا
              </h2>
              <button className="mt-8 bg-gray-800 bg-opacity-50 text-white font-bold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-opacity-70 transition-all w-full justify-center md:w-auto">
                <span>اقرأ المزيد</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Latest Articles Section */}
      <div className="">
        <MaxWidthWrapper>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4" dir="rtl">
            <h2 className="text-3xl font-bold text-gray-800 self-start">آخر المقالات</h2>
            <button className="bg-[#287CDA] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 self-start md:self-auto mt-4 md:mt-0">
              اقرأ جميع المدونات <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-right px-4" dir="rtl">
            {articles.map((article) => (
              <div key={article.id} className=" rounded-lg overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full rounded-xl h-64 object-cover" />
                <div className="p-6 flex gap-2">
                  <img src="/Frame 1000005521 (1).svg" alt="" className="w-7 h-7 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500 mb-2">
                      {article.author} • {article.date}
                    </p>
                  </div>
                </div>
                <p className="text-[#404040] px-4 text-xl">{article.description}</p>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Customer Reviews Section */}
      <div className="">
        <MaxWidthWrapper>
          <h2 className="text-3xl font-bold text-right mb-8 text-gray-800 px-4">آراء مستخدمين أعطيني</h2>
          <FavouritesSlider items={reviews} type="reviews" slidesPerView={3} />
        </MaxWidthWrapper>
      </div>
    </div>
  );
};

const articles = [
  {
    id: 1,
    image: "/unsplash_oIlix2slmsI.png",
    author: "أوليفر بينيت",
    date: "18 يناير 2022",
    title: "أتقن جمال الطبيعة الهادئة مع شروق الشمس فوق الحقول الخضراء",
    description: "انغمس في جمال المشاهد الساحرة للممشى البحري.",
  },
  {
    id: 2,
    image: "/unsplash_9Huby3g9fN0.png",
    author: "أوليفر بينيت",
    date: "18 يناير 2022",
    title: "غامر في أجواء المدينة النابضة بالحياة، حيث تتألق الأضواء وسط العمران الشاهق",
    description: "ستمتع بجمال المشاهد الساحرة على الممشى البحري",
  },
  {
    id: 3,
    image: "/unsplash_Zf80cYcxSFA.png",
    author: "أوليفر بينيت",
    date: "18 يناير 2022",
    title: "ستمتع بجمال المشاهد الساحرة على الممشى البحري",
    description: "أتقن جمال الطبيعة الهادئة مع شروق الشمس فوق الحقول الخضراء",
  },
];

const reviews = [
  {
    id: "r1",
    type: "reviews" as const,
    rating: 5,
    author: { name: "سارة م." },
    description:
      "لقد أذهلتني مجموعة العناية بالبشرة حقًا. لقد كانت بشرتي باهتة وجافة، ولكن بعد استخدام هذه المنتجات لبضعة أسابيع فقط، أصبحت بشرتي أكثر إشراقًا ونعومة بشكل ملحوظ. المكونات عالية الجودة وتستحق السعر بالتأكيد. أوصي بها بشدة!",
    image: "/placeholder.png",
  },
  {
    id: "r2",
    type: "reviews" as const,
    rating: 5,
    author: { name: "أبانوب أشرف" },
    description:
      "كنت أعثر على ملابس تتماشى مع لون بشرتي الشخصي. يحلّي هذا الاكتشاف متجر (dōt). إن مجموعة الماركات التي يقدمونها رائعة حقًا، حيث تلبي جميعها مجموعة متنوعة من الأذواق والمناسبات.",
    image: "/placeholder.png",
  },
  {
    id: "r3",
    type: "reviews" as const,
    rating: 4,
    author: { name: "مستخدم آخر" },
    description: "منتج رائع وخدمة عملاء ممتازة. سأعود للتسوق مرة أخرى بالتأكيد.",
    image: "/placeholder.png",
  },
  {
    id: "r4",
    type: "reviews" as const,
    rating: 5,
    author: { name: "سارة م." },
    description:
      "لقد أذهلتني مجموعة العناية بالبشرة حقًا. لقد كانت بشرتي باهتة وجافة، ولكن بعد استخدام هذه المنتجات لبضعة أسابيع فقط، أصبحت بشرتي أكثر إشراقًا ونعومة بشكل ملحوظ. المكونات عالية الجودة وتستحق السعر بالتأكيد. أوصي بها بشدة!",
    image: "/placeholder.png",
  },
];

export default HomePage;
