import React, { useState } from "react";
import StoreProfile from "@/components/StoreProfile";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import StoreHighlights from "@/components/StoreHighlights";
import { Facebook, Instagram, Link2, Grid, QrCode, Copy } from "lucide-react";
import StoreSidebar from "@/components/StoreSidebar";
import StoreReviews from "@/components/reviews/StoreReviews";
import ProductCard from "@/components/ProductCard";
import StoreProducts from "@/components/StoreProducts";
import ModalCustom from "@/components/ModalCustom";
import type { CrossSellProduct } from "@/types/product";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.375 7.5V12.5C14.375 14.57 12.695 16.25 10.625 16.25C8.555 16.25 6.875 14.57 6.875 12.5C6.875 10.43 8.555 8.75 10.625 8.75V11.25C9.935 11.25 9.375 11.81 9.375 12.5C9.375 13.19 9.935 13.75 10.625 13.75C11.315 13.75 11.875 13.19 11.875 12.5V3.75H14.375C14.375 5.82 16.055 7.5 18.125 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const sampleStories = [
  { id: "1", username: "user012", imageUrl: "/CommenterAvatar.png" },
  { id: "2", username: "user012", imageUrl: "/CommenterAvatar (1).png" },
  { id: "3", username: "Richards", imageUrl: "/Frame 1000005447 (1).png" },
  { id: "4", username: "Hawkins", imageUrl: "/Frame 1000005447 (2).png" },
  { id: "5", username: "Fox", imageUrl: "/Frame 1000005447 (4).png" },
  { id: "6", username: "Warren", imageUrl: "/Frame 1000005447 (5).png" },
  { id: "7", username: "Hawkins", imageUrl: "/Frame 1000005447 (6).png" },
  { id: "8", username: "Lane", imageUrl: "/Frame 1000005447 (7).png" },
  { id: "9", username: "Edwards", imageUrl: "/Frame 1000005447 (8).png" },
  { id: "10", username: "Warren", imageUrl: "/Frame 1000005447 (9).png" },
  { id: "11", username: "Edwards", imageUrl: "/unsplash_9Huby3g9fN0.png" },
  { id: "12", username: "Lane", imageUrl: "/unsplash_em37kS8WJJQ.png" },
];

const StorePage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("تم النسخ بنجاح!", {
        position: "top-center",
        style: { direction: "rtl" },
      });
    });
  };

  const socialLinks = [
    { icon: <Link2 className="w-5 h-5 text-gray-600" />, label: "Website", url: "https://www.etnix.com.au" },
    { icon: <Grid className="w-5 h-5 text-gray-600" />, label: "Grid", url: "https://www.etnix.com.au/grid" },
    {
      icon: <Facebook className="w-5 h-5 text-gray-600" />,
      label: "Facebook",
      url: "https://www.facebook.com/Etnix.byron",
    },
    {
      icon: <Instagram className="w-5 h-5 text-gray-600" />,
      label: "Instagram",
      url: "https://www.instagram.com/etnix.byron",
    },
    { icon: <TikTokIcon />, label: "TikTok", url: "https://www.tiktok.com/@etnix.byron" },
  ];

  const qrCodeValue = "0xec7842178520bb71f30523bcce4c10adc7e1cec4";

  // Data for StoreProfile component
  const profileData = {
    id: "1",
    name: "EtnixByron",
    avatar: "https://ui-avatars.com/api/?name=Etnix&background=FFF&color=000&bold=true&size=256",
    location: "خليج بايرون، أستراليا",
    bio: "زي الجينات، الجينات الأنيقة الرائع لمهرجان بوهيمي",
    rating: 4.5,
    reviewCount: 32,
    followers: 350,
    followersAvatars: [
      "https://randomuser.me/api/portraits/women/32.jpg",
      "https://randomuser.me/api/portraits/men/45.jpg",
      "https://randomuser.me/api/portraits/women/65.jpg",
      "https://randomuser.me/api/portraits/men/22.jpg",
      "https://randomuser.me/api/portraits/women/54.jpg",
    ],
    coverImages: [
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
  };

  // Data for StoreReviews component
  const reviewsData = {
    id: 1,
    slug: "etnix-byron",
    name: "EtnixByron",
    status: "active",
    phone: "+61 123 456 789",
    whats_app: "+61 123 456 789",
    email: "contact@etnix.com.au",
    address: "123 Byron Bay, NSW 2481, Australia",
    lat: -28.6474,
    lng: 153.602,
    logo: "https://ui-avatars.com/api/?name=Etnix&background=FFF&color=000&bold=true&size=256",
    cover: "https://images.unsplash.com/photo-1523381294911-8d3cead13475",
    review_rate: 4.5,
    review_count: 32,
    weekends: "Saturday,Sunday",
    am_i_following: false,
    created_at: "2017-01-01",
    updated_at: "2023-01-01",
    orders_count: 27,
  };

  const stats = [
    { icon: "/clock.svg", title: "مواعيد العمل", value: "1PM - 9PM" },
    { icon: "/Stories-heart.svg", title: "مفضلة", value: "30" },
    { icon: "/box.svg", title: "الطلبات", value: "27" },
    { icon: "/lasticonatene.svg", title: "على Aatene منذ", value: "2017" },
  ];

  // Dummy data for discounts
  const discountProducts = [
    {
      id: "1",
      title: "مضرب تنس Wilson",
      price: 720.54,
      originalPrice: 1200.58,
      discount: 40,
      cover: "/Frame 1000005447 (1).png",
      slug: "wilson-tennis",
    },
    {
      id: "2",
      title: "مضرب تنس Wilson مع حذاء رياضي",
      price: 720.54,
      originalPrice: 1200.58,
      discount: 40,
      cover: "/Frame 1000005447 (2).png",
      slug: "wilson-tennis-shoes",
    },
    {
      id: "3",
      title: "مضرب تنس Wilson مع مستلزمات",
      price: 720.54,
      originalPrice: 1200.58,
      discount: 40,
      cover: "/Frame 1000005447 (4).png",
      slug: "wilson-tennis-kit",
    },
    {
      id: "4",
      title: "مضرب تنس Wilson احترافي",
      price: 720.54,
      originalPrice: 1200.58,
      discount: 40,
      cover: "/Frame 1000005447 (5).png",
      slug: "wilson-tennis-pro",
    },
  ];

  // Dummy data for offers/bundles
  const bundleOffers = [
    {
      id: "1",
      name: "مضرب تنس Wilson",
      cover: "/Frame 1000005447 (1).png",
      price: 720.54,
      price_after_discount: 600,
      slug: "wilson-tennis",
    },
    {
      id: 2,
      name: "حذاء رياضي",
      cover: "/Frame 1000005447 (2).png",
      price: 300,
      price_after_discount: 250,
      slug: "sports-shoes",
    },
    {
      id: 3,
      name: "كرات تنس",
      cover: "/Frame 1000005447 (4).png",
      price: 150,
      price_after_discount: 120,
      slug: "tennis-balls",
    },

    {
      id: "2",
      name: "مضرب تنس Wilson احترافي",
      cover: "/Frame 1000005447 (5).png",
      price: 920.54,
      price_after_discount: 800,
      slug: "wilson-tennis-pro",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <StoreProfile {...profileData} />
      <StoreHighlights stories={sampleStories} />
      <MaxWidthWrapper noPadding className="mt-8 border-2 border-input bg-white  rounded-3xl shadow-lg">
        {/* Tabs */}
        <div className="bg-white rounded-lg  mb-6 mt-3 overflow-hidden">
          <div className=" grid grid-cols-5 text-right" dir="rtl">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? " border-b-2 border-[#046CFF]"
                  : "text-gray-500 hover:text-gray-700 border-input border-b-2"
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "reviews"
                  ? "text-[#046CFF] border-b-2 border-[#046CFF]"
                  : "text-gray-500 hover:text-gray-700 border-input border-b-2"
              }`}
            >
              تقييمات المتجر
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "blog"
                  ? "text-[#046CFF] border-b-2 border-[#046CFF]"
                  : "text-gray-500 hover:text-gray-700 border-input border-b-2"
              }`}
            >
              المدونة
            </button>
            <button
              onClick={() => setActiveTab("discounts")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "discounts"
                  ? "text-[#046CFF] border-b-2 border-[#046CFF]"
                  : "text-gray-500 hover:text-gray-700 border-input border-b-2"
              }`}
            >
              تخفيضات
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "offers"
                  ? "text-[#046CFF] border-b-2 border-[#046CFF]"
                  : "text-gray-500 hover:text-gray-700 border-input border-b-2"
              }`}
            >
              عروض
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 bg-white lg:grid-cols-3 gap-8" dir="rtl">
            {/* Main Content */}
            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-6 gap-4 space-y-6">
              {" "}
              <div className="space-y-6 lg:col-span-1">
                <div className="grid grid-cols-3 lg:grid-cols-1">
                  {stats.map((stat, index) => (
                    <React.Fragment key={stat.title}>
                      <div className="flex flex-col items-center text-center py-2 lg:py-3">
                        <img src={stat.icon} alt={stat.title} className="h-5 w-5 lg:h-7 lg:w-7 mb-2 lg:mb-3" />
                        <p className="text-[10px] lg:text-xs text-gray-500 mb-1">{stat.title}</p>
                        <p className="font-semibold text-gray-600 text-sm lg:text-base tracking-wider">{stat.value}</p>
                      </div>
                      {index < stats.length - 1 && (
                        <div className="hidden lg:block">
                          <hr className="border-gray-200 mx-auto" style={{ width: "50%" }} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 text-sm lg:text-base font-[400] text-right space-y-3 lg:space-y-4">
                <p className="text-[#303030]">
                  شكراً لزيارتكم متجرنا! ***شحنة الولايات المتحدة الأمريكية**** وجميع عملائنا حول العالم: يُرجى العلم:
                  نُرسل جميع الطلبات الآن عبر البريد الجوي القياسي السريع، والذي يشمل خدمة التتبع! قد يستغرق الشحن من
                  أسبوع إلى أسبوعين.
                </p>
                <p className="text-[#303030]">
                  أوروبا وكندا: لقد بدأنا البريد الاسترالي بتحسين خدمات البريد، وإننا نشهد توصيلاً أسرع من الأشهر
                  الماضية. قد يستغرق الشحن من أسبوع إلى ثلاثة أسابيع.
                </p>
                <p className="text-[#303030]">
                  في متجرنا، ستجدون ملابس مصنوعة يدوياً من أجود الخامات الطبيعية، من تصميم وإنتاج دراسي وفيكي في
                  أستراليا، ونبيعها فريق صغير في بالي والهند.
                </p>
                <p className="text-[#303030]">
                  جميعها مصنوعة بعناية فائقة واهتمام بالغ بالتفاصيل، باستخدام مواد عضوية مستدامة قدر الإمكان.
                </p>
                <p className="text-[#303030]">
                  نحن نحب عملائنا، ولدينا سياسة إرجاع واسترداد بدون أي أسئلة. إذا اشتريتم بالألوان عند التسوق على صفحتنا
                  على Etsy، سنحرص دائماً على راحتكم ونضمن رضاكم التام عن مشترياتكم!
                </p>
                <p className="text-[#303030]">تفضلوا بزيارة موقعنا الإلكتروني: www.etnix.com.au</p>
                <p className="text-[#303030]">
                  تابعوا صفحتنا على فيسبوك للاطلاع على آخر الأخبار والتصاميم والتحديثات:
                  https://www.facebook.com/Etnix.byron
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="bg-white rounded-xl shadow-md p-3 border border-gray-100">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm text-[#3C5D80] font-bold">اختصارات المتجر:</span>
                  <div className="flex items-center gap-3">
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="flex items-center text-[#3C5D80] justify-center w-10 h-10 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        {link.icon}
                      </a>
                    ))}
                    <ModalCustom
                      btn={
                        <button
                          className="flex items-center text-[#3C5D80] justify-center w-10 h-10 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                          aria-label="عرض رمز QR"
                        >
                          <QrCode className="w-5 h-5 text-gray-600" />
                        </button>
                      }
                      content={
                        <div dir="rtl" className=" py-3 w-full">
                          <div className="flex flex-col sm:flex-row gap-6">
                            {" "}
                            <div className="flex-shrink-0 w-36 h-36 sm:w-48 sm:h-48">
                              <QRCodeSVG
                                value={`https://example.com/product/${Math.random().toString(36).substring(2, 15)}`}
                                size={192}
                                level="H"
                                includeMargin={true}
                                className="w-full h-full"
                              />
                            </div>
                            <div className="flex-grow space-y-4 text-right">
                              <p className="text-sm text-gray-700 leading-relaxed">
                                سماعة استريو logitech crystal audio للبيع كالجديدة استخدام بسيط جدا وارد الخارج بنصف
                                الثمن سعرها 8000 بدون فصال نهائي لعدم تضيع الوقت
                              </p>
                              <div className="text-sm">
                                <span className="text-gray-600">منتج من </span>
                                <a href="#" className="text-blue-600 font-semibold hover:underline">
                                  d-jewellry
                                </a>
                                <span className="text-gray-800 font-bold"> عمان</span>
                              </div>
                            </div>
                          </div>
                          <div
                            onClick={() => handleCopy(qrCodeValue)}
                            className="mt-6 bg-blue-50 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
                          >
                            <span className="font-mono text-sm text-gray-700 tracking-wider">{qrCodeValue}</span>
                            <div className="flex items-center gap-2 text-blue-600">
                              <Copy className="w-4 h-4" />
                              <span className="text-sm font-semibold">نسخ</span>
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>
              <StoreSidebar />
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <StoreReviews store={reviewsData} dummy={true} />
          </div>
        )}

        {activeTab === "blog" && <div className="bg-white rounded-lg shadow-sm p-6">{/* Blog content */}</div>}

        {activeTab === "discounts" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {discountProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "offers" && (
          <div className="bg-white my-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 rounded-lg shadow-sm  space-y-8">
            {bundleOffers.map((offer) => (
              <ProductItemCard product={offer as unknown as CrossSellProduct} />
            ))}
          </div>
        )}
      </MaxWidthWrapper>{" "}
      <StoreProducts />
    </div>
  );
};

export default StorePage;
const ProductItemCard = ({ product }: { product: CrossSellProduct }) => (
  <div className="flex flex-col items-center w-[214.36px]">
    {/* Image Container */}
    <div className="w-full h-[214.36px] ">
      <img src={product.cover || "/placeholder.png"} alt={product.name} className="w-full h-full object-cover" />
    </div>

    {/* Content */}
    <div className="w-full text-center">
      {/* Title */}
      <h3 className="text-[23.58px] font-bold text-[#616161]  mb-2">{product.name}</h3>

      {/* Description */}
      <p className="text-[14.29px] text-[#616161] mb-3 leading-tight">
        توصيل مشاوير اون لاين جميع انواع الحلويات الشرقية والغربية بسعر مغري جدا ومتاح التوصيل
      </p>

      {/* Price */}
      <div className="flex items-center justify-center gap-2 text-right">
        <span className="text-[#00B53F] text-[24px] font-bold">{product.price_after_discount.toFixed(2)} ₪</span>
        <span className="text-[#616161] text-sm">بدلاً من</span>
        <span className="text-[#FF3B3B] text-[16px] line-through">{product.price.toFixed(2)} ₪</span>
      </div>
    </div>
  </div>
);
