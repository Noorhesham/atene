import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/inputs/FormInput";
import { Trash2, Phone, Mail, MessageCircle } from "lucide-react";
import PhoneNumberInput from "@/components/inputs/PhoneNumberInput";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import { MultiSelect } from "@/components/inputs/MultiSelect";
import { useAdminEntity } from "@/hooks/useUsers";

interface UserDetailsProps {
  user: {
    id: number;
    avatar: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    roles: number[];
    is_active: boolean;
    date_of_birth: string;
    gender: "male" | "female";
    referral_code: string;
  };
}

const userSchema = z.object({
  first_name: z.string().min(2, "الاسم الاول مطلوب"),
  last_name: z.string().min(2, "الاسم الاخير مطلوب"),
  roles: z.array(z.string()).min(1, "الدور الوظيفي مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(11, "رقم الهاتف غير صالح"),
  is_active: z.boolean(),
  gender: z.enum(["male", "female"], {
    required_error: "الجنس مطلوب",
  }),
});

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const { data: roles = [] } = useAdminEntity("roles");
  console.log(user.roles, "user roles");
  const { update: updateUser } = useAdminEntity("users");
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      roles: user.roles.map((char) => char.id.toString()),
      email: user.email,
      phone: user.phone,
      is_active: user.is_active,
      gender: user.gender as "male" | "female",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  // Reset form when user changes
  useEffect(() => {
    form.reset({
      first_name: user.first_name,
      last_name: user.last_name,
      roles: user.roles.map((roleId) => roleId.id.toString()),
      email: user.email,
      phone: user.phone,
      is_active: user.is_active,
      gender: user.gender as "male" | "female",
    });
  }, [user, form, roles]);

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    setIsLoading(true);
    try {
      await updateUser(user.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        roles: data.roles.map((id) => parseInt(id)),
        is_active: data.is_active ? 1 : 0,
        gender: data.gender,
      });

      toast.success("تم تحديث بيانات المستخدم بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث البيانات");
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform roles data for MultiSelect
  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: role.id.toString(),
  }));

  return (
    <div className="p-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-[#3A63A8] text-right">بيانات الموظف</h3>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <FormInput
                name="first_name"
                label="الاسم الاول"
                className="bg-white border-[#E7EAEE] h-[44px] text-[#101828]"
              />
              <FormInput
                name="last_name"
                label="الاسم الاخير"
                className="bg-white border-[#E7EAEE] h-[44px] text-[#101828]"
              />
            </div>
            <div className="space-y-2">
              <MultiSelect
                name="roles"
                label="الأدوار الوظيفية"
                options={roleOptions}
                value={form.watch("roles")}
                onValueChange={(values) => {
                  form.setValue("roles", values, { shouldValidate: true });
                }}
                placeholder="اختر الأدوار الوظيفية"
                className="bg-white border-[#E7EAEE] min-h-[44px] text-[#101828]"
              />
            </div>

            <FormInput
              name="email"
              label="البريد الالكتروني"
              className="bg-white border-[#E7EAEE] h-[44px] text-[#101828]"
            />
            <PhoneNumberInput name="phone" label="رقم الهاتف" icon={<Phone size={16} />} />

            <FormInput
              name="gender"
              label="الجنس"
              select
              options={[
                { value: "male", label: "ذكر" },
                { value: "female", label: "أنثى" },
              ]}
              className="bg-white border-[#E7EAEE] h-[44px] text-[#101828]"
            />

            <FormInput
              name="is_active"
              label="مفعل"
              label2="غير مفعل"
              switchToggle
              className="bg-white border-[#E7EAEE] text-[#101828]"
            />
            <div className="mt-6 pt-6 border-t border-[#E7EAEE] flex gap-4 items-center">
              <Button type="submit" className="bg-[#F0F7FF] text-[#2E5DB0] hover:bg-[#F0F7FF]/90" disabled={isLoading}>
                حفظ التعديلات وارسال كود التأكيد
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="bg-[#FEE4E2] text-[#D92D20] hover:bg-[#FEE4E2]/90 flex items-center gap-2"
                disabled={isLoading}
              >
                <Trash2 size={16} />
                حذف الموظف
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>

      <Card className="p-6 bg-white shadow-md">
        <h3 className="text-xl font-semibold text-[#3A63A8] mb-8 text-right">معلومات الموظف</h3>
        <div className="flex items-center justify-start gap-6 text-right">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
              <span className="text-gray-400 font-medium text-lg">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </span>
            </div>
          )}
          <div className="flex flex-col items-start">
            <p className="text-lg font-bold text-gray-800">
              {user.first_name} {user.last_name}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href={`tel:${user.phone}`} className="text-base text-[#3A63A8] font-medium hover:underline">
                {user.phone}
              </a>
              <Phone size={22} className="text-gray-500" />
              <MessageCircle size={22} className="text-gray-500" />
              <Mail size={22} className="text-gray-500" />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500 mb-1">الأدوار الوظيفية</p>
            <p className="font-semibold text-gray-800">
              {roles
                .filter((role) => user.roles.includes(role.id))
                .map((role) => role.name)
                .join(", ")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
            <p className="font-semibold text-gray-800">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">تاريخ الانضمام</p>
            <p className="font-semibold text-gray-800">الاثنين, ١٨ سبتمبر ٢٠٢٣</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserDetails;
