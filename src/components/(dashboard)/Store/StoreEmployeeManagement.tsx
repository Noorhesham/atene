"use client";

import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, Edit, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface Manager {
  id?: number;
  title: string;
  email: string;
  status: string;
  phone?: string;
}

const StoreEmployeeManagement = () => {
  const { control } = useFormContext();
  const [activeTab, setActiveTab] = useState("employees");
  const [editingEmployee, setEditingEmployee] = useState<number | null>(null);

  const {
    fields: managers,
    append,
    update,
    remove,
  } = useFieldArray({
    control,
    name: "managers",
  });

  // Form state for employee input
  const [employeeData, setEmployeeData] = useState({
    title: "",
    email: "",

    status: "active",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: "active", label: "نشط" },
    { value: "not-active", label: "غير نشط" },
  ];

  const validateEmployee = (data: typeof employeeData) => {
    const errors: Record<string, string> = {};

    if (!data.title || data.title.trim().length < 2) {
      errors.title = "اسم الموظف يجب أن يكون حرفين على الأقل";
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "البريد الإلكتروني غير صالح";
    }

    if (!data.status) {
      errors.status = "يرجى اختيار حالة الموظف";
    }

    return errors;
  };

  const handleAddEmployee = () => {
    const errors = validateEmployee(employeeData);
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      append({
        title: employeeData.title,
        email: employeeData.email,
        status: employeeData.status,
      });

      setEmployeeData({
        title: "",
        email: "",

        status: "active",
      });
      setValidationErrors({});
      setActiveTab("employees");
      toast.success("تم إضافة الموظف بنجاح");
    }
  };

  const handleEditEmployee = (index: number) => {
    setEditingEmployee(index);
    setActiveTab("add-employee");
    const employee = managers[index] as unknown as Manager;
    setEmployeeData({
      title: employee.title,
      email: employee.email,
      status: employee.status,
    });
    setValidationErrors({});
  };

  const handleUpdateEmployee = () => {
    const errors = validateEmployee(employeeData);
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0 && editingEmployee !== null) {
      update(editingEmployee, {
        title: employeeData.title,
        email: employeeData.email,
        status: employeeData.status,
      });

      setEmployeeData({
        title: "",
        email: "",

        status: "active",
      });
      setValidationErrors({});
      setEditingEmployee(null);
      setActiveTab("employees");
      toast.success("تم تحديث الموظف بنجاح");
    }
  };

  const handleDeleteEmployee = (index: number) => {
    remove(index);
    toast.success("تم حذف الموظف بنجاح");
  };

  const handleCancelEdit = () => {
    setActiveTab("employees");
    setEditingEmployee(null);
    setEmployeeData({
      title: "",
      email: "",

      status: "active",
    });
    setValidationErrors({});
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">غير نشط</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">في انتظار الموافقة</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">موظفين المتجر</h3>
        <div className="text-sm text-gray-500">الكل ({managers.length})</div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees">جدول الموظفين</TabsTrigger>
          <TabsTrigger value="add-employee">{editingEmployee !== null ? "تعديل الموظف" : "إضافة الموظف"}</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">الموظفين</CardTitle>
              <Button
                onClick={() => {
                  setActiveTab("add-employee");
                  setEditingEmployee(null);
                  handleCancelEdit();
                }}
                className="bg-main hover:bg-main/90"
                size="sm"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة موظف
              </Button>
            </CardHeader>
            <CardContent>
              {managers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>لا يوجد موظفين مضافين بعد</p>
                  <Button
                    onClick={() => {
                      setActiveTab("add-employee");
                      handleCancelEdit();
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    إضافة أول موظف
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-center">
                        <th className=" p-3 font-medium text-gray-700">اسم الوظيفة</th>
                        <th className=" p-3 font-medium text-gray-700">حالة الموظف</th>
                        <th className=" p-3 font-medium text-gray-700">رقم الهاتف</th>
                        <th className=" p-3 font-medium text-gray-700">الايميل</th>
                        <th className=" p-3 font-medium text-gray-700">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managers.map((manager, index: number) => {
                        const emp = manager as unknown as Manager;
                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{emp.title}</span>
                              </div>
                            </td>
                            <td className="p-3">{getStatusBadge(emp.status)}</td>
                            <td className="p-3 text-gray-600">{emp.phone || "+201289022985"}</td>
                            <td className="p-3 text-gray-600">{emp.email}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => handleEditEmployee(index)}
                                  size="sm"
                                  variant="outline"
                                  className="p-2"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteEmployee(index)}
                                  size="sm"
                                  variant="outline"
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-employee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-right font-medium">
                {editingEmployee !== null ? "تعديل الموظف" : "إضافة موظف جديد"}
              </CardTitle>
            </CardHeader>
            <CardContent dir="rtl" className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الالكتروني *</label>
                    <input
                      type="email"
                      value={employeeData.email}
                      onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                      placeholder="keroodel@gmail.com"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-main focus:border-transparent ${
                        validationErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">حالة الموظف *</label>
                    <select
                      value={employeeData.status}
                      onChange={(e) => setEmployeeData({ ...employeeData, status: e.target.value })}
                      aria-label="حالة الموظف"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-main focus:border-transparent ${
                        validationErrors.status ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.status && <p className="text-red-500 text-sm mt-1">{validationErrors.status}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الصلاحيات *</label>
                    <select
                      value={employeeData.title}
                      onChange={(e) => setEmployeeData({ ...employeeData, title: e.target.value })}
                      aria-label="حالة الموظف"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-main focus:border-transparent ${
                        validationErrors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      {[
                        { label: "مدير عام", value: "general_manager" },
                        { label: "بيانات المتجر", value: "store_data" },
                        { label: "بيانات المنتجات", value: "products_data" },
                        { label: "بيانات الكوبونات", value: "coupons_data" },
                        { label: "بيانات الطلبات", value: "orders_data" },
                      ].map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <Button onClick={handleCancelEdit} type="button" variant="outline">
                  إلغاء
                </Button>
                <Button
                  onClick={editingEmployee !== null ? handleUpdateEmployee : handleAddEmployee}
                  type="button"
                  className="bg-main hover:bg-main/90"
                >
                  {editingEmployee !== null ? "تحديث" : "تسجيل"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreEmployeeManagement;
