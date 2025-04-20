import MainHeading from "@/components/MainHeading";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import SimilarProducts from "@/components/SimilarProducts";
import React from "react";

const Favourites = () => {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-4">
        <div className=" justify-between flex ">
          <MainHeading text="المفضلة" />
          <p>المزيد</p>
        </div>
        <SimilarProducts onerow />
      </div>
      <div className="flex flex-col gap-4">
        <div className=" justify-between flex ">
          <MainHeading text="المنتجات" />
          <p>المزيد</p>
        </div>
        <SimilarProducts onerow />
      </div>
      <div className="flex flex-col gap-4">
        <div className=" justify-between flex ">
          <MainHeading text="الوظائف" />
          <p>المزيد</p>
        </div>
        <SimilarProducts onerow />
      </div>
    </MaxWidthWrapper>
  );
};

export default Favourites;
