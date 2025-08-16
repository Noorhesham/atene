import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS, FetchFunction } from "@/constants/api";
import { useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import {
  EntityInputMap,
  EndpointConfig,
  EntityTypeMap,
  UseAdminEntityQueryOptions,
  ApiResponseWithTotal,
  ApiSingleResponse,
  ApiFollowersResponse,
} from "@/types";

// Centralized endpoint configuration
const ENTITY_ENDPOINTS: Record<string, EndpointConfig> = {
  users: {
    admin: `${API_ENDPOINTS.ADMIN}/users`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/users`,
    requiresAuth: true,
  },
  roles: {
    admin: `${API_ENDPOINTS.ADMIN}/roles`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/roles`,
    requiresAuth: true,
  },
  permissions: {
    admin: `${API_ENDPOINTS.ADMIN}/permissions`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/permissions`,
    requiresAuth: true,
  },
  categories: {
    admin: `${API_ENDPOINTS.ADMIN}/categories`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/categories`,
    requiresAuth: true,
  },
  reports: {
    admin: `${API_ENDPOINTS.ADMIN}/reports`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/reports`,
    requiresAuth: true,
  },
  stores: {
    admin: `${API_ENDPOINTS.ADMIN}/stores`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/stores`,
    requiresAuth: true,
  },
  products: {
    admin: `${API_ENDPOINTS.ADMIN}/products`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/products`,
    requiresAuth: true,
  },
  attributes: {
    admin: `${API_ENDPOINTS.ADMIN}/attributes`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/attributes`,
    requiresAuth: true,
  },
  "media-center": {
    admin: `${API_ENDPOINTS.ADMIN}/media-center`,
    merchant: `${API_ENDPOINTS.MEDIA_CENTER}/list`,
    requiresAuth: true,
  },
  coupons: {
    admin: `${API_ENDPOINTS.ADMIN}/coupons`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/coupons`,
    requiresAuth: true,
  },
  orders: {
    admin: `${API_ENDPOINTS.ADMIN}/orders`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/orders`,
    requiresAuth: true,
  },
  stories: {
    admin: `${API_ENDPOINTS.ADMIN}/stories`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/stories`,
    requiresAuth: true,
  },
  highlights: {
    admin: `${API_ENDPOINTS.ADMIN}/highlights`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/highlights`,
    requiresAuth: true,
  },
  followers: {
    admin: `${API_ENDPOINTS.ADMIN}/followers`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/followers`,
    requiresAuth: true,
  },
  following: {
    admin: `${API_ENDPOINTS.ADMIN}/following`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/followings`,
    requiresAuth: true,
  },
  "convert-to-merchant": {
    admin: `${API_ENDPOINTS.ADMIN}/convert-to-merchant`,
    merchant: `${API_ENDPOINTS.BASE}/convert-to-merchant`,
    requiresAuth: true,
  },
  currencies: {
    admin: `${API_ENDPOINTS.ADMIN}/currencies`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/currencies`,
    requiresAuth: true,
  },
  "categories-select": {
    admin: `${API_ENDPOINTS.ADMIN}/categories/select`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/categories/select`,
    requiresAuth: true,
  },
  sections: {
    admin: `${API_ENDPOINTS.ADMIN}/sections`,
    merchant: `${API_ENDPOINTS.BASE}/merchants/sections`,
    requiresAuth: true,
  },
  conversations: {
    admin: `${API_ENDPOINTS.BASE}/conversations`,
    merchant: `${API_ENDPOINTS.BASE}/conversations`,
    requiresAuth: true,
  },
  messages: {
    admin: `${API_ENDPOINTS.BASE}/messages`,
    merchant: `${API_ENDPOINTS.BASE}/messages`,
    requiresAuth: true,
  },
  reports: {
    admin: `${API_ENDPOINTS.ADMIN}/reports`,
    requiresAuth: true,
  },
  settings: {
    admin: `${API_ENDPOINTS.ADMIN}/settings/get`,
    requiresAuth: true,
  },
  "settings-update": {
    admin: `${API_ENDPOINTS.ADMIN}/settings`,
    requiresAuth: true,
  },
  prev_participants: {
    admin: `${API_ENDPOINTS.BASE}/conversations/prev_participants`,
    merchant: `${API_ENDPOINTS.BASE}/conversations/prev_participants`,
    requiresAuth: true,
  },
  "order-clients": {
    merchant: `${API_ENDPOINTS.BASE}/merchants/orders/clients`,
    requiresAuth: true,
  },
};

interface UseAdminEntityQueryReturn<K extends keyof EntityTypeMap> {
  data: K extends "followers" | "following" ? EntityTypeMap[K] : EntityTypeMap[K][];
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
  create: (entityData: EntityInputMap[K]) => Promise<EntityTypeMap[K]>;
  update: (id: number, entityData: EntityInputMap[K]) => Promise<EntityTypeMap[K]>;
  remove: (id: number) => Promise<void>;
  unfollow?: (followedType: string, followedId: number) => Promise<void>;
  updateParent?: (categories: { id: number; parent_id: number | null }[]) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isUnfollowing: boolean;
  isUpdatingParent: boolean;
}

export function useAdminEntityQuery<K extends keyof EntityTypeMap>(
  entityName: K,
  options?: UseAdminEntityQueryOptions,
  forceUserType?: "admin" | "merchant"
): UseAdminEntityQueryReturn<K> {
  const [currentPage, setCurrentPage] = useState(options?.initialPage || 1);
  const [perPage, setPerPage] = useState(options?.initialPerPage || 10);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Determine user type from auth context or force override
  const userType = useMemo(() => {
    if (forceUserType) return forceUserType;
    if (user?.user?.user_type === "admin") return "admin";
    return "merchant";
  }, [user?.user?.user_type, forceUserType]);

  const isAdmin = userType === "admin";

  // Build query key
  const queryKey = [
    userType,
    entityName,
    {
      page: currentPage,
      per_page: perPage,
      name: searchQuery.trim() || undefined,
      ...options?.queryParams,
    },
  ];

  // Get endpoint configuration
  const getEndpoint = useCallback(
    (entity: string): string => {
      const config = ENTITY_ENDPOINTS[entity];
      if (!config) {
        // Fallback for entities not in config
        return isAdmin ? `${API_ENDPOINTS.ADMIN}/${entity}` : `${API_ENDPOINTS.BASE}/merchants/${entity}`;
      }
      return isAdmin ? config.admin : config.merchant;
    },
    [isAdmin]
  );

  // Build URL
  const buildUrl = useCallback(() => {
    const baseUrl = getEndpoint(entityName);
    const params = new URLSearchParams();

    params.append("page", currentPage.toString());
    params.append("per_page", perPage.toString());

    if (searchQuery.trim()) {
      params.append("name", searchQuery.trim());
    }

    // Add additional query parameters
    if (options?.queryParams) {
      Object.entries(options.queryParams).forEach(([key, value]) => {
        if (value && !baseUrl.includes(`${key}=${value}`)) {
          params.append(key, value);
        }
      });
    }

    return `${baseUrl}?${params.toString()}`;
  }, [getEndpoint, entityName, currentPage, perPage, searchQuery, options?.queryParams]);

  // Fetch function
  const fetchEntities = async (): Promise<ApiResponseWithTotal> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
      ...(options?.headers || {}),
      ...(isAdmin ? {} : { storeId: localStorage.getItem("storeId") || undefined }),
    };

    const response = await FetchFunction<ApiResponseWithTotal>(buildUrl(), "GET", null, headers);
    console.log(response);
    if (!response.status) {
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
    queryFn: fetchEntities,
    enabled: options?.enabled !== false && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Extract data from query result with proper type handling
  const data = useMemo(() => {
    if (!queryResult) {
      return entityName === "followers" || entityName === "following" ? { followers: [], total: 0 } : [];
    }
    console.log(queryResult);
    // For followers/following endpoints, the data structure is different
    if (entityName === "categories-select") {
      return {
        data: queryResult.categories || [],
        total: queryResult.total || 0,
        status: queryResult.status,
        message: queryResult.message || "",
      } as ApiResponseWithTotal;
    }
    if (entityName === "followers" || entityName === "following") {
      return {
        followers: queryResult.followers || [],
        total: queryResult.total || 0,
        status: queryResult.status,
        message: queryResult.message || "",
      } as ApiFollowersResponse;
    }
    if (entityName === "conversations") {
      return {
        data: queryResult.conversations || [],
        total: queryResult.total || 0,
        status: queryResult.status,
        message: queryResult.message || "",
      } as ApiResponseWithTotal;
    }
    if (entityName === "order-clients") {
      return {
        data: queryResult.clients || [],
        total: queryResult.total || 0,
        status: queryResult.status,
        message: queryResult.message || "",
      } as ApiResponseWithTotal;
    }
    if (entityName === "messages") {
      return {
        data: queryResult.messages || [],
        total: queryResult.total || 0,
        status: queryResult.status,
        message: queryResult.message || "",
      } as ApiResponseWithTotal;
    }
    if (entityName === "settings") {
      return {
        data: queryResult.settings || {},
        total: queryResult.total || 0,
        status: queryResult.status,
        message: queryResult.message || "",
      } as ApiResponseWithTotal;
    }
    if (entityName === "prev_participants") {
      return {
        data: queryResult.participants || [],
        total: queryResult.total || 0,
        status: queryResult.status,
        message: queryResult.message || "",
      } as ApiResponseWithTotal;
    }
    // For regular entities
    return queryResult.data || [];
  }, [queryResult, entityName]);

  const totalRecords = queryResult?.recordsTotal || queryResult?.total || 0;
  const filteredRecords = queryResult?.recordsFiltered || queryResult?.total || 0;
  const totalPages = Math.ceil(filteredRecords / perPage);
  const error = queryError ? (queryError as Error).message : null;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (entityData: EntityInputMap[K]) => {
      const endpoint = getEndpoint(entityName);
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        endpoint,
        "POST",
        JSON.stringify(entityData),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          ...(isAdmin ? {} : { storeId: localStorage.getItem("storeId") || "" }),
        }
      );

      if (!response.status) {
        console.log(response);
        throw new Error(response.message || "Failed to create entity");
      }

      return response.record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userType, entityName] });
      toast.success("تم إنشاء العنصر بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء العنصر");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, entityData }: { id: number; entityData: EntityInputMap[K] }) => {
      const endpoint = getEndpoint(entityName);
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${endpoint}/${id}`,
        "POST",
        JSON.stringify(entityData),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          ...(options?.headers || {}),
          ...(isAdmin ? {} : { storeId: localStorage.getItem("storeId") || "" }),
        }
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to update entity");
      }

      return response.record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userType, entityName] });
      toast.success("تم تحديث العنصر بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث العنصر");
    },
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: async ({ followedType, followedId }: { followedType: string; followedId: number }) => {
      const response = await FetchFunction<{ status: boolean; message: string }>(
        `${API_ENDPOINTS.BASE}/merchants/unfollow`,
        "POST",
        JSON.stringify({
          followed_type: followedType,
          followed_id: followedId,
        }),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        }
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to unfollow");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userType, entityName] });
      toast.success("تم إلغاء المتابعة بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إلغاء المتابعة");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const endpoint = getEndpoint(entityName);
      const response = await FetchFunction<{ status: boolean; message: string }>(`${endpoint}/${id}`, "DELETE", null,       {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        ...(options?.headers || {}),
        ...(isAdmin ? {} : { storeId: localStorage.getItem("storeId") || "" }),
      });

      if (!response.status) {
        throw new Error(response.message || "Failed to delete entity");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userType, entityName] });
      toast.success("تم حذف العنصر بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف العنصر");
    },
  });

  // Update parent mutation (only for categories)
  const updateParentMutation = useMutation({
    mutationFn: async (categories: { id: number; parent_id: number | null }[]) => {
      const response = await FetchFunction<{ status: boolean; message: string }>(
        `${API_ENDPOINTS.ADMIN}/categories/update-parent`,
        "POST",
        JSON.stringify({ categories }),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        }
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to update parent relationships");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("تم تحديث هيكل التصنيفات بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث هيكل التصنيفات");
    },
  });

  // CRUD functions with loading states
  const create = async (entityData: EntityInputMap[K]): Promise<EntityTypeMap[K]> => {
    return createMutation.mutateAsync(entityData);
  };

  const update = async (id: number, entityData: EntityInputMap[K]): Promise<EntityTypeMap[K]> => {
    return updateMutation.mutateAsync({ id, entityData });
  };

  const remove = async (id: number): Promise<void> => {
    await deleteMutation.mutateAsync(id);
  };

  const updateParent =
    entityName === "categories"
      ? async (categories: { id: number; parent_id: number | null }[]): Promise<void> => {
          await updateParentMutation.mutateAsync(categories);
        }
      : undefined;

  const unfollow = async (followedType: string, followedId: number): Promise<void> => {
    await unfollowMutation.mutateAsync({ followedType, followedId });
  };

  return {
    data: data as K extends "followers" | "following" ? EntityTypeMap[K] : EntityTypeMap[K][],
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
    unfollow,
    updateParent,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,
    isUpdatingParent: updateParentMutation.isPending,
  };
}
