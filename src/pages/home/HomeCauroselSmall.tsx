"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";

const stories = [
  { id: 1, user: "متجر الشجعان", image: "/ask1.png", live: false },
  { id: 2, user: "متجر الأمل", image: "/ask2.png", live: true },
  { id: 3, user: "متجر الأحلام", image: "/unsplash_9Huby3g9fN0.png", live: false },
  { id: 4, user: "متجر الفرح", image: "/unsplash_em37kS8WJJQ.png", live: false },
  { id: 5, user: "متجر السعادة", image: "/unsplash_oIlix2slmsI.png", live: false },
  { id: 6, user: "متجر الأصدقاء", image: "/unsplash_Zf80cYcxSFA.png", live: false },
  { id: 7, user: "متجر آخر", image: "/unsplash_9Huby3g9fN0 (1).png", live: false },
  { id: 8, user: "متجر إضافي", image: "/unsplash_em37kS8WJJQ (1).png", live: false },
];

const HomeCauroselSmall = () => {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);

  return (
    <MaxWidthWrapper className="relative  overflow-hidden w-full">
      {/* Background Section */}
      <div className="flex ">
        <div className="relative bg-gradient-to-r from-green-500 to-green-600 rounded-2xl  min-w-[200px] p-6 mb-4">
          <div className=" bg-gradient-to-b z-0 to-black from-transparent h-full w-full absolute top-0 left-0" />
          <div className="flex flex-col-reverse z-10 relative items-center justify-between">
            <div className="flex ml-auto mt-2 flex-col-reverse items-center gap-4">
              <div className="w-16 h-20 relative">
                <img src="/TYPO-WHITE.png" alt="Woman with shopping bags" className="rounded-lg object-cover" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-1">تابع قصص</h2>
                <h3 className="text-xl font-bold mb-2">لافضل</h3>
                <p className="text-sm opacity-90">متاجر ومستخدمين</p>
                <p className="text-xs opacity-75 mt-1">Xatong</p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex ml-auto gap-2">
              <button
                onClick={() => swiper?.slidePrev()}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-black" />
              </button>
              <button
                onClick={() => swiper?.slideNext()}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-4 right-6">
            <p className="text-white text-xs opacity-75">متجر الأول</p>
          </div>
        </div>

        {/* Swiper Carousel */}
        <div className=" z-20 ml-20 absolute  -left-64 lg:-left-72 max-w-full">
          <Swiper modules={[Navigation]} onSwiper={setSwiper} spaceBetween={16} slidesPerView={"auto"} className="!p-6">
            {stories.map((story) => (
              <SwiperSlide key={story.id} className="!w-[160px] drop-shadow-lg">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-full h-[220px] rounded-2xl overflow-hidden group">
                    <img src={story.image} alt={story.user} className="w-full h-full object-cover" />
                    {story.live && (
                      <div className="absolute top-2 right-2 bg-[#10B981] text-white px-2 py-1 text-xs font-bold rounded-lg flex items-center gap-1">
                        Live
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{story.user}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default HomeCauroselSmall;
