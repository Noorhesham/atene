import { useQuery } from "@tanstack/react-query";
import { Store } from "@/types/product";
import ReviewSummary from "./ReviewSummary";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { getStoreReviews } from "@/utils/api/store";

interface StoreReviewsProps {
  store: Store;
}

const StoreReviews = ({ store }: StoreReviewsProps) => {
  const { data: reviewsData } = useQuery({
    queryKey: ["storeReviews", store.id],
    queryFn: () => getStoreReviews(store.id.toString()),
  });

  // Convert rate_stats to the format expected by ReviewSummary
  const ratingLabels: Record<string, string> = {
    "5": "ممتاز",
    "4": "جيد",
    "3": "متوسط",
    "2": "ليس سيئًا",
    "1": "سيئ",
  };

  const formattedReviewCounts = reviewsData?.rate_stats
    ? Object.entries(reviewsData.rate_stats).reduce((acc, [rating, count]) => {
        acc[ratingLabels[rating] || rating] = count;
        return acc;
      }, {} as Record<string, number>)
    : {};

  return (
    <div className="space-y-6">
      {/* Ratings summary */}
      {reviewsData && (
        <ReviewSummary
          reviews_counts={formattedReviewCounts}
          review_count={reviewsData.total}
          review_rate={Number(reviewsData.avg_rate)}
        />
      )}

      {/* Reviews list */}
      <div className="my-6">
        {reviewsData?.reviews.map((review) => (
          <ReviewCard
            key={review.id}
            name={review.user.name}
            avatar={review.user.avatar}
            review={review.content}
            rating={review.rate}
            images={review.images || []}
            date={new Date().toISOString()}
          />
        ))}
      </div>

      {/* Review form */}
      <ReviewForm storeId={store.id} />
    </div>
  );
};

export default StoreReviews;
