import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS, FetchFunction } from "@/constants/api";
import { useState, useCallback } from "react";

// Import types from the existing hook
import {
  ApiUser,
  ApiStore,
  ApiRole,
  ApiPermission,
  ApiCategory,
  ApiReport,
  ApiProduct,
  ApiResponse,
  ApiSingleResponse,
} from "./useUsers";

interface EntityTypeMap {
  users: ApiUser;
  roles: ApiRole;
  permissions: ApiPermission;
  categories: ApiCategory;
  reports: ApiReport;
  stores: ApiStore;
  products: ApiProduct;
  attributes: ApiAttribute;
  "media-center": ApiMediaFile;
}

export interface ApiAttribute {
  id: number;
  title: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  options?: ApiAttributeOption[];
}

export interface ApiAttributeOption {
  id: number;
  title: string;
  attribute_id: number;
  created_at: string;
  updated_at: string;
}

export interface ApiMediaFile {
  id: number;
  file_type: string;
  file_name: string;
  size: number;
  title: string;
  alt: string;
  dimensions: string;
  user_id: number;
  store_id: number | null;
  created_at: string;
  updated_at: string;
  url: string;
  src: string;
}

interface UseAdminEntityQueryOptions {
  initialPage?: number;
  initialPerPage?: number;
  queryParams?: Record<string, string>;
  enabled?: boolean;
}

interface UseAdminEntityQueryReturn<T> {
  data: T[];
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
  create: (entityData: Partial<T>) => Promise<T>;
  update: (id: number, entityData: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

export function useAdminEntityQuery<K extends keyof EntityTypeMap>(
  entityName: K,
  options?: UseAdminEntityQueryOptions
): UseAdminEntityQueryReturn<EntityTypeMap[K]> {
  const [currentPage, setCurrentPage] = useState(options?.initialPage || 1);
  const [perPage, setPerPage] = useState(options?.initialPerPage || 10);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Build query key
  const queryKey = [
    "admin",
    entityName,
    {
      page: currentPage,
      per_page: perPage,
      search: searchQuery.trim() || undefined,
      ...options?.queryParams,
    },
  ];

  // Build URL
  const buildUrl = useCallback(() => {
    let url;
    if (entityName === "media-center") {
      url = `${API_ENDPOINTS.MEDIA_CENTER}/list`;
    } else {
      url = `${API_ENDPOINTS.ADMIN}/${entityName}`;
    }
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

    url += `?${params.toString()}`;
    return url;
  }, [entityName, currentPage, perPage, searchQuery, options?.queryParams]);

  // Fetch function
  const fetchEntities = async (): Promise<ApiResponse<EntityTypeMap[K]>> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const response = await FetchFunction<ApiResponse<EntityTypeMap[K]>>(buildUrl(), "GET", null, {
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
    queryFn: fetchEntities,
    enabled: options?.enabled !== false && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Extract data from query result
  const data = queryResult?.data || [];
  const totalRecords = queryResult?.recordsTotal || 0;
  const filteredRecords = queryResult?.recordsFiltered || 0;
  const totalPages = Math.ceil(filteredRecords / perPage);
  const error = queryError ? (queryError as Error).message : null;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (entityData: Partial<EntityTypeMap[K]>) => {
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${API_ENDPOINTS.ADMIN}/${entityName}`,
        "POST",
        JSON.stringify(entityData),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to create entity");
      }

      return response.record;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["admin", entityName] });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, entityData }: { id: number; entityData: Partial<EntityTypeMap[K]> }) => {
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${API_ENDPOINTS.ADMIN}/${entityName}/${id}`,
        "POST",
        JSON.stringify(entityData),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to update entity");
      }

      return response.record;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["admin", entityName] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await FetchFunction<{ status: boolean; message: string }>(
        `${API_ENDPOINTS.ADMIN}/${entityName}/${id}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to delete entity");
      }

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["admin", entityName] });
    },
  });

  // CRUD functions
  const create = async (entityData: Partial<EntityTypeMap[K]>): Promise<EntityTypeMap[K]> => {
    return createMutation.mutateAsync(entityData);
  };

  const update = async (id: number, entityData: Partial<EntityTypeMap[K]>): Promise<EntityTypeMap[K]> => {
    return updateMutation.mutateAsync({ id, entityData });
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
  };
}
