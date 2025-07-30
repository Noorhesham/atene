
import React from "react";
import { ChevronLeft } from "lucide-react";


// --- components/users/UserList.tsx ---
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";



export const UserList = ({ users, selectedUser, onSelectUser }) => (
  <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="ابحث باسم الموظف او رقم الهاتف"
          className="w-full bg-gray-50 py-2.5 pr-10 pl-4 border-gray-300 rounded-lg"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
      </div>
    </div>
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="font-bold text-gray-800">بيانات الموظف</h3>
      <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
        <ListFilter size={20} /> ترتيب
      </Button>
    </div>
    <div className="flex-grow overflow-y-auto p-2 space-y-2">
      {users.map((user) => {
        const isSelected = selectedUser?.id === user.id;
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email.split("@")[0];
        return (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
              isSelected ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              className="form-checkbox h-5 w-5 text-main rounded border-gray-300 focus:ring-main"
            />
            <img src={user.avatar_url} alt={fullName} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-grow">
              <p className="font-bold text-gray-800">{fullName}</p>
              <p className="text-sm text-gray-500">{user.roles[0]?.name || "موظف"}</p>
            </div>
            <UserStatusIndicator status={user.is_active} />
          </div>
        );
      })}
    </div>
  </div>
);
export default UserList;

// --- components/users/UserDetails.tsx ---
import React from "react";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/inputs/FormInput";
import PhoneInput from "react-phone-number-input-2";
import "react-phone-number-input-2/lib/style.css";
import { Mail, Phone, MessageSquare } from "lucide-react";

export const UserDetails = ({ user }) => {
  const { control } = useFormContext();

  React.useEffect(() => {
    // You might want to reset the form when the selected user changes
    // form.reset(user);
  }, [user]);

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email.split("@")[0];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">بيانات الموظف</h3>
        <div className="space-y-4">
          <FormInput name="fullName" label="الاسم" defaultValue={fullName} />
          <FormInput
            select
            name="role"
            label="الدور الوظيفي"
            options={[{ value: "admin", label: "مدير عام" }]}
            defaultValue={user.roles[0]?.name}
          />
          <FormInput name="email" label="البريد الالكتروني" defaultValue={user.email} />
          <FormField
            control={control}
            name="phone"
            defaultValue={user.phone}
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <PhoneInput
                  {...field}
                  country={"eg"}
                  inputClass="!w-full !h-11 !pr-16 !pl-10 !border-gray-300 !rounded-lg"
                  buttonClass="!bg-transparent !border-l !border-gray-300"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 pt-6 border-t flex justify-between items-center">
          <Button variant="destructive" className="bg-red-50 text-red-600">
            حذف الموظف
          </Button>
          <Button className="bg-gray-100 text-gray-800">حفظ التعديلات وارسال كود التأكيد</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات الموظف</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={user.avatar_url} alt={fullName} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-bold text-gray-900">{fullName}</p>
              <p className="text-sm text-gray-500">{user.roles[0]?.name || "موظف"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-white">
              <Phone size={16} />
            </Button>
            <Button variant="outline" size="icon" className="bg-white">
              <MessageSquare size={16} />
            </Button>
            <Button variant="outline" size="icon" className="bg-white">
              <Mail size={16} />
            </Button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">الدور الوظيفي</p>
            <p className="font-semibold text-gray-800">{user.roles[0]?.name || "موظف"}</p>
          </div>
          <div>
            <p className="text-gray-500">البريد الالكتروني</p>
            <p className="font-semibold text-gray-800">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500">تاريخ الانضمام</p>
            <p className="font-semibold text-gray-800">{new Date(user.last_login_at).toLocaleDateString("ar-EG")}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default UserDetails;
