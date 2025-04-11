import React from "react";
import MaxWidthWrapper from "./MaxwidthWrapper";

const SimilarProducts = () => {
  return (
    <MaxWidthWrapper noPaddingX className="flex flex-col gap-3">
      <div className="flex flex-col gap-5 lg:mb-10">
        <h2 className=" font-semibold  text-3xl"> استكشف المزيد من عمليات البحث ذات الصلة</h2>
        <div className=" flex gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="   bg-gray-200 rounded-full px-4 py-1">
              tag1
            </div>
          ))}
        </div>
      </div>
      <div className=" grid grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="  flex-col flex items-start justify-center rounded-lg">
            <div className="bg-[#A6A6A6] rounded-2xl w-full h-80 "></div>
            <p className="text-gray-700 text-lg font-bold">منتج مشابه {i + 1}</p>
            <span className=" font-semibold">100$</span>
          </div>
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default SimilarProducts;
