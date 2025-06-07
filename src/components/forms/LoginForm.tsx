"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import FormInput from "../inputs/FormInput";
import LoadingButton from "../ui/loading-button";
import { loginUser } from "@/utils/api/auth";
import type { LoginCredentials } from "@/types/auth";

// Define error types
interface ValidationError {
  status: number;
  message: string;
  errors?: {
    login?: string[];
    email?: string[];
    password?: string[];
    [key: string]: string[] | undefined;
  };
}

const loginSchema = z.object({
  login: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem("token", data.token);
      toast.success("تم تسجيل الدخول بنجاح!");
      navigate("/dashboard");
    },
    onError: (error: ValidationError) => {
      // Handle validation errors (422)
      if (error.status === 422) {
        if (error.errors) {
          // Handle general login errors
          if (error.errors.login) {
            // Show login error for both email and password fields
            form.setError("login", {
              type: "manual",
              message: error.errors.login[0],
            });
            form.setError("password", {
              type: "manual",
              message: error.errors.login[0],
            });
            toast.error(error.errors.login[0]);
            return;
          }

          // Handle specific field errors
          if (error.errors.login) {
            form.setError("login", {
              type: "manual",
              message: error.errors.login[0],
            });
          }
          if (error.errors.password) {
            form.setError("password", {
              type: "manual",
              message: error.errors.password[0],
            });
          }
        } else {
          // If it's a general validation message
          toast.error(error.message || "فشل التحقق من البيانات");
        }
      } else {
        // For other types of errors
        toast.error(error.message || "فشل تسجيل الدخول");
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="grid bg-white shadow-md rounded-lg lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col items-center justify-center p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-2">تسجيل الدخول</h2>
            <p className="text-gray-500 text-sm">ليس لديك حساب؟ · إنشاء حساب جديد</p>
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
                    name="login"
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
              <LoadingButton type="submit" text="تسجيل الدخول" isLoading={isPending} />
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
      <div className="relative h-full lg:block hidden w-full bg-gray-100">
        <img src="/login.png" className="w-full h-full object-cover absolute inset-0" alt="" />
      </div>
    </div>
  );
};

export default LoginForm;
