import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, Clock, MessageCircle, Star, X } from "lucide-react";

interface FavouriteItem {
  id: string;
  title: string;
  image: string;
  category?: string;
  type: "product" | "job" | "service";
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
  type: "products" | "jobs" | "services";
}

const FavouritesSlider: React.FC<FavouritesSliderProps> = ({ items, type }) => {
  const getSlideContent = (item: FavouriteItem) => {
    switch (type) {
      case "products":
        return (
          <div className="bg-white overflow-hidden h-full">
            <div className="aspect-square shadow-md rounded-lg overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-[600] text-right mb-2 line-clamp-2">{item.title}</h3>
              {item.price && (
                <div className="flex justify-start gap-2 items-center">
                  <span className="text-sm font-bold">${item.price}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "jobs":
        return (
          <div className="bg-white overflow-hidden h-full">
            <div className="aspect-square shadow-md rounded-lg overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
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
            <div className="p-1">
              <div className=" flex flex-col  gap-4">
                <div className="w-full h-[230px] rounded overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-right">
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
                  <div className="flex justify-end gap-2 mt-3">
                    <button className="px-2 flex items-center gap-2 py-1 text-xs bg-gradient-to-r from-[#5E8CBE] to-[#3B5D80] text-white rounded-full border border-primary hover:bg-primary hover:text-white transition-colors">
                      تواصل معي <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="px-2  flex items-center gap-2 py-1 text-xs rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                      بلغ عن إساءة <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          640: {
            slidesPerView: 2.2,
          },
          768: {
            slidesPerView: 3.2,
          },
          1024: {
            slidesPerView: 4.2,
          },
          1280: {
            slidesPerView: 5.2,
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
        className="!overflow-visible"
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
