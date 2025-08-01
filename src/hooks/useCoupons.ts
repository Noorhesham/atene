import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS, FetchFunction } from "@/constants/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiCoupon, ApiCouponInput, ApiResponse, ApiSingleResponse } from "./useUsers";

interface UseCouponsOptions {
  initialPage?: number;
  initialPerPage?: number;
  queryParams?: Record<string, string>;
  enabled?: boolean;
}

interface UseCouponsReturn {
  data: ApiCoupon[];
  isLoading: boolean;
  error: string | null;
  totalRecords: number;
  filteredRecords: number;
  currentPage: number;
  totalPages: number;
  refetch: () => void;
  setCurrentPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSearchQuery: (query: string) => void;
  create: (couponData: ApiCouponInput) => Promise<ApiCoupon>;
  update: (id: number, couponData: ApiCouponInput) => Promise<ApiCoupon>;
  remove: (id: number) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function useCoupons(options?: UseCouponsOptions): UseCouponsReturn {
  const [currentPage, setCurrentPage] = useState(options?.initialPage || 1);
  const [perPage, setPerPage] = useState(options?.initialPerPage || 10);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Build query key
  const queryKey = [
    "coupons",
    {
      page: currentPage,
      per_page: perPage,
      search: searchQuery.trim() || undefined,
      ...options?.queryParams,
    },
  ];

  // Fetch function
  const fetchCoupons = async (): Promise<ApiResponse<ApiCoupon>> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const url = `${API_ENDPOINTS.BASE}/merchants/coupons`;
    const params = new URLSearchParams();

    params.append("page", currentPage.toString());
    params.append("per_page", perPage.toString());

    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }

    if (options?.queryParams) {
      Object.entries(options.queryParams).forEach(([key, value]) => {
        if (value && key !== "search") {
          params.append(key, value);
        }
      });
    }

    const response = await FetchFunction<ApiResponse<ApiCoupon>>(`${url}?${params.toString()}`, "GET", null, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    });

    if (!response.status || !Array.isArray(response.data)) {
      throw new Error(response.message || "Invalid data structure from API");
    }

    return response;
  };

  // Use TanStack Query
  const {
    data: queryResult,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: fetchCoupons,
    enabled: options?.enabled !== false && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Extract data from query result
  const data = queryResult?.data || [];
  const totalRecords = queryResult?.recordsTotal || 0;
  const filteredRecords = queryResult?.recordsFiltered || 0;
  const totalPages = Math.ceil(filteredRecords / perPage);
  const error = queryError ? (queryError as Error).message : null;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (couponData: ApiCouponInput) => {
      const response = await FetchFunction<ApiSingleResponse<ApiCoupon>>(
        `${API_ENDPOINTS.BASE}/merchants/coupons`,
        "POST",
        JSON.stringify(couponData),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to create coupon");
      }

      return response.record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("تم إنشاء الكوبون بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء الكوبون");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, couponData }: { id: number; couponData: ApiCouponInput }) => {
      const response = await FetchFunction<ApiSingleResponse<ApiCoupon>>(
        `${API_ENDPOINTS.BASE}/merchants/coupons/${id}`,
        "POST",
        JSON.stringify(couponData),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to update coupon");
      }

      return response.record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("تم تحديث الكوبون بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث الكوبون");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await FetchFunction<{ status: boolean; message: string }>(
        `${API_ENDPOINTS.BASE}/merchants/coupons/${id}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to delete coupon");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("تم حذف الكوبون بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف الكوبون");
    },
  });

  // CRUD functions
  const create = async (couponData: ApiCouponInput): Promise<ApiCoupon> => {
    return createMutation.mutateAsync(couponData);
  };

  const update = async (id: number, couponData: ApiCouponInput): Promise<ApiCoupon> => {
    return updateMutation.mutateAsync({ id, couponData });
  };

  const remove = async (id: number): Promise<void> => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    totalRecords,
    filteredRecords,
    currentPage,
    totalPages,
    refetch,
    setCurrentPage,
    setPerPage,
    setSearchQuery,
    create,
    update,
    remove,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
