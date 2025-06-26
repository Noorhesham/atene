import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MaxWidthWrapper from "./MaxwidthWrapper";

const categories = [
  {
    type: "single" as const,
    item: {
      title: "أثاث غرفة النوم",
      image: "/Frame 1000005429.png",
      height: "450px",
    },
  },
  {
    type: "double" as const,
    items: [
      {
        title: "أثاث غرفة المعيشة",
        image: "/Frame 1000005424.png",
        height: "215px",
      },
      {
        title: "أثاث غرفة الطعام",
        image: "/Frame 1000005425.png",
        height: "215px",
      },
    ],
  },
  {
    type: "single" as const,
    item: {
      title: "مجموعات الأريكة",
      image: "/Frame 1000005426.png",
      height: "450px",
    },
  },
];

const CategoryCard = ({ title, image, height }: { title: string; image: string; height: string }) => (
  <div className={`relative rounded-2xl overflow-hidden w-[380px] group`} style={{ height }}>
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div>
    <h3 className="absolute bottom-6 right-6 text-white text-2xl font-bold">{title}</h3> */}
  </div>
);

const CategoryShowcase = () => {
  return (
    <MaxWidthWrapper noPadding className="my-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-[#3D3D3D]">عرض مجموعتنا من الفئات</h2>
        <p className="text-[#666666] mt-2">عروض حصرية تنتظرك! اشتر الآن واستمتع بخصومات مذهلة!</p>
      </div>
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={"auto"}
          navigation={{
            nextEl: ".swiper-button-next-custom-1",
            prevEl: ".swiper-button-prev-custom-1",
          }}
          className="!p-2"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index} className="!w-auto">
              {category.type === "single" ? (
                <CategoryCard {...category.item} />
              ) : (
                <div className="flex flex-col gap-6 h-[450px]">
                  <CategoryCard {...category.items[0]} />
                  <CategoryCard {...category.items[1]} />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          className="swiper-button-prev-custom-1 absolute top-1/2 -translate-y-1/2 left-4 bg-white/50 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white/80 transition-colors z-10"
          aria-label="Previous category"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <button
          className="swiper-button-next-custom-1 absolute top-1/2 -translate-y-1/2 right-4 bg-white/50 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white/80 transition-colors z-10"
          aria-label="Next category"
        >
          <ChevronRight className="w-6 h-6 text-gray-900" />
        </button>
      </div>
    </MaxWidthWrapper>
  );
};

export default CategoryShowcase;
