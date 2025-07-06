import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { ProductsResponse, SingleProductResponse, ReviewsResponse } from "@/types/product";
import toast from "react-hot-toast";

interface FavoriteRequest {
  favs_type: "product" | "store";
  favs_id: string;
}

interface FavoriteResponse {
  success: boolean;
  message: string;
}

export interface FavoritesResponse {
  favorites: Array<{
    id: number;
    favs_type: "product" | "store" | "service" | "job";
    favs: {
      id: number;
      slug: string;
      name: string;
      cover: string;
      is_favorite: boolean;
      in_compare: boolean;
      price: number;
      price_after_discount: number;
      discount_present: number;
      description?: string;
    };
  }>;
}

interface FavoriteCheckResponse {
  is_favorite: boolean;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  category_id?: number;
  section_id?: number;
  tags?: string[];
  min_price?: number;
  max_price?: number;
  variation_options?: number[];
}

export const searchProducts = async (params: SearchParams = {}): Promise<ProductsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.query) {
    searchParams.append("search", params.query);
  }
  if (params.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params.limit) {
    searchParams.append("limit", params.limit.toString());
  }
  if (params.category_id) {
    searchParams.append("category_id", params.category_id.toString());
  }
  if (params.section_id) {
    searchParams.append("section_id", params.section_id.toString());
  }
  if (params.tags) {
    searchParams.append("tags", params.tags.toString());
  }
  if (params.min_price) {
    searchParams.append("min_price", params.min_price.toString());
  }
  if (params.max_price) {
    searchParams.append("max_price", params.max_price.toString());
  }
  if (params.variation_options?.length) {
    params.variation_options.forEach((option) => {
      searchParams.append("variation_options[]", option.toString());
    });
  }

  const queryString = searchParams.toString();
  const url = `${API_ENDPOINTS.PRODUCTS_SEARCH}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

export const getSearchPageData = async (): Promise<unknown> => {
  const response = await fetch(`${API_ENDPOINTS.PRODUCTS_SEARCH_PAGE}`);
  return response.json();
};

export const getProduct = async (slug: string): Promise<SingleProductResponse> => {
  const response = await fetch(`${API_ENDPOINTS.PRODUCTS_SEARCH}/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
};

export const getProductReviews = async (slug: string): Promise<ReviewsResponse> => {
  const response = await fetch(`${API_BASE_URL}/reviews/product/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product reviews");
  }
  return response.json();
};

// Favorites API functions
export const addToFavorites = async (favoriteData: FavoriteRequest): Promise<FavoriteResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(favoriteData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add to favorites");
    }

    toast.success("تمت الإضافة إلى المفضلة");
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل في الإضافة إلى المفضلة";
    toast.error(message);
    throw error;
  }
};

export const removeFromFavorites = async (favoriteData: FavoriteRequest): Promise<FavoriteResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/remove`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(favoriteData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove from favorites");
    }

    toast.success("تمت الإزالة من المفضلة");
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل في الإزالة من المفضلة";
    toast.error(message);
    throw error;
  }
};

export const getAllFavorites = async (): Promise<FavoritesResponse> => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }

  const data = await response.json();
  console.log(data, "data");
  return data;
};

export const checkFavorite = async (favoriteData: FavoriteRequest): Promise<FavoriteCheckResponse> => {
  const response = await fetch(`${API_BASE_URL}/favorites/check`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(favoriteData),
  });

  if (!response.ok) {
    throw new Error("Failed to check favorite status");
  }

  const data = await response.json();
  console.log(data, "data");
  return data;
};

// Following API functions
interface FollowRequest {
  followed_type: "store" | "user";
  followed_id: number;
}

interface FollowResponse {
  success: boolean;
  message: string;
}

interface FollowCheckResponse {
  is_following: boolean;
}

export const followStore = async (followData: FollowRequest): Promise<FollowResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/followings/follow`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(followData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to follow store");
    }

    toast.success("تمت متابعة المتجر بنجاح");
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل في متابعة المتجر";
    toast.error(message);
    throw error;
  }
};

export const unfollowStore = async (followData: FollowRequest): Promise<FollowResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/followings/unfollow`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(followData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to unfollow store");
    }

    toast.success("تم إلغاء متابعة المتجر");
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل في إلغاء متابعة المتجر";
    toast.error(message);
    throw error;
  }
};

export const checkFollowing = async (followData: FollowRequest): Promise<FollowCheckResponse> => {
  const response = await fetch(`${API_BASE_URL}/followings/check`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(followData),
  });

  if (!response.ok) {
    throw new Error("Failed to check following status");
  }

  const data = await response.json();
  console.log(data, "data");
  return data;
};
