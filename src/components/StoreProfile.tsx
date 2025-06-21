import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { MoreHorizontal, MessageCircle, UserPlus, Truck, Briefcase, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import StoreStats from "./StoreStats";
import MaxWidthWrapper from "./MaxwidthWrapper";
import MainButton from "./MainButton";

interface StoreProfileProps {
  id: string;
  name: string;
  avatar: string;
  location: string;
  bio: string;
  rating: number;
  reviewCount: number;
  followers: number;
  coverImages: string[];
  followersAvatars?: string[];
  isFollowing?: boolean;
}

const StoreProfile: React.FC<StoreProfileProps> = ({
  id,
  name,
  avatar,
  location,
  bio,
  rating,
  reviewCount,
  followers,
  coverImages,
  followersAvatars = [],
  isFollowing = false,
}) => {
  const [following, setFollowing] = useState(isFollowing);

  const toggleFollow = () => {
    setFollowing(!following);
  };

  return (
    <div dir="rtl" className="w-full bg-white shadow-lg overflow-hidden">
      {/* Cover Image Slider */}
      <div className="w-full h-56 relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            bulletClass: "w-2 h-2 mx-1 rounded-full bg-white bg-opacity-50 inline-block cursor-pointer",
            bulletActiveClass: "!bg-white",
          }}
          loop={true}
          className="h-full w-full"
        >
          {coverImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full">
                <img src={image} alt={`${name} cover ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination absolute bottom-4 left-0 right-0 flex justify-center space-x-2"></div>
        </Swiper>
        {/* Logo overlay */}
        <div className="absolute bottom-4 right-4 bg-white rounded-full p-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        </div>
      </div>

      {/* Store Info */}
      <MaxWidthWrapper noPadding className="relative  flex flex-col lg:flex-row justify-between z-30 px-4">
        <div className="flex relative flex-col">
          <div className="relative bg-white ">
            <img src="/starss.svg" className="  absolute z-10 right-28 -bottom-12 lg:-bottom-20 lg:right-36" alt="" />
            <img src="/9110128_crown_f_icon 1 (Traced).svg" alt="" className="absolute -top-32  right-6  lg:right-16" />{" "}
            <div
              className="absolute border-[#FFCE3B]  -top-20 right-2 lg:right-8 h-32 lg:h-40 w-32 lg:w-40 shadow-lg rounded-full border-4 
           
          overflow-hidden bg-white"
            >
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col  lg:flex-row w-full gap-4 lg:gap-10  pt-16 lg:pt-12 items-start lg:items-center  lg:mb-6">
            <StoreStats
              rating={rating}
              reviewCount={reviewCount}
              followers={followers}
              followersAvatars={followersAvatars}
            />
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 items-start  mb-4">
              <div className="flex flex-col gap-4">
                {" "}
                <div className="text-right">
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">{name}</h1>
                  <div className="my-1 text-right">
                    <p className="text-black text-base lg:text-lg font-semibold leading-relaxed">{bio}</p>
                  </div>
                  <p className="text-[10px] black">{location}</p>{" "}
                </div>
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:space-x-3">
                  <MainButton
                    onClick={toggleFollow}
                    bg="!bg-[#3D5E83]"
                    className="flex w-full lg:max-w-[164px] !bg-white items-center"
                  >
                    <UserPlus className="h-5 w-5 ml-1.5" />
                    <span className="text-sm font-medium">تابع المتجر</span>
                  </MainButton>{" "}
                  <MainButton
                    bg="bg-white"
                    className="!text-[#5B89BA] border-2 w-full lg:max-w-[164px] border-[#5B89BA] ! "
                  >
                    <Link to={`/chat/${id}`} className="flex items-center ">
                      <MessageCircle className="h-5 w-5 ml-1.5" />
                      <span className="text-sm font-bold">الدردشة</span>
                    </Link>
                  </MainButton>
                  <button
                    className="rounded-full p-2 bg-white text-[#424242] border border-black hover:bg-gray-200"
                    aria-label="المزيد من الخيارات"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
        <div className=" flex pb-7 lg:pb-0 justify-between items-center ">
          {/* Store Features */}
          <div className="  grid grid-cols-3 lg:flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:space-x-4 w-full">
            <div className="flex flex-col w-full lg:max-w-20 gap-4 items-center mb-auto">
              <div className="rounded-xl w-full flex items-center bg-[#F6F6F6] p-3 mb-1">
                <Truck className="h-9 w-9 mx-auto text-[#3D5E83]" />
              </div>
              <span className="text-[10px] text-[#424242] text-center">
                خدمة توصيل يتميز بسجل حافل بالشحن في الوقت المحدد مع خدمة التتبع.{" "}
              </span>
            </div>
            <div className="flex flex-col w-full lg:max-w-20 gap-4 items-center mb-auto">
              <div className="rounded-xl w-full flex items-center bg-[#F6F6F6] p-3 mb-1">
                <Briefcase className="h-9 w-9 mx-auto text-[#3D5E83]" />
              </div>
              <span className="text-[10px] text-[#424242] text-center">
                شحن سلس يتميز بسجل حافل بالشحن في الوقت المحدد مع خدمة التتبع.{" "}
              </span>
            </div>
            <div className="flex flex-col w-full lg:max-w-20 gap-4 items-center mb-auto">
              <div className="rounded-xl w-full flex items-center bg-[#F6F6F6] p-3 mb-1">
                <MessageSquare className="h-9 w-9 mx-auto text-[#3D5E83]" />
              </div>
              <span className="text-[10px] text-[#424242] text-center">
                ردود سريعة يتميز بسجل حافل بالرد السريع على الرسائل.
              </span>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default StoreProfile;
