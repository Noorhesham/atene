"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";

import FormInput from "../inputs/FormInput";
import MainButton from "../MainButton";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <div className=" grid bg-white shadow-md rounded-lg lg:grid-cols-2">
      {" "}
      {/* Left Side - Form */}
      <div className="flex flex-col items-center justify-center p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-2">تسجيل الدخول</h2>
            <p className="text-gray-500 text-sm">ليس لديك حساب؟ · إنشاء حساب جديد</p>
          </div>

          {/* Google Sign In Button */}
          <button className="w-full flex items-center justify-center gap-3  rounded-full bg-gray-100 p-3 hover:bg-gray-50 transition-colors">
            <span>Google</span>
            <img src="/SVG.svg" alt="Google" width={20} height={20} />
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أدخل بريدك الإلكتروني أو الهاتف</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <FormInput
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني أو الهاتف"
                    label="البريد الإلكتروني"
                    name="email"
                  />
                </div>
                <div>
                  <FormInput
                    password
                    type="password"
                    placeholder="أدخل كلمة المرور الخاصة بك"
                    label="كلمة المرور "
                    name="password"
                  />
                </div>
              </div>
              <MainButton text="تسجيل الدخول" />
              <div className="text-center">
                <a href="#" className="text-sm text-gray-600 hover:underline">
                  نسيت كلمة السر
                </a>
              </div>
            </form>
          </Form>
        </div>
      </div>
      {/* Right Side - Image */}
      <div className="relative h-full lg:block hidden  w-full bg-gray-100">
        <img src="/login.png" className="w-full h-full object-cover absolute inset-0" alt="" />
      </div>
    </div>
  );
};

export default LoginForm;
