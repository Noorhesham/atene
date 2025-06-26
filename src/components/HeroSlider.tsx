import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  season?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  className?: string;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides, className }) => {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);

  return (
    <div className={cn("relative w-full", className)} dir="rtl">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        onSwiper={setSwiper}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
          bulletClass:
            "inline-block w-2.5 h-2.5 rounded-full bg-white/50 mx-1 cursor-pointer transition-all duration-300",
          bulletActiveClass: "!w-7 !bg-white",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full "
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-[200px] lg:h-96 bg-gradient-to-r  from-[#1E4D91] to-[#1E4D91]">
              {/* Background Image */}
              <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />

              {/* <div className="absolute inset-0 flex items-center bg-gradient-to-l from-[#1E4D91]/50 to-transparent">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                  <div className="max-w-2xl space-y-4 text-right">
                    {slide.season && (
                      <span className="inline-block text-white text-sm md:text-base mb-2">{slide.season}</span>
                    )}
                    <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">{slide.title}</h2>
                    {slide.subtitle && (
                      <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-lg mr-auto">
                        {slide.subtitle}
                      </p>
                    )}
                    <a
                      href={slide.buttonLink}
                      className="inline-block bg-[#33A7E7] text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors mt-4"
                    >
                      {slide.buttonText}
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        onClick={() => swiper?.slidePrev()}
        className=" absolute top-1/2 -translate-y-1/2 right-4 z-10 w-11 h-11 bg-[#dbe2ea] rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronRight className="w-5 h-5 text-[#374151]" />
      </button>

      <button
        onClick={() => swiper?.slideNext()}
        className=" absolute top-1/2 -translate-y-1/2 left-4 z-10 w-11 h-11 bg-[#dbe2ea] rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
        aria-label="Next slide"
      >
        <ChevronLeft className="w-5 h-5 text-[#374151]" />
      </button>

      {/* Custom Pagination */}
      <div className="swiper-pagination absolute bottom-6 left-0 right-0 z-10 flex justify-center items-center"></div>
    </div>
  );
};

export default HeroSlider;
