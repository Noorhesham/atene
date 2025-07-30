"use client";

import React, { useState } from "react";
import { ApiUser } from "@/hooks/useUsers";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, HelpCircle, Search } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FilterIcon } from "@/components/icons";
import { Link } from "react-router-dom";
import RolesAndPermissionsPage from "./roles/RolesPage";
import { PaginatedList } from "@/components/admin/PaginatedList";
import UserDetails from "./users/UserDetails";

interface FilterCategory {
  id: string;
  name: string;
  active?: boolean;
}

const UserListItem = ({ user }: { user: ApiUser }) => (
  <div className="flex items-center gap-4 p-4 border-b">
    <img
      src={user.avatar_url || "/placeholder-user.png"}
      alt={`${user.first_name} ${user.last_name}`}
      className="w-10 h-10 rounded-full object-cover"
    />
    <div className="flex-1">
      <p className="font-medium text-gray-900">
        {user.first_name} {user.last_name}
      </p>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
    <div className="text-sm">
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {user.is_active ? "نشط" : "غير نشط"}
      </span>
    </div>
  </div>
);

const FilterPanel = ({
  categories,
  selectedFilter,
  onFilterChange,
}: {
  categories: FilterCategory[];
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
}) => (
  <div className="w-full">
    <h3 className="font-bold text-gray-800 mb-4 px-2">تصفية</h3>
    <ul>
      {categories.map((cat) => (
        <li key={cat.id}>
          <button
            className={`w-full text-right px-4 py-2.5 rounded-md text-sm font-medium ${
              selectedFilter === cat.id ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => onFilterChange(cat.id)}
          >
            {cat.name}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

// Transform ApiUser to match UserDetails expected format
const transformUserForDetails = (user: ApiUser) => ({
  id: user.id,
  avatar: user.avatar_url || "",
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  phone: user.phone || "",
  is_active: Boolean(user.is_active),
  date_of_birth: "",
  gender: "male" as const,
  referral_code: "",
  roles: user.roles,
});

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");

  // Fetch roles for filtering
  const { data: roles, isLoading: rolesLoading } = useAdminEntityQuery("roles");

  const form = useForm();

  // Build filter categories from roles
  const filterCategories: FilterCategory[] = React.useMemo(() => {
    const baseCategories: FilterCategory[] = [{ id: "all", name: "الكل", active: selectedRoleFilter === "all" }];

    if (roles && roles.length > 0) {
      const roleCategories = roles.map((role) => ({
        id: role.id.toString(),
        name: role.name,
        active: selectedRoleFilter === role.id.toString(),
      }));
      return [...baseCategories, ...roleCategories];
    }

    return baseCategories;
  }, [roles, selectedRoleFilter]);

  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setSelectedRoleFilter(filterId);
    setSelectedUser(null); // Reset selected user when filter changes
  };

  // Build query params for filtering
  const queryParams = React.useMemo(() => {
    const params: Record<string, string> = {};

    if (selectedRoleFilter !== "all") {
      params.roles = selectedRoleFilter;
    }

    return params;
  }, [selectedRoleFilter]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center gap-4 mb-6">
        <div className="flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent p-0 h-auto gap-0 border-b-2 border-gray-200 rounded-none">
              <TabsTrigger
                value="users"
                className="text-xl font-bold px-1 pb-3 border-b-4 data-[state=active]:border-main data-[state=active]:bg-transparent shadow-none rounded-none text-gray-900 data-[state=active]:text-main"
              >
                المستخدمين
              </TabsTrigger>
              {/* <TabsTrigger
                value="clients"
                className="text-xl font-bold px-4 pb-3 border-b-4 border-transparent data-[state=active]:border-main data-[state=active]:bg-transparent shadow-none rounded-none text-gray-500 data-[state=active]:text-main"
              >
                الزبائن
              </TabsTrigger> */}
              <TabsTrigger
                value="roles"
                className="text-xl font-bold px-4 pb-3 border-b-4 border-transparent data-[state=active]:border-main data-[state=active]:bg-transparent shadow-none rounded-none text-gray-500 data-[state=active]:text-main"
              >
                الادوار والصلاحيات
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white text-gray-700">
            <HelpCircle size={16} className="ml-2" /> مساعدة
          </Button>
          {activeTab === "users" && (
            <Link to="/admin/users/add">
              <Button className="bg-main text-white hover:bg-main/90">
                <Plus size={16} className="ml-2" /> إضافة مستخدم
              </Button>
            </Link>
          )}
        </div>
      </header>

      {activeTab === "roles" ? (
        <RolesAndPermissionsPage />
      ) : (
        <>
          <p className="text-gray-500 mb-6">المستخدمين / موظف رقم ١</p>
          <div className="flex justify-between items-center">
            <div className="w-full items-center flex gap-2">
              <div className="p-4 w-full">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="ابحث باسم الموظف او رقم الهاتف"
                    className="w-full bg-gray-50 py-5 pr-10 pl-4 border-gray-300 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <Search size={20} />
                  </div>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2 bg-white">
                تصفية
                <FilterIcon />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6 items-start min-h-[calc(100vh-200px)]">
            {/* Right Panel: Filters */}
            <div className="col-span-12 lg:col-span-2 bg-white rounded-lg p-4 h-full sticky top-4">
              {rolesLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <FilterPanel
                  categories={filterCategories}
                  selectedFilter={selectedRoleFilter}
                  onFilterChange={handleFilterChange}
                />
              )}
            </div>

            {/* Middle Panel: User List */}
            <div className="col-span-12 lg:col-span-3 bg-white rounded-lg h-[calc(100vh-250px)] flex flex-col">
              <PaginatedList<ApiUser>
                entityName="users"
                selectedItem={selectedUser}
                onSelectItem={setSelectedUser}
                renderItem={(user) => <UserListItem user={user} />}
                searchQuery={searchQuery}
                queryParams={queryParams}
              />
            </div>

            {/* Left Panel: User Details Form */}
            <div className="col-span-12 lg:col-span-7 bg-white rounded-lg">
              <FormProvider {...form}>
                {selectedUser ? (
                  <UserDetails user={transformUserForDetails(selectedUser)} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 p-8">
                    {searchQuery.trim() !== "" ? "لا يوجد نتائج للبحث" : "الرجاء تحديد مستخدم لعرض التفاصيل"}
                  </div>
                )}
              </FormProvider>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;
