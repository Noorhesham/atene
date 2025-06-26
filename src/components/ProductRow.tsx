import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChevronLeft } from "lucide-react";
import MaxWidthWrapper from "./MaxwidthWrapper";
import FeaturedProductCard from "./FeaturedProductCard";
import { Product } from "./FeaturedProductCard";

interface ProductRowProps {
  category: {
    name: string;
    image: string;
  };
  products: Product[];
}

const ProductRow = ({ category, products }: ProductRowProps) => {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col lg:flex-row gap-4 lg:h-[400px] h-auto" dir="rtl">
        {/* Category Banner */}
        <div className="lg:w-1/4 w-full h-[200px] lg:h-auto relative rounded-lg overflow-hidden">
          <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <h3 className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 text-white text-xl sm:text-2xl lg:text-3xl font-bold">
            {category.name}
          </h3>
        </div>

        {/* Products Slider */}
        <div className="lg:w-3/4 w-full bg-white py-2 px-3 sm:px-4 shadow-lg rounded-lg">
          <div className="flex mr-auto w-fit justify-between items-center mb-4">
            <button className="flex items-center gap-1 text-[#222] font-semibold text-sm">
              <span>عرض الكل</span>
              <ChevronLeft className="w-4 h-4 text-blue-400" />
            </button>
          </div>
          <Swiper
            spaceBetween={12}
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 12,
              },
              480: {
                slidesPerView: 1.8,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 3.2,
                spaceBetween: 16,
              },
              1280: {
                slidesPerView: 3.5,
                spaceBetween: 16,
              },
            }}
            className="h-full"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto">
                <FeaturedProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductRow;
