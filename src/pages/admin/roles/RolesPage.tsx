import React, { useState, useEffect } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiRole, ApiPermission } from "@/hooks/useUsers";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import Actions from "@/components/Actions";

// Simple interfaces
interface RolesSidebarProps {
  roles: ApiRole[];
  selectedRoleId: number | null;
  onSelectRole: (id: number) => void;
  isLoading: boolean;
}

interface PermissionsFormProps {
  selectedRole: ApiRole | null;
  allPermissions: ApiPermission[];
  rolesMutation: {
    update: (id: number, data: Partial<ApiRole>) => Promise<ApiRole>;
    create: (data: Partial<ApiRole>) => Promise<ApiRole>;
    remove: (id: number) => Promise<void>;
    isUpdating: boolean;
  };
  onRoleUpdated: () => void;
}

// Category labels mapping
const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    users: "إدارة المستخدمين",
    roles: "إدارة الأدوار",
    stores: "إدارة المتاجر",
    products: "إدارة المنتجات",
    orders: "إدارة الطلبات",
    categories: "إدارة الفئات",
    reports: "التقارير",
    settings: "الإعدادات",
    general: "عام",
  };
  return labels[category] || category;
};

const RolesSidebar = ({ roles, selectedRoleId, onSelectRole, isLoading }: RolesSidebarProps) => (
  <Card className="w-64 p-4">
    {isLoading ? (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    ) : (
      <ul className="space-y-1">
        {roles.map((role) => (
          <li key={role.id}>
            <button
              onClick={() => onSelectRole(role.id)}
              className={`w-full text-right flex justify-between items-center px-3 py-2 rounded-md text-sm transition-colors ${
                selectedRoleId === role.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{role.name}</span>
              {selectedRoleId === role.id && <ChevronLeft size={16} />}
            </button>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const PermissionsForm = ({ selectedRole, allPermissions, rolesMutation, onRoleUpdated }: PermissionsFormProps) => {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());

  // Update form when selected role changes
  useEffect(() => {
    if (selectedRole) {
      setRoleName(selectedRole.name);
      const rolePermissionIds = new Set(selectedRole.permissions.map((p) => p.id));
      setSelectedPermissions(rolePermissionIds);
    } else {
      setRoleName("");
      setSelectedPermissions(new Set());
    }
  }, [selectedRole]);

  // Group permissions by category
  const permissionGroups = React.useMemo(() => {
    const groups: Record<string, ApiPermission[]> = {};

    allPermissions.forEach((permission) => {
      const category = permission.name.split(".")[0] || "general";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return Object.entries(groups).map(([category, permissions]) => ({
      category,
      label: getCategoryLabel(category),
      permissions: permissions.sort((a, b) => a.title.localeCompare(b.title)),
    }));
  }, [allPermissions]);

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleGroupToggle = (groupPermissions: ApiPermission[]) => {
    const groupIds = groupPermissions.map((p) => p.id);
    const allSelected = groupIds.every((id) => selectedPermissions.has(id));

    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      groupIds.forEach((id) => {
        if (allSelected) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      });
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!selectedRole || !roleName.trim()) return;

    try {
      await rolesMutation.update(selectedRole.id, {
        name: roleName,
        permission_ids: Array.from(selectedPermissions),
      });
      onRoleUpdated();
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  const handleReset = () => {
    if (selectedRole) {
      setRoleName(selectedRole.name);
      const rolePermissionIds = new Set(selectedRole.permissions.map((p) => p.id));
      setSelectedPermissions(rolePermissionIds);
    }
  };

  if (!selectedRole) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-lg mb-2">لا يوجد دور محدد</div>
          <div className="text-sm">الرجاء اختيار دور من القائمة الجانبية</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Card className="p-6">
        {/* Role Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم الدور الوظيفي <span className="text-red-500">*</span>
          </label>
          <Input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="أدخل اسم الدور الوظيفي"
            className="w-full"
          />
        </div>

        {/* Permissions Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">صلاحيات النظام</h3>
            <div className="text-sm text-gray-500">
              محدد: {selectedPermissions.size} من {allPermissions.length}
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {permissionGroups.map(({ category, label, permissions }) => {
              const groupIds = permissions.map((p) => p.id);
              const selectedCount = groupIds.filter((id) => selectedPermissions.has(id)).length;
              const allSelected = selectedCount === groupIds.length;
              const someSelected = selectedCount > 0;

              return (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  {/* Group Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-800">{label}</h4>
                      <span className="text-sm text-gray-500">({permissions.length})</span>
                      {someSelected && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {selectedCount} محدد
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={allSelected}
                        ref={(el) => {
                          if (el) {
                            const checkboxElement = el as HTMLButtonElement & { indeterminate?: boolean };
                            checkboxElement.indeterminate = someSelected && !allSelected;
                          }
                        }}
                        onCheckedChange={() => handleGroupToggle(permissions)}
                      />
                      <span className="text-sm text-gray-600">تحديد الكل</span>
                    </div>
                  </div>

                  {/* Permissions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          checked={selectedPermissions.has(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{permission.title}</div>
                          <div className="text-xs text-gray-500 truncate">{permission.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            disabled={rolesMutation.isUpdating || !roleName.trim()}
            className="bg-main text-white hover:bg-blue-800"
          >
            {rolesMutation.isUpdating ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const RolesAndPermissionsPage = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  // Fetch data using TanStack Query hooks
  const rolesMutation = useAdminEntityQuery("roles");
  const { data: roles = [], isLoading: rolesLoading, error: rolesError } = rolesMutation;

  const {
    data: permissions = [],
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useAdminEntityQuery("permissions");

  const handleRoleUpdated = () => {
    rolesMutation.refetch();
  };

  // Auto-select first role when data loads
  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  // Reset selected role if it's deleted
  useEffect(() => {
    if (selectedRoleId && !roles.find((role) => role.id === selectedRoleId)) {
      setSelectedRoleId(roles.length > 0 ? roles[0].id : null);
    }
  }, [roles, selectedRoleId]);

  const selectedRole = selectedRoleId ? roles.find((role) => role.id === selectedRoleId) || null : null;
  const isLoading = rolesLoading || permissionsLoading;
  const error = rolesError || permissionsError;

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">حدث خطأ أثناء تحميل البيانات</div>
        <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="p-8" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-base text-gray-500">المستخدمين / الأدوار والصلاحيات</p>
      </div>

      {/* Actions Component for Role Deletion */}
      {selectedRole && (
        <Actions
          title="إجراءات الدور"
          entity={selectedRole}
          entityType="roles"
          deleteMessage={`هل أنت متأكد من حذف الدور "${selectedRole.name}"؟`}
          onDeleteSuccess={() => {
            setSelectedRoleId(roles.length > 1 ? roles.find((r) => r.id !== selectedRole.id)?.id || null : null);
          }}
          className="mb-6"
        />
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="flex gap-6">
          <RolesSidebar
            roles={roles}
            selectedRoleId={selectedRoleId}
            onSelectRole={setSelectedRoleId}
            isLoading={rolesLoading}
          />
          <PermissionsForm
            selectedRole={selectedRole}
            allPermissions={permissions}
            rolesMutation={rolesMutation}
            onRoleUpdated={handleRoleUpdated}
          />
        </div>
      )}
    </div>
  );
};

export default RolesAndPermissionsPage;
