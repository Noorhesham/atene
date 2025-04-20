import AbuseReport from "@/components/forms/AbuseRebort";
import MainHeading from "@/components/MainHeading";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import ModalCustom from "@/components/ModalCustom";
import React from "react";

const Report = () => {
  return (
    <div className="!pt-20">
      <MaxWidthWrapper className="  shadow-md flex  px-8 rounded-xl py-4 items-start flex-col gap-4">
        <MainHeading text=" بوابة الشكاوى والاقتراحات" />
        <p className=" text-gray text-base">
          نحن نقدر ملاحظاتك واقتراحاتك ونحن هنا لمساعدتك في حل مشاكلك والاستماع إلى اقتراحاتك
        </p>
        <div className=" grid w-full lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 items-center">
            <img src="/ask1.png" className=" object-cover  aspect-square h-96" alt="" />{" "}
            <MainHeading variant="sm" text="  استعلام عن الشكاوي" />
          </div>
          <ModalCustom
            btn={
              <div className="flex cursor-pointer flex-col gap-2 items-center">
                <img src="/ask2.png" className="  object-cover aspect-square h-96" alt="" />
                <MainHeading variant="sm" text="شكوي او اقتراح" />
              </div>
            }
            content={<AbuseReport />}
          />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Report;
