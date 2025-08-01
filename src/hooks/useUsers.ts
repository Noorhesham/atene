import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS, FetchFunction } from "@/constants/api";
import {
  EntityTypeMap,
  UseAdminEntityReturn,
  ApiResponse,
  ApiSingleResponse,
  UseAdminSingleEntityReturn,
} from "@/types";

// Generic type for API response with pagination

export function useAdminEntity<K extends keyof EntityTypeMap>(
  entityName: K,
  options?: {
    autoFetch?: boolean;
    initialPage?: number;
    initialPerPage?: number;
    queryParams?: Record<string, string>;
  }
): UseAdminEntityReturn<EntityTypeMap[K]> {
  const [data, setData] = useState<EntityTypeMap[K][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredRecords, setFilteredRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(options?.initialPage || 1);
  const [perPage, setPerPage] = useState(options?.initialPerPage || 10);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const buildUrl = useCallback(() => {
    const userType = user?.user?.user_type === "admin" ? "admin" : "dashboard";
    let url = `${API_ENDPOINTS.BASE}/${userType}/${entityName}`;
    const params = new URLSearchParams();

    params.append("page", currentPage.toString());
    params.append("per_page", perPage.toString());

    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }

    if (options?.queryParams) {
      Object.entries(options.queryParams).forEach(([key, value]) => {
        if (value && key !== "search") {
          // Don't add search from queryParams
          params.append(key, value);
        }
      });
    }

    url += `?${params.toString()}`;
    return url;
  }, [entityName, currentPage, perPage, searchQuery, options?.queryParams, user?.user?.user_type]);

  const fetchData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await FetchFunction<ApiResponse<EntityTypeMap[K]>>(buildUrl(), "GET", null, {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      });

      console.log(response);

      if (response.status && Array.isArray(response.data)) {
        setData(response.data);
        setTotalRecords(response.recordsTotal || response.data.length);
        setFilteredRecords(response.recordsFiltered || response.data.length);
      } else {
        console.log(response);
        throw new Error(response.message || "Invalid data structure from API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.log(err);
      setError(errorMessage);
      console.error(`Failed to fetch ${entityName}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [user, buildUrl, entityName]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredRecords / perPage);

  const create = async (entityData: Partial<EntityTypeMap[K]>): Promise<EntityTypeMap[K]> => {
    try {
      const userType = user?.user?.user_type === "admin" ? "admin" : "dashboard";
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${API_ENDPOINTS.BASE}/${userType}/${entityName}`,
        "POST",
        JSON.stringify(entityData),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (response.status) {
        await fetchData(); // Refresh the list
        return response.record;
      }
      throw new Error(response.message || "Failed to create entity");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create entity";
      throw new Error(errorMessage);
    }
  };

  const update = async (id: number, entityData: Partial<EntityTypeMap[K]>): Promise<EntityTypeMap[K]> => {
    try {
      const userType = user?.user?.user_type === "admin" ? "admin" : "dashboard";
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${API_ENDPOINTS.BASE}/${userType}/${entityName}/${id}`,
        "POST",
        JSON.stringify(entityData),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (response.status) {
        await fetchData(); // Refresh the list
        return response.record;
      }
      throw new Error(response.message || "Failed to update entity");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update entity";
      throw new Error(errorMessage);
    }
  };

  const remove = async (id: number): Promise<void> => {
    try {
      const userType = user?.user?.user_type === "admin" ? "admin" : "dashboard";
      const response = await FetchFunction<{ status: boolean; message: string }>(
        `${API_ENDPOINTS.BASE}/${userType}/${entityName}/${id}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (response.status) {
        await fetchData(); // Refresh the list
      } else {
        throw new Error(response.message || "Failed to delete entity");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete entity";
      throw new Error(errorMessage);
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData, options?.autoFetch]);

  return {
    data,
    isLoading,
    error,
    totalRecords,
    filteredRecords,
    currentPage,
    totalPages,
    refetch: fetchData,
    setCurrentPage,
    setPerPage,
    setSearchQuery,
    create,
    update,
    remove,
  };
}

export function useAdminSingleEntity<K extends keyof EntityTypeMap>(
  entityName: K,
  id: string | number | undefined,
  options?: {
    autoFetch?: boolean;
  }
): UseAdminSingleEntityReturn<EntityTypeMap[K]> {
  const [data, setData] = useState<EntityTypeMap[K] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user || !id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userType = user?.user?.user_type === "admin" ? "admin" : "merchants";
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${API_ENDPOINTS.BASE}/${userType}/${entityName}/${id}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          storeId: localStorage.getItem("storeId") || undefined,
        }
      );

      console.log(response);
      if (response.status && (response.record || response.data)) {
        setData(response.record || response.data);
      } else {
        throw new Error(response.message || "Invalid data structure from API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error(`Failed to fetch ${entityName} with id ${id}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [user, entityName, id]);

  const update = async (entityData: Partial<EntityTypeMap[K]>): Promise<EntityTypeMap[K]> => {
    if (!id) {
      throw new Error("Cannot update entity without ID");
    }

    try {
      const userType = user?.user?.user_type === "admin" ? "admin" : "dashboard";
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${API_ENDPOINTS.BASE}/${userType}/${entityName}/${id}`,
        "POST",
        JSON.stringify(entityData),
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (response.status) {
        setData(response.record);
        return response.record;
      }
      throw new Error(response.message || "Failed to update entity");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update entity";
      throw new Error(errorMessage);
    }
  };

  const remove = async (): Promise<void> => {
    if (!id) {
      throw new Error("Cannot delete entity without ID");
    }

    try {
      const userType = user?.user?.user_type === "admin" ? "admin" : "dashboard";
      const response = await FetchFunction<{ status: boolean; message: string }>(
        `${API_ENDPOINTS.BASE}/${userType}/${entityName}/${id}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      );

      if (response.status) {
        setData(null);
      } else {
        throw new Error(response.message || "Failed to delete entity");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete entity";
      throw new Error(errorMessage);
    }
  };

  // Fetch when dependencies change
  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData, options?.autoFetch]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    update,
    remove,
  };
}

// Example usage:
// const { data: users, isLoading, error, create: createUser } = useAdminEntity('users');
// const { data: stores, isLoading, error, create: createStore } = useAdminEntity('stores');
// const { data: roles, isLoading, error, create: createRole } = useAdminEntity('roles');
// const { data: permissions, isLoading, error } = useAdminEntity('permissions', { autoFetch: false });
// const { data: categories, isLoading, error } = useAdminEntity('categories', { queryParams: { parent_id: '1' } });

// Single entity usage:
// const { data: store, isLoading, error, update, remove } = useAdminSingleEntity('stores', storeId);
// const { data: user, isLoading, error } = useAdminSingleEntity('users', userId);
