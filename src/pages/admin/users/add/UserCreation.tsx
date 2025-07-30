"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/inputs/FormInput";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import ImageUploader from "@/components/inputs/ImageUploader";
import PhoneNumberInput from "@/components/inputs/PhoneNumberInput";
import { Phone } from "lucide-react";
import { useAdminEntity } from "@/hooks/useUsers";
import { MultiSelect } from "@/components/inputs/MultiSelect";

const userSchema = z.object({
  avatar: z.string().optional(),
  first_name: z.string().min(2, "الاسم الأول مطلوب"),
  last_name: z.string().min(2, "الاسم الأخير مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(11, "رقم الهاتف غير صالح"),
  gender: z.enum(["male", "female"], {
    required_error: "الجنس مطلوب",
  }),
  roles: z.array(z.string()).min(1, "الدور الوظيفي مطلوب"),
});

type UserFormData = z.infer<typeof userSchema>;

const UserCreation = () => {
  const { create: createUser } = useAdminEntity("users");
  const { data: roles = [] } = useAdminEntity("roles");

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "male",
      roles: [],
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const userData = {
        ...data,
        is_active: true,
        roles: data.roles.map((id) => parseInt(id)),
      };

      // Only include avatar if it exists
      if (!data.avatar) {
        delete userData.avatar;
      }

      await createUser(userData);
      toast.success("تم إنشاء المستخدم بنجاح");
      form.reset();
    } catch (error) {
      toast.error("حدث خطأ أثناء إنشاء المستخدم");
      console.error("Error creating user:", error);
    }
  };

  // Transform roles data for MultiSelect
  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: role.id.toString(),
  }));

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>إدارة المبيعات</span>
          <span>/</span>
          <span className="text-gray-900">إضافة عميل جديد</span>
        </div>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-main mb-6">المعلومات الأساسية</h3>

            {/* Profile Image */}
            <div className="mb-8">
              <h4 className="text-base font-semibold text-[#101828] mb-2">الصورة الشخصية</h4>

              <ImageUploader name="avatar" />

              <p className="text-sm text-gray-500 mt-2">اضف صورة شخصية (PNG, JPG)</p>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput name="first_name" label="الاسم الأول" className="text-[#101828]" />
              <FormInput name="last_name" label="الاسم الأخير" className="text-[#101828]" />
            </div>

            {/* Email */}
            <FormInput name="email" label="البريد الالكتروني" type="email" className="text-[#101828] mb-4" />

            {/* Phone */}
            <PhoneNumberInput name="phone" label="رقم الهاتف" icon={<Phone size={16} />} />

            {/* Roles */}
            <div className="mt-4">
              <MultiSelect
                name="roles"
                label="الأدوار الوظيفية"
                options={roleOptions}
                defaultValue={[]}
                onValueChange={(values) => {
                  form.setValue("roles", values, { shouldValidate: true });
                }}
                placeholder="اختر الأدوار الوظيفية"
                className="bg-white border-[#E7EAEE] min-h-[44px] text-[#101828]"
              />
            </div>

            {/* Gender */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">الجنس</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...form.register("gender")}
                    value="male"
                    className="w-5 h-5 text-[#395A7D] border-[#E7EAEE]"
                  />
                  <span>ذكر</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...form.register("gender")}
                    value="female"
                    className="w-5 h-5 text-[#395A7D] border-[#E7EAEE]"
                  />
                  <span>انثى</span>
                </label>
              </div>
              {form.formState.errors.gender && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.gender.message}</p>
              )}
            </div>
          </Card>

          <div className="mt-6 flex justify-start">
            <Button
              type="submit"
              className="bg-[#395A7D] text-white hover:bg-[#395A7D]/90 px-6"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء عميل"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default UserCreation;
