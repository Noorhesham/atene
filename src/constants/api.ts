export const API_BASE_URL = "https://aatene.com/api";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PRODUCTS_SEARCH: `${API_BASE_URL}/products/search`,
  ACCOUNT: `${API_BASE_URL}/auth/account`,
} as const;
