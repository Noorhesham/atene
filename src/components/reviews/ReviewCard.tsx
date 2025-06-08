import React from "react";
import Card from "../Card";
import Starrating from "./Rate";

export interface ReviewCardProps {
  name: string;
  avatar: string;
  review: string;
  images?: string[];
  rating?: number;
  date?: string;
}

const ReviewCard = ({ name, avatar, review, images, rating, date }: ReviewCardProps) => {
  return (
    <Card className="mb-4">
      <div className="flex items-start gap-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold">{name}</h3>
              {date && <span className="text-sm text-gray-500">{new Date(date).toLocaleDateString("ar-EG")}</span>}
            </div>
            {rating !== undefined && (
              <Starrating className="mt-2" MaxRating={5} defaultRating={rating} change={false} size={20} />
            )}
          </div>
          <p className="text-gray-600">{review}</p>
          {images && images.length > 0 && (
            <div className="flex gap-2 mt-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;
