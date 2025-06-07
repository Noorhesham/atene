import { API_ENDPOINTS } from "@/constants/api";
import { ProductsResponse, SingleProductResponse } from "@/types/product";

interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
}

export const searchProducts = async (params: SearchParams = {}): Promise<ProductsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.query) {
    searchParams.append("query", params.query);
  }
  if (params.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params.limit) {
    searchParams.append("limit", params.limit.toString());
  }

  const queryString = searchParams.toString();
  const url = `${API_ENDPOINTS.PRODUCTS_SEARCH}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

export const getProduct = async (slug: string): Promise<SingleProductResponse> => {
  const response = await fetch(`${API_ENDPOINTS.PRODUCTS_SEARCH}/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
};
