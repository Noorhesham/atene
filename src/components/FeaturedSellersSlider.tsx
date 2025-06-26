import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { ChevronLeft, ChevronRight, MapPin, Star, UserPlus } from "lucide-react";
import MaxWidthWrapper from "./MaxwidthWrapper";

interface Seller {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  images: string[];
  avatar: string;
  isSpecial?: boolean;
}

const sellers: Seller[] = [
  {
    id: "1",
    name: "نورهان محمد عيسى",
    location: "خليج بايرون, أستراليا",
    rating: 5.0,
    reviewCount: 2372,
    images: [
      "/il_100x100.3400269364_k196.jpg.png",
      "/il_100x100.3400269364_k196.jpg (1).png",
      "/il_100x100.3400269364_k196.jpg (2).png",
    ],
    avatar: "/black.svg",
    isSpecial: true,
  },
  {
    id: "2",
    name: "Heba Magdy",
    location: "خليج بايرون, أستراليا",
    rating: 3.7,
    reviewCount: 2372,
    images: [
      "/il_100x100.3400269364_k196.jpg (3).png",
      "/il_100x100.3400269364_k196.jpg (4).png",
      "/il_100x100.3400269364_k196.jpg (5).png",
    ],
    avatar: "/icon.png",
  },
  {
    id: "3",
    name: "البنول للتسويق",
    location: "خليج بايرون, أستراليا",
    rating: 5.0,
    reviewCount: 2372,
    images: [
      "/il_100x100.3400269364_k196.jpg (6).png",
      "/il_100x100.3400269364_k196.jpg (7).png",
      "/il_100x100.3400269364_k196.jpg (8).png",
    ],
    avatar: "/black.svg",
  },
  {
    id: "4",
    name: "ولاء على",
    location: "خليج بايرون, أستراليا",
    rating: 5.0,
    reviewCount: 2372,
    images: [
      "/il_100x100.3400269364_k196.jpg (9).png",
      "/il_100x100.3400269364_k196.jpg (10).png",
      "/il_100x100.3400269364_k196.jpg (11).png",
    ],
    avatar: "/black.svg",
  },
  {
    id: "5",
    name: "نورهان محمد عيسى",
    location: "خليج بايرون, أستراليا",
    rating: 5.0,
    reviewCount: 2372,
    images: [
      "/il_100x100.3400269364_k196.jpg (12).png",
      "/il_100x100.3400269364_k196.jpg (13).png",
      "/il_100x100.3400269364_k196.jpg (14).png",
    ],
    avatar: "/black.svg",
  },
];

const FeaturedSellersSlider = () => {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);

  return (
    <MaxWidthWrapper noPadding className="w-full " dir="rtl">
      <div className="flex justify-between items-center mb-6 px-4">
        <h2 className="text-2xl lg:text-4xl font-bold text-[#395A7D] ">البائعين المميزين</h2>
        <div className="flex gap-2">
          <button
            onClick={() => swiper?.slidePrev()}
            className="w-8 h-8 bg-[#F3F9FB] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Previous service provider"
          >
            <ChevronRight className="w-5 h-5 text-[#287CDA]" />
          </button>
          <button
            onClick={() => swiper?.slideNext()}
            className="w-8 h-8 bg-[#F3F9FB] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Next service provider"
          >
            <ChevronLeft className="w-5 h-5 text-[#287CDA]" />
          </button>
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        onSwiper={setSwiper}
        spaceBetween={16}
        breakpoints={{
          320: {
            slidesPerView: 1.1,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 1.2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 1.5,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 2.2,
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: "auto",
            spaceBetween: 16,
          },
        }}
        className="!px-4"
      >
        {sellers.map((seller) => (
          <SwiperSlide key={seller.id} className="!w-[410px]">
            <div
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${
                seller.isSpecial ? "border-red-400" : "border-gray-100"
              }`}
            >
              <div className="relative h-[129px]">
                <div className="grid grid-cols-3">
                  {seller.images.map((img, index) => (
                    <div key={index} className="w-[129px] h-[129px] relative">
                      <img
                        src={img}
                        alt={`${seller.name} product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 2 && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">+56</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-[-27.5px] right-3 w-[55px] h-[55px] rounded-full bg-gray-200 overflow-hidden border-2 border-white">
                  <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="pt-4 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-right  pr-14">
                    <h3 className="font-bold text-gray-800">{seller.name}</h3>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-green-500" />
                      <p className="text-xs text-gray-500">{seller.location}</p>
                    </div>
                    <div className="flex items-center justify-start ml-auto w-fit gap-1.5 mt-1">
                      <p className="text-xs text-gray-500">
                        ({seller.reviewCount.toLocaleString()}){" "}
                        <span className="text-yellow-500 font-bold">{seller.rating.toFixed(1)}</span>
                      </p>
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>{" "}
                  <div className="w-10 h-10 bg-[#287CDA] rounded-full flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </MaxWidthWrapper>
  );
};

export default FeaturedSellersSlider;
