import { useQuery } from "@tanstack/react-query";
import { Store } from "@/types/product";
import ReviewSummary from "./ReviewSummary";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { API_BASE_URL } from "@/constants/api";

interface StoreReviewsProps {
  store: Store;
}

interface ReviewUser {
  id: number;
  name: string;
  avatar: string | null;
}

interface Review {
  id: string;
  content: string;
  rate: number | null;
  images: string[];
  created_at: string;
  user: ReviewUser;
}

interface ReviewsResponse {
  reviews: Review[];
  total: number;
  avg_rate: number;
  rate_stats: Record<string, number>;
}

const StoreReviews = ({ store }: StoreReviewsProps) => {
  const { data: reviewsData } = useQuery<ReviewsResponse>({
    queryKey: ["storeReviews", store.slug],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/reviews/store/${store.slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch store reviews");
      }
      return response.json();
    },
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
          review_rate={reviewsData.avg_rate}
        />
      )}

      {/* Reviews list */}
      <div className="my-6">
        {reviewsData?.reviews.map((review: Review) => (
          <ReviewCard
            key={review.id}
            id={review.id}
            name={review.user.name}
            avatar={review.user.avatar || ""}
            review={review.content}
            rating={review.rate || 0}
            images={review.images || []}
            date={review.created_at}
            productSlug={store.slug}
            type="store"
          />
        ))}
      </div>

      {/* Review form */}
      <ReviewForm storeId={store.slug} type="store" />
    </div>
  );
};

export default StoreReviews;
