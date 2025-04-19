"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "../inputs/FormInput";
import MaxWidthWrapper from "../MaxwidthWrapper";

const signupSchema = z
  .object({
    fullName: z.string().min(1, "الاسم الكامل مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    console.log(data);
  };

  return (
    <div className="grid bg-white shadow-md rounded-lg lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col items-center justify-center p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-2">اشتراك</h2>
            <p className="text-gray-500 text-sm">لديك حساب بالفعل؟ · تسجيل الدخول</p>
          </div>

          {/* Google Sign In Button */}
          <button className="w-full flex items-center justify-center gap-3 rounded-full bg-gray-100 p-3 hover:bg-gray-50 transition-colors">
            <span>Google</span>
            <img src="/SVG.svg" alt="Google" width={20} height={20} />
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو قم بإنشاء حساب جديد</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-2">
                <FormInput type="text" placeholder="الاسم الكامل" label="الاسم الكامل" name="fullName" />
                <FormInput type="email" placeholder="بريد إلكتروني" label="بريد إلكتروني" name="email" />
                <FormInput password type="password" placeholder="كلمة المرور" label="كلمة المرور" name="password" />
                <FormInput
                  password
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  label="تأكيد كلمة المرور"
                  name="confirmPassword"
                />
              </div>

              <div className="flex items-center gap-2 text-right">
                <input type="checkbox" id="terms" className="rounded border-gray-300" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  لقد قرأت ووافقت على شروط الخدمة وسياسة الخصوصية
                </label>
              </div>

              <Button
                size={"lg"}
                type="submit"
                className="w-full bg-gradient-to-b from-[#5B89BA] to-[#5B89BA]
    rounded-full hover:bg-[#3e5d89] text-white py-5 transition-colors"
              >
                إنشاء حساب جديد
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="relative lg:block hidden h-full w-full bg-gray-100">
        <div className=" inset-0 absolute bg-black/40 w-full h-full z-20 "> </div>{" "}
        <img
          src="/LOGO-H-WHITE.svg"
          alt="A'atene"
          className=" w-fit z-30 object-cover  absolute left-1/2 top-1/2
         -translate-x-1/2 -translate-y-1/2   "
        />
        <img src="/signuo.png" className="w-full h-full z-10 object-cover absolute inset-0" alt="Signup background" />
      </div>
    </div>
  );
};

export default SignupForm;
