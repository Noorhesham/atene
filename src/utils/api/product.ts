import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { ProductsResponse, SingleProductResponse, ReviewsResponse } from "@/types/product";

interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  category_id?: number;
  section_id?: number;
  tags?: string[];
  min_price?: number;
  max_price?: number;
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

  const queryString = searchParams.toString();
  const url = `${API_ENDPOINTS.PRODUCTS_SEARCH}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

export const getSearchPageData = async (): Promise<any> => {
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
