import React from "react";
import { Star } from "lucide-react";

interface StoreStatsProps {
  rating: number;
  reviewCount: number;
  followers: number;
  followersAvatars?: string[];
}

const StoreStats: React.FC<StoreStatsProps> = ({ rating, reviewCount, followers, followersAvatars = [] }) => {
  // Generate star rating display
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-4 h-4 text-yellow-400" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col items-end">
      {/* Ratings */}
      <div className="flex flex-col  justify-center mx-auto items-center">
        <div className="flex ml-2">{renderStars()}</div>
        <span className="text-gray-500 text-sm whitespace-nowrap">({reviewCount} مراجعة)</span>
      </div>

      {/* Followers */}
      <div className="mt-2 flex justify-end w-full">
        <div className="flex items-center flex-row-reverse">
          {" "}
          <span className="text-gray-600 text-sm">{followers} متابع</span>
          <div className="flex -space-x-2 rtl:space-x-reverse ml-2">
            {followersAvatars.slice(0, 3).map((avatar, index) => (
              <img
                key={index}
                className="w-8 h-8 rounded-full border-2 border-white"
                src={avatar}
                alt={`Follower ${index + 1}`}
              />
            ))}
            {followersAvatars.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                +{followersAvatars.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreStats;
