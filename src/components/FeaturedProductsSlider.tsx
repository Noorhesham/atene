import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChevronLeft } from "lucide-react";
import MaxWidthWrapper from "./MaxwidthWrapper";

interface Product {
  id: string;
  title: string;
  image: string;
}

interface FeaturedProductsSliderProps {
  products: Product[];
}

const FeaturedProductsSlider = ({ products }: FeaturedProductsSliderProps) => {
  return (
    <MaxWidthWrapper dir="rtl" className=" bg-white rounded-xl border border-input shadow-md">
      <div className="flex justify-between border-b border-gray-200 items-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 border-b-2 border-gray-800 pb-3">منتجات مميزة</h2>
        <button className="flex items-center gap-1 text-gray-800  font-semibold text-sm">
          <span>عرض الكل</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <Swiper spaceBetween={16} slidesPerView={5}>
        {products.map((product) => (
          <SwiperSlide key={product.id} className="w-full">
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
              <div className="w-full h-[220px] bg-gray-100">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 text-center truncate">{product.title}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </MaxWidthWrapper>
  );
};

export default FeaturedProductsSlider;
