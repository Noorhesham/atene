import { API_BASE_URL } from "@/constants/api";
import { ReviewsResponse } from "@/types/product";

export const getStoreReviews = async (storeId: string): Promise<ReviewsResponse> => {
  const response = await fetch(`${API_BASE_URL}/reviews/store/${storeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch store reviews");
  }
  return response.json();
};
