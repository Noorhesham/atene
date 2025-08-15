import { API_BASE_URL } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

export const useAnalyticsQuery = (endpoint: string, period: string) => {
  const queryKey = ["analytics", endpoint, period];

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    // Support both overview endpoints and direct analytics endpoints.
    // "stores" should hit /admin/analytics/stores according to requirements.
    const basePath =
      endpoint === "stores"
        ? `${API_BASE_URL}/admin/analytics/stores`
        : endpoint === "products"
        ? `${API_BASE_URL}/admin/analytics/products`
        : `${API_BASE_URL}/admin/analytics/overview/${endpoint}`;
    const url = `${basePath}?period=${period}`;

    console.log(`Fetching from: ${url}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  return useQuery({ queryKey, queryFn: fetchData });
};
