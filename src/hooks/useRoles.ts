import { useQuery } from "@tanstack/react-query";
import { FetchFunction } from "@/constants/api";

export interface Permission {
  id: number;
  title: string;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface RolesResponse {
  status: boolean;
  message: string;
  data: Role[];
  recordsTotal: number;
  recordsFiltered: number;
}

export const useRoles = () => {
  const { data, isLoading, error, refetch } = useQuery<RolesResponse>({
    queryKey: ["roles"],
    queryFn: () => FetchFunction("/admin/roles", "GET"),
  });

  return {
    roles: data?.data ?? [],
    isLoading,
    error,
    refetch,
    totalRecords: data?.recordsTotal ?? 0,
  };
};
