import React, { useState } from "react";
import Card from "../Card";
import Starrating from "./Rate";
import { Button } from "../ui/button";
import ReviewReply from "./ReviewReply";

export interface ReviewCardProps {
  name: string;
  avatar: string;
  review: string;
  images?: string[];
  rating?: number;
  date?: string;
  id: string;
  productSlug: string;
  type?: "product" | "store";
}

const ReviewCard = ({
  name,
  avatar,
  review,
  images = [],
  rating,
  date,
  id,
  productSlug,
  type = "product",
}: ReviewCardProps) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  return (
    <Card className="mb-4  lg:px-6 lg:py-4 px-4 py-2">
      <div className="flex items-start gap-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1 ">
          <div className="flex  flex-col  justify-between items-start mb-1">
            <div className="w-full">
              <div className="flex w-full  justify-between items-center ">
                <h3 className="font-semibold text-base">{name}</h3>
                {rating !== undefined && (
                  <div className="flex  mr-auto items-center">
                    <Starrating MaxRating={5} defaultRating={rating} change={false} size={16} />
                  </div>
                )}
              </div>
              {/* {date && (
                <span className="text-sm text-gray-500 block ">{new Date(date).toLocaleDateString("ar-EG")}</span>
              )} */}
            </div>
          </div>

          <p className="text-[#949494] text-base mb-4">{review}</p>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700 px-2 h-auto py-1 text-sm">
            يحب
          </Button>
          <Button variant="ghost" className=" px-2 h-auto py-1 text-sm" onClick={() => setIsReplyOpen(true)}>
            رد
          </Button>
          {images && images.length > 0 && (
            <div className="flex gap-3 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <img src={image} alt={`Review image ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <span className="text-white text-lg">+{images.length - 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isReplyOpen && (
        <ReviewReply reviewId={id} productSlug={productSlug} onClose={() => setIsReplyOpen(false)} type={type} />
      )}

      {/* Review Replies Section */}
    </Card>
  );
};

export default ReviewCard;
