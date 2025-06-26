import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import SellerActions from "./SellerActions";

interface FavouriteItem {
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

interface FavouritesSliderProps {
  items: FavouriteItem[];
  type: "products" | "jobs" | "services" | "reviews";
  slidesPerView?: number;
}

const FavouritesSlider: React.FC<FavouritesSliderProps> = ({ items, type, slidesPerView }) => {
  const getSlideContent = (item: FavouriteItem) => {
    switch (type) {
      case "products":
        return (
          <div className="bg-white overflow-hidden h-full">
            <div className="aspect-square shadow-md rounded-lg overflow-hidden">
              <img src={item.image} alt={item.title || ""} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-[600] text-[#616161] text-right  line-clamp-2">{item.title || ""}</h3>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-[14.29px] text-[#616161]">خيار باسعار وجودة مناسبة</p>
              {item.price && (
                <div className="flex justify-start gap-2 items-center">
                  <span className="text-sm font-bold">${item.price}</span>
                  {/* {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                  )} */}
                </div>
              )}
            </div>
          </div>
        );

      case "jobs":
        return (
          <div className="bg-white overflow-hidden h-full">
            <div className="aspect-square shadow-md rounded-lg overflow-hidden">
              <img src={item.image} alt={item.title || ""} className="w-full h-full object-cover" />
            </div>
            <div className="p-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title || ""} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col  gap-1 items-start justify-between mb-1">
                  <h3 className="font-semibold text-xs">اسم الشركة</h3>
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex  bg-black/60 rounded-3xl px-2 gap-2 py-1 items-center">
                  <span className="text-[8px] text-white">منذ 8 دقائق</span>
                  <Clock className="w-3 text-white h-3" />
                </div>
              </div>
              <p className="text-[9px] text-[#606060] mt-2 line-clamp-2">
                لوريم إيبسوم ألم سيت أميت، كونسيكتيور أديبي سكينج إليت، سيد ديام نونومي نيبه إيسمود تينسيدونت أوت لاوريت{" "}
              </p>
            </div>
          </div>
        );

      case "services":
        return (
          <div className="bg-white  rounded-lg shadow-sm overflow-hidden h-full">
            <div className="p-">
              <div className=" flex flex-col  gap-4">
                <div className="w-full h-[228px] rounded overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title || ""} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 pb-6 p-1 text-right">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex flex-col items-start justify-between mb-1">
                      {item.author?.name && <h3 className="font-semibold text-sm">{item.author.name}</h3>}
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600">متصل</span>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600">جديد</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="my-5">
                    <SellerActions />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "reviews":
        return (
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center h-full flex flex-col items-center justify-center"
            dir="rtl"
          >
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < (item.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            {item.author?.name && <h3 className="font-semibold text-lg mb-2">{item.author.name}</h3>}
            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden" dir="rtl">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={46}
        slidesPerView={slidesPerView || 1.2}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 16,
          },
          480: {
            slidesPerView: 1.8,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2.2,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 2.8,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: slidesPerView || 4.2,
            spaceBetween: 46,
          },
          1280: {
            slidesPerView: slidesPerView || 5.2,
            spaceBetween: 46,
          },
        }}
        navigation={{
          nextEl: `.swiper-button-next-${type}`,
          prevEl: `.swiper-button-prev-${type}`,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="!overflow-visible !py-5"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="h-auto">
            {getSlideContent(item)}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        className={`swiper-button-prev-${type} absolute top-1/2 -translate-y-1/2 right-4 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors`}
        aria-label="Previous slide"
        title="Previous slide"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>

      <button
        className={`swiper-button-next-${type} absolute top-1/2 -translate-y-1/2 left-4 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors`}
        aria-label="Next slide"
        title="Next slide"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};

export default FavouritesSlider;
