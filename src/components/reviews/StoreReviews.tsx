import { useQuery } from "@tanstack/react-query";
import { Store } from "@/types/product";
import ReviewSummary from "./ReviewSummary";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { API_BASE_URL } from "@/constants/api";

interface StoreReviewsProps {
  store: Store;
  dummy?: boolean;
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

// Dummy data
const dummyReviewsData: ReviewsResponse = {
  reviews: [
    {
      id: "1",
      content: "منتج رائع! جودة عالية وخدمة ممتازة. سأشتري مرة أخرى بالتأكيد.",
      rate: 5,
      images: [],
      created_at: "2024-02-20",
      user: {
        id: 1,
        name: "محمد أحمد",
        avatar: "/CommenterAvatar.png",
      },
    },
    {
      id: "2",
      content: "تجربة شراء مميزة، المنتج مطابق للمواصفات تماماً وجودة الخامات عالية.",
      rate: 4,
      images: ["/Frame 1000005447 (1).png", "/Frame 1000005447 (2).png"],
      created_at: "2024-02-19",
      user: {
        id: 2,
        name: "سارة محمد",
        avatar: "/CommenterAvatar (1).png",
      },
    },
    {
      id: "3",
      content: "سعيد جداً بالشراء من هذا المتجر. التوصيل سريع والتعامل محترف.",
      rate: 5,
      images: [],
      created_at: "2024-02-18",
      user: {
        id: 3,
        name: "أحمد خالد",
        avatar: "/Frame 1000005447 (4).png",
      },
    },
  ],
  total: 45,
  avg_rate: 4.8,
  rate_stats: {
    "5": 30,
    "4": 10,
    "3": 3,
    "2": 1,
    "1": 1,
  },
};

const StoreReviews = ({ store, dummy = false }: StoreReviewsProps) => {
  const { data: reviewsData } = useQuery<ReviewsResponse>({
    queryKey: ["storeReviews", store.slug],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/reviews/store/${store.slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch store reviews");
      }
      return response.json();
    },
    enabled: !dummy, // Disable the query when using dummy data
  });

  // Use dummy data if dummy prop is true
  const data = dummy ? dummyReviewsData : reviewsData;

  // Convert rate_stats to the format expected by ReviewSummary
  const ratingLabels: Record<string, string> = {
    "5": "ممتاز",
    "4": "جيد",
    "3": "متوسط",
    "2": "ليس سيئًا",
    "1": "سيئ",
  };

  const formattedReviewCounts = data?.rate_stats
    ? Object.entries(data.rate_stats).reduce((acc, [rating, count]) => {
        acc[ratingLabels[rating] || rating] = count;
        return acc;
      }, {} as Record<string, number>)
    : {};

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Ratings summary */}
      {data && (
        <ReviewSummary reviews_counts={formattedReviewCounts} review_count={data.total} review_rate={data.avg_rate} />
      )}

      {/* Reviews list */}
      <div className="my-4 lg:my-6 space-y-4 lg:space-y-6">
        {data?.reviews.map((review: Review) => (
          <div key={review.id} className="">
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
          </div>
        ))}
      </div>

      {/* Review form */}
      <div className="mt-4 lg:mt-6">
        <ReviewForm storeId={store.slug} type="store" />
      </div>
    </div>
  );
};

export default StoreReviews;
