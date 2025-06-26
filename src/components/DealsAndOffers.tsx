import React, { useState, useEffect } from "react";
import MaxWidthWrapper from "./MaxwidthWrapper";
import { Star } from "lucide-react";

const dealProducts = [
  { id: 1, title: "خاتم اظافر مرصع بالزركون", image: "/il_100x100.3400269364_k196.jpg (16).png", discount: 25 },
  { id: 2, title: "خاتم اظافر مرصع بالزركون", image: "/il_100x100.3400269364_k196.jpg (17).png", discount: 25 },
  { id: 3, title: "خاتم اظافر مرصع بالزركون", image: "/il_100x100.3400269364_k196.jpg (18).png", discount: 25 },
  { id: 4, title: "خاتم اظافر مرصع بالزركون", image: "/il_100x100.3400269364_k196.jpg (19).png", discount: 25 },
  { id: 5, title: "كحلة ضد الماء Kill Bleek", image: "/il_100x100.3400269364_k196.jpg (20).png", discount: 25 },
];

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-07-26") - +new Date();
    let timeLeft = {};
    console.log(difference, timeLeft);
    if (difference > 0) {
      timeLeft = {
        أيام: Math.floor(difference / (1000 * 60 * 60 * 24)),
        ساعة: Math.floor((difference / (1000 * 60 * 60)) % 24),
        دقيقة: Math.floor((difference / 1000 / 60) % 60),
        ثانية: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="flex gap-2 text-center">
      {Object.entries(timeLeft).map(([interval, value]) => (
        <div key={interval} className="flex flex-col items-center">
          <div className="bg-[#287CDA] rounded-md flex flex-col items-center justify-center p-2 w-12 text-white font-bold text-lg">
            {String(value).padStart(2, "0")}
            <span className="text-[11px] text-white text-center mt-1">{interval}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const DealsAndOffers = () => {
  return (
    <div dir="rtl">
      <MaxWidthWrapper>
        <div className="flex flex-col gap-6">
          {/* Ad Banner */}
          <div className="h-[250px] lg:my-12 my-6 rounded-2xl w-full relative overflow-hidden">
            <img src="/Rectangle 303 (1).png" alt="" className="w-full absolute top-0 left-0 h-full object-cover" />
            <div className="absolute left-10 top-1/2 -translate-y-1/2  flex justify-between px-12 text-white">
              <div className="flex flex-col gap-4 my-auto">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl lg:text-5xl max-w-xl font-bold ">كحلة ضد الماء Kill Bleek</h2>
                  <h3 className=" text-base font-[400]">جودة عالية - للاستخدام اليومي</h3>{" "}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img src="/Frame 1000005520 (1).png" className=" w-8 h-8 rounded-full" alt="" />
                    <div className="flex flex-col items-start justify-between mb-1">
                      <h3> اسم الشركة</h3>
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <button
                    className="bg-[#23A6F0] text-white lg:text-[19px] text-[15px] left-12
             hover:bg-gray-100 transition-colors px-8 py-2 h-fit rounded-full w-fit font-semibold"
                  >
                    عرض المزيد
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Deals */}
          <div className="w-full p-4 bg-white rounded-2xl border border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="text-center lg:pl-6 lg:border-r border-gray-200 mb-4 lg:mb-0">
                <h3 className="text-xl font-bold text-gray-800">الصفقات والعروض</h3>
                <p className="text-gray-500 text-sm mb-4">المعروضات الصحية</p>
                <CountdownTimer />
              </div>
              <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-center">
                {dealProducts.map((product) => (
                  <div
                    key={product.id}
                    className="text-center w-[calc(50%-8px)] sm:w-[calc(33.33%-16px)] lg:w-32 flex-shrink-0"
                  >
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden p-2">
                      <img src={product.image} alt={product.title} className="w-full h-24 object-contain" />
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        -{product.discount}%
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold mt-2 text-gray-700 truncate">{product.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default DealsAndOffers;
