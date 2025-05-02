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
    <div dir="rtl" className="w-full bg-white shadow-sm overflow-hidden">
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
      <MaxWidthWrapper className="relative flex justify-between z-30 px-4 pt-14 pb-6">
        <div className="flex flex-col gap-4">
          <div className="absolute -top-20 right-8 h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="flex  w-full gap-10 mt-4 items-center mb-6">
            <StoreStats
              rating={rating}
              reviewCount={reviewCount}
              followers={followers}
              followersAvatars={followersAvatars}
            />
            <div className="flex  gap-10 items-start mb-4">
              <div className="flex flex-col gap-4">
                {" "}
                <div className="text-right">
                  <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
                  <div className="my-1 text-right">
                    <p className="text-gray-700 text-sm font-semibold leading-relaxed">{bio}</p>
                  </div>
                  <p className="text-sm text-gray-600">{location}</p>{" "}
                </div>
                <div className="flex items-center space-x-3">
                  <MainButton bg="bg-white" className="!text-[#5B89BA] border-2 border-[#5B89BA] ! ">
                    <Link to={`/chat/${id}`} className="flex items-center ">
                      <MessageCircle className="h-5 w-5 ml-1.5" />
                      <span className="text-sm font-medium">الدردشة</span>
                    </Link>
                  </MainButton>
                  <MainButton onClick={toggleFollow} className="flex items-center">
                    <UserPlus className="h-5 w-5 ml-1.5" />
                    <span className="text-sm font-medium">تابع المتجر</span>
                  </MainButton>{" "}
                  <button className="rounded-full p-2 bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
        <div className="flex justify-between items-center">
          {/* Store Features */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="rounded-xl bg-gray-100 p-3 mb-1">
                <Truck className=" h-9 w-9 text-gray-700" />
              </div>
              <span className="text-xs text-gray-600 whitespace-nowrap">خدمة توصيل</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-xl bg-gray-100 p-3 mb-1">
                <Briefcase className=" h-9 w-9 text-gray-700" />
              </div>
              <span className="text-xs text-gray-600 whitespace-nowrap">شحن مجاني</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-xl bg-gray-100 p-3 mb-1">
                <MessageSquare className=" h-9 w-9 text-gray-700" />
              </div>
              <span className="text-xs text-gray-600 whitespace-nowrap">ردود سريعة</span>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default StoreProfile;
