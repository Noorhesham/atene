// Use proxy in development, direct URL in production
export const API_BASE_URL = "https://aatene.com/api";
export const STORAGE_URL = "https://aatene.com/storage";
export const API_ENDPOINTS = {
  LOGIN: "https://aatene.com/api/auth/login",
  REGISTER: "https://aatene.com/api/auth/register",
  PRODUCTS_SEARCH: "https://aatene.com/api/products/search",
  ACCOUNT: "https://aatene.com/api/auth/account",
  PRODUCTS_SEARCH_PAGE: "https://aatene.com/api/products/search-page",
  PRODUCTS: "https://aatene.com/api/products",
  USERS: "https://aatene.com/api/users",
  ADMIN: "https://aatene.com/api/admin",
  MEDIA_CENTER: "https://aatene.com/api/media-center",
  BASE: "https://aatene.com/api",
} as const;

export interface ApiError {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function FetchFunction<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body: string | FormData | null = null,
  headers: Record<string, string> = {}
): Promise<T> {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Prepare headers with token
    const requestHeaders: Record<string, string> = {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    };

    // If body is string (JSON), add Content-Type header
    if (typeof body === "string") {
      requestHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(endpoint, {
      method,
      headers: requestHeaders,
      ...(body && { body }),
    });

    const data = await response.json();

    // Check for API-level errors
    if (!data.status) {
      const error: ApiError = {
        status: false,
        message: data.message || "An error occurred",
        errors: data.errors,
      };
      throw error;
    }

    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(data);
    return data;
  } catch (error) {
    // Handle API errors
    console.log(error);
    if ((error as ApiError).status === false) {
      throw error;
    }

    // Handle network/other errors
    console.error("API call failed:", error);
    throw {
      status: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
