import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS, FetchFunction } from "@/constants/api";

// Generic type for API response with pagination
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  recordsTotal?: number;
  recordsFiltered?: number;
  data: T[];
}

// Base response type for single entity operations
export interface ApiSingleResponse<T> {
  status: boolean;
  message: string;
  record: T;
}

// Base entity interface that all entities should extend
interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

// Specific entity interfaces
export interface ApiUser extends BaseEntity {
  avatar_url: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  roles: number[];
  is_active: number;
  gender: "male" | "female";
  last_login_at: string;
}

export interface ApiPermission extends BaseEntity {
  id: number;
  title: string;
  name: string;
}

export interface ApiRole extends BaseEntity {
  name: string;
  permissions: ApiPermission[];
  permission_ids?: number[]; // For updates
}

export interface ApiCategory extends BaseEntity {
  name: string;
  slug: string;
  image: string | null;
  status: "active" | "inactive";
  parent_id: number | null;
}

export interface ApiReport extends BaseEntity {
  title: string;
  description: string;
  status: string;
  user_id: number;
}

export interface ApiWorkingTime {
  id?: number;
  day: string;
  from: string;
  to: string;
  open_always: boolean;
  closed_always: boolean;
}

export interface ApiManager {
  id?: number;
  title: string;
  email: string;
  status: string;
}

export interface ApiSpecification {
  id: number;
  title: string;
  icon: string;
}

export interface ApiStore extends BaseEntity {
  slug: string;
  name: string;
  logo: string | null;
  logo_url: string | null;
  cover: string | null;
  cover_url: string | null;
  status: "active" | "inactive";
  description: string | null;
  address: string | null;
  lng: number | null;
  lat: number | null;
  email: string;
  owner_id: number;
  currency_id: number;
  phone: string;
  whats_app: string | null;
  tiktok: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  linkedin: string | null;
  pinterest: string | null;
  open_status: string | null;
  workingtimes: ApiWorkingTime[];
  managers: ApiManager[];
}

export interface ApiProduct extends BaseEntity {
  sku: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  cover: string | null;
  cover_url: string | null;
  gallary: string[];
  gallary_url: string[];
  type: "simple" | "variation";
  condition: "new" | "used" | "refurbished";
  category_id: number;
  category: ApiCategory;
  section_id: number;
  section: { id: number; name: string };
  status: "active" | "inactive";
  review_rate: number;
  review_count: number;
  price: number;
  store_id: number | null;
  store: ApiStore | null;
  cross_sells_price: number;
  crossSells: any[]; // Define more specifically if needed
  upSells: any[]; // Define more specifically if needed
  tags: any[]; // Define more specifically if needed
  specifications: any[]; // Define more specifically if needed
  variations: any[]; // Define more specifically if needed
}

// Type mapping for entity names to their interfaces
interface EntityTypeMap {
  users: ApiUser;
  roles: ApiRole;
  permissions: ApiPermission;
  categories: ApiCategory;
  reports: ApiReport;
  stores: ApiStore;
  products: ApiProduct;
}

// Hook return type with pagination
interface UseAdminEntityReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  totalRecords: number;
  filteredRecords: number;
  currentPage: number;
  totalPages: number;
  refetch: () => Promise<void>;
  setCurrentPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSearchQuery: (query: string) => void;
  create: (entityData: Partial<T>) => Promise<T>;
  update: (id: number, entityData: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

// Hook return type for single entity
interface UseAdminSingleEntityReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  update: (entityData: Partial<T>) => Promise<T>;
  remove: () => Promise<void>;
}

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
    let url = `${API_ENDPOINTS.ADMIN}/${entityName}`;
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
  }, [entityName, currentPage, perPage, searchQuery, options?.queryParams]);

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

      if (response.status && Array.isArray(response.data)) {
        setData(response.data);
        setTotalRecords(response.recordsTotal || response.data.length);
        setFilteredRecords(response.recordsFiltered || response.data.length);
      } else {
        throw new Error(response.message || "Invalid data structure from API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error(`Failed to fetch ${entityName}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [user, buildUrl]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredRecords / perPage);

  const create = async (entityData: Partial<EntityTypeMap[K]>): Promise<EntityTypeMap[K]> => {
    try {
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${API_ENDPOINTS.ADMIN}/${entityName}`,
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
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${API_ENDPOINTS.ADMIN}/${entityName}/${id}`,
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
      const response = await FetchFunction<{ status: boolean; message: string }>(
        `${API_ENDPOINTS.ADMIN}/${entityName}/${id}`,
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
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${API_ENDPOINTS.ADMIN}/${entityName}/${id}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
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
      const response = await FetchFunction<ApiSingleResponse<EntityTypeMap[K]>>(
        `${API_ENDPOINTS.ADMIN}/${entityName}/${id}`,
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
      const response = await FetchFunction<{ status: boolean; message: string }>(
        `${API_ENDPOINTS.ADMIN}/${entityName}/${id}`,
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
