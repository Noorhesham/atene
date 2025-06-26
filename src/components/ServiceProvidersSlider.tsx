import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";
import MaxWidthWrapper from "./MaxwidthWrapper";

interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  image: string;
}

const providers: ServiceProvider[] = [
  { id: "1", name: "Jonathan Barker", email: "cora_haley@quinn.biz", image: "/unsplash_Zf80cYcxSFA (1).png" },
  { id: "2", name: "Jonathan Barker", email: "cora_haley@quinn.biz", image: "/unsplash_Zf80cYcxSFA (1).png" },
  { id: "3", name: "Jonathan Barker", email: "cora_haley@quinn.biz", image: "/unsplash_Zf80cYcxSFA (1).png" },
  { id: "4", name: "Jane Doe", email: "jane.doe@example.com", image: "/unsplash_Zf80cYcxSFA (2).png" },
  { id: "5", name: "Jane Doe", email: "jane.doe@example.com", image: "/unsplash_Zf80cYcxSFA (2).png" },
];

const ServiceProvidersSlider = () => {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);

  return (
    <div className="w-full my-3 sm:my-5" dir="rtl">
      <MaxWidthWrapper noPadding>
        <div className="flex justify-between items-center mb-4 sm:mb-6 px-3 sm:px-4">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-[#395A7D]">مقدمو الخدمة</h2>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => swiper?.slidePrev()}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F3F9FB] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Previous service provider"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#287CDA]" />
            </button>
            <button
              onClick={() => swiper?.slideNext()}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F3F9FB] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Next service provider"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#287CDA]" />
            </button>
          </div>
        </div>
        <Swiper
          modules={[Navigation]}
          onSwiper={setSwiper}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 1.8,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2.8,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3.2,
              spaceBetween: 24,
            },
          }}
          className="!px-4"
        >
          {providers.map((provider) => (
            <SwiperSlide key={provider.id} className="h-auto">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative w-full pt-[75%] rounded-t-2xl">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="text-[#202224] font-bold text-sm sm:text-base mb-1">{provider.name}</h3>
                  <p className="text-[#202224] text-xs sm:text-sm mb-3">{provider.email}</p>
                  <button
                    className="w-full bg-white text-[#287CDA] border border-[#287CDA] py-1.5 sm:py-2.5 rounded-lg 
                    flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                  >
                    <span className="font-semibold">تواصل معي</span>
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </MaxWidthWrapper>
    </div>
  );
};

export default ServiceProvidersSlider;
