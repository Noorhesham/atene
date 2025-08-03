// src/hooks/useAnalyticsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS, FetchFunction } from "@/constants/api";

// Define the structure for different analytics responses
interface ContentAnalytics {
  totalMerchants: number;
  totalStores: number;
  notActiveStores: number;
  totalProducts: number;
  notActiveProducts: number;
  totalOrders: number;
  totalCompletedOrders: number;
  totalCanceledOrders: number;
  storesGrowthChart: { date: string; count: number }[];
}

interface CustomersAnalytics {
  customers: Record<string, number>;
}

interface OverviewAnalytics {
  totalStores: number;
  totalStoresThisMonth: number;
  totalStoresLastMonth: number;
  totalStoresThisDay: number;
  totalStoresYesterday: number;
  totalStoresThisYear: number;
  totalProducts: number;
  totalProductsThisMonth: number;
  totalProductsLastMonth: number;
  totalProductsThisDay: number;
  totalProductsYesterday: number;
  totalProductsThisYear: number;
}

interface LatestsAnalytics {
  latestsOrders: any[]; // Use a more specific type if available
  hightRatedProducts: any[]; // Use a more specific type if available
}

// Map endpoint keys to their response types
type AnalyticsDataMap = {
  content: ContentAnalytics;
  customers: CustomersAnalytics;
  analytics: OverviewAnalytics;
  latests: LatestsAnalytics;
};

type AnalyticsEndpoint = keyof AnalyticsDataMap;

/**
 * A generic hook to fetch data from various analytics endpoints.
 * @param endpoint The specific analytics endpoint to fetch data from.
 * @param period Optional period filter (e.g., 'current_month').
 */
export function useAnalyticsQuery<T extends AnalyticsEndpoint>(endpoint: T, period?: string) {
  const { user } = useAuth();
  const queryKey = ["analytics", endpoint, { period }];

  const fetchAnalyticsData = async (): Promise<AnalyticsDataMap[T]> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Construct the URL
    const baseUrl = `${API_ENDPOINTS.ADMIN}/analytics/overview/${endpoint}`;
    const url = period ? `${baseUrl}?period=${period}` : baseUrl;

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
      storeId: localStorage.getItem("storeId") || undefined,
    };

    const response = await FetchFunction<any>(url, "GET", null, headers);

    if (!response.status) {
      throw new Error(response.message || `Failed to fetch ${endpoint} analytics`);
    }

    // The actual data is returned by the API response
    return response as AnalyticsDataMap[T];
  };

  return useQuery({
    queryKey,
    queryFn: fetchAnalyticsData,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
