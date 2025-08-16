"use client";

import React, { useState } from "react";
import { ApiUser } from "@/types";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ChevronLeft, Search } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { PaginatedList } from "@/components/admin/PaginatedList";
import UserDetails from "./users/UserDetails";
import Actions from "@/components/Actions";
import { Card } from "@/components/ui/card";
import Order from "@/components/Order";
import { PageHeader } from "./PageHeader";
import FilterPanel from "@/components/FilterPanel";

interface FilterCategory {
  name: string;
  value: string | null;
  active?: boolean;
  count?: number;
}

const UserListItem = ({
  user,
  isSelected,
  onSelect,
}: {
  user: ApiUser;
  isSelected: boolean;
  onSelect: (user: ApiUser) => void;
}) => {
  console.log(user);
  return (
    <div className="flex items-center gap-4 p-4 border-input border-b">
      <input
        checked={isSelected}
        onChange={(e) => {
          e.stopPropagation(); // Prevent card click when clicking checkbox
          onSelect(user);
        }}
        type="checkbox"
        className="w-4  h-4 rounded border-2 border-gray-300 text-main 
        focus:ring-2 focus:ring-main focus:ring-offset-2 focus:ring-offset-white cursor-pointer transition-all duration-200 ease-in-out hover:border-main checked:bg-main/60 checked:border-main checked:hover:bg-main/90"
        aria-label={`اختر المستخدم ${user.first_name} ${user.last_name}`}
        title={`اختر المستخدم ${user.first_name} ${user.last_name}`}
      />
      <img
        src={user.avatar_url || "/placeholder-user.png"}
        alt={`${user.first_name} ${user.last_name}`}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="font-medium text-[12.174px] text-black">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-[12.174px] text-[#AAA]">{user.email}</p>
      </div>
      <div className="text-sm">
        <span
          className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
            user.is_active ? "text-[#1FC16B]" : "text-[#D00416]"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${user.is_active ? "bg-[#1FC16B]" : "bg-[#D00416]"}`}></span>
          {user.is_active ? "مفعل" : "معطل"}
        </span>
      </div>
    </div>
  );
};

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
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");

  // Fetch roles for filtering
  const { data: roles, isLoading: rolesLoading } = useAdminEntityQuery("roles");

  const form = useForm();

  // Build filter categories from roles
  const filterCategories: FilterCategory[] = React.useMemo(() => {
    const baseCategories: FilterCategory[] = [{ value: "all", name: "الكل", active: selectedRoleFilter === "all" }];

    if (roles && roles.length > 0) {
      const roleCategories = roles.map((role) => ({
        value: role.id.toString(),
        name: role.name,
        active: selectedRoleFilter === role.id.toString(),
      }));
      return [...baseCategories, ...roleCategories];
    }

    return baseCategories;
  }, [roles, selectedRoleFilter]);

  // Handle filter change
  const handleFilterChange = (filter: string | null) => {
    setSelectedRoleFilter(filter);
    setSelectedUser(null); // Reset selected user when filter changes
  };

  const handleOrderChange = (dir: "asc" | "desc") => {
    setOrderDir(dir);
  };

  const handleUserDeleted = () => {
    setSelectedUser(null);
  };

  // Build query params for filtering
  const queryParams = React.useMemo(() => {
    const params: Record<string, string> = {};

    if (selectedRoleFilter !== "all") {
      params.roles = selectedRoleFilter;
    }

    return params;
  }, [selectedRoleFilter]);
  const links = [
    { label: "المستخدمين", href: "/admin/users", isActive: true },
    { label: "الأدوار والصلاحيات", href: "/admin/roles" },
  ];

  return (
    <div className=" w-full">
      <div className=" z-10">
        <PageHeader
          navLinks={links}
          addButton={{ label: "إضافة مستخدم", href: "/admin/users/add" }}
          helpButton={{ label: "مساعدة", href: "/help" }}
        />
      </div>
      <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" dir="rtl">
        {
          <>
            <p className="text-gray-500 mb-1">المستخدمين / {selectedUser?.first_name} {selectedUser?.last_name}</p>
            <div className="flex justify-between items-center">
              <div className="w-full items-center flex gap-2">
                <div className="p-4 flex justify-between w-full">
                  <div className="relative w-full">
                    <Input
                      type="text"
                      placeholder="ابحث باسم الموظف او رقم الهاتف"
                      className="w-full bg-white py-5 pr-10 pl-4 border-gray-300 rounded-[4px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <Search size={20} />
                    </div>
                  </div>
                  <div>
                    <div className="flex text-base bg-white py-2 px-4 rounded-[4px] text-[#555] items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M5.83325 17.5V15M5.83325 15C5.05659 15 4.66825 15 4.36242 14.8733C4.16007 14.7896 3.97621 14.6668 3.82135 14.5119C3.6665 14.357 3.54368 14.1732 3.45992 13.9708C3.33325 13.665 3.33325 13.2767 3.33325 12.5C3.33325 11.7233 3.33325 11.335 3.45992 11.0292C3.54368 10.8268 3.6665 10.643 3.82135 10.4881C3.97621 10.3332 4.16007 10.2104 4.36242 10.1267C4.66825 10 5.05659 10 5.83325 10C6.60992 10 6.99825 10 7.30409 10.1267C7.50643 10.2104 7.69029 10.3332 7.84515 10.4881C8.00001 10.643 8.12282 10.8268 8.20658 11.0292C8.33325 11.335 8.33325 11.7233 8.33325 12.5C8.33325 13.2767 8.33325 13.665 8.20658 13.9708C8.12282 14.1732 8.00001 14.357 7.84515 14.5119C7.69029 14.6668 7.50643 14.7896 7.30409 14.8733C6.99825 15 6.60992 15 5.83325 15ZM14.1666 17.5V12.5M14.1666 5V2.5M14.1666 5C13.3899 5 13.0016 5 12.6958 5.12667C12.4934 5.21043 12.3095 5.33325 12.1547 5.4881C11.9998 5.64296 11.877 5.82682 11.7933 6.02917C11.6666 6.335 11.6666 6.72333 11.6666 7.5C11.6666 8.27667 11.6666 8.665 11.7933 8.97083C11.877 9.17318 11.9998 9.35704 12.1547 9.5119C12.3095 9.66675 12.4934 9.78957 12.6958 9.87333C13.0016 10 13.3899 10 14.1666 10C14.9433 10 15.3316 10 15.6374 9.87333C15.8398 9.78957 16.0236 9.66675 16.1785 9.5119C16.3333 9.35704 16.4562 9.17318 16.5399 8.97083C16.6666 8.665 16.6666 8.27667 16.6666 7.5C16.6666 6.72333 16.6666 6.335 16.5399 6.02917C16.4562 5.82682 16.3333 5.64296 16.1785 5.4881C16.0236 5.33325 15.8398 5.21043 15.6374 5.12667C15.3316 5 14.9433 5 14.1666 5ZM5.83325 7.5V2.5"
                          stroke="#393939"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="text-sm font-medium">تصفية</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6 items-start min-h-[calc(100vh-200px)]">
              {/* Right Panel: Filters */}
              <div className="col-span-12 lg:col-span-2 shadow-md   h-fit sticky top-4">
                {rolesLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <FilterPanel
                    categories={filterCategories}
                    activeFilter={selectedRoleFilter}
                    onFilterChange={handleFilterChange}
                  />
                )}
              </div>

              {/* Middle Panel: User List */}
              <div className="col-span-12 bg-white lg:col-span-3">
                <div className="mb-4 bg-white shadow-lg py-2 rounded-lg px-4 flex justify-between ">
                  <div className="mr-auto">
                    <Order orderDir={orderDir} setOrderDir={handleOrderChange} />
                  </div>
                </div>
                <Card className="p-0 shadow-sm rounded-lg">
                  <PaginatedList<ApiUser>
                    entityName="users"
                    selectedItem={selectedUser}
                    onSelectItem={setSelectedUser}
                    renderItem={(user) => (
                      <UserListItem
                        user={user}
                        isSelected={selectedUser?.id === user.id}
                        onSelect={(user) => setSelectedUser(user)}
                      />
                    )}
                    searchQuery={searchQuery}
                    queryParams={queryParams}
                  />
                </Card>
              </div>

              {/* Left Panel: User Details Form */}
              <div className="col-span-12 lg:col-span-7 space-y-4">
                {selectedUser && (
                  <Actions
                    title="إجراءات المستخدم"
                    isActive={selectedUser.is_active === 1}
                    entity={{
                      id: selectedUser.id,
                      name: `${selectedUser.first_name} ${selectedUser.last_name}`,
                    }}
                    entityType="users"
                    deleteMessage={`هل أنت متأكد من حذف المستخدم "${selectedUser.first_name} ${selectedUser.last_name}"؟`}
                    onDeleteSuccess={handleUserDeleted}
                    className="bg-white rounded-lg"
                  />
                )}

                <div className="bg-white rounded-lg">
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
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default UsersPage;
