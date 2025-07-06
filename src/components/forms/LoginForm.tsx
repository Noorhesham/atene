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
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

// Define error types
interface ValidationError {
  status: boolean | number;
  message: string;
  errors: string[];
}

const loginSchema = z.object({
  login: z.string().min(1, "البريد الإلكتروني مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await loginUser({
        login: credentials.login,
        password: credentials.password,
      });
      await login(response.token); // Use the auth context login function
      return response;
    },
    onSuccess: () => {
      toast.success("تم تسجيل الدخول بنجاح!");
      navigate("/");
    },
    onError: (error: ValidationError) => {
      // Clear any existing errors first
      form.clearErrors();

      // Show error message in toast
      toast.error(error.message || "فشل تسجيل الدخول");

      // Clear form errors after 5 seconds
      setTimeout(() => {
        form.clearErrors();
      }, 5000);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation(data);
  };

  return (
    <div className="grid bg-white shadow-md rounded-lg lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col items-center justify-center p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-2">تسجيل الدخول</h2>
            <p className="text-gray-500 text-sm">
              ليس لديك حساب؟ ·{" "}
              <Link to="/signup" className="  hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
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
            <div className="relative flex justify-center text-sm"></div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-5">
                <div>
                  <FormInput
                    type="text"
                    placeholder="أدخل بريدك الإلكتروني أو الهاتف"
                    label="أدخل بريدك الإلكتروني أو الهاتف"
                    name="login"
                  />
                </div>
                <div>
                  <FormInput
                    password
                    type="password"
                    placeholder="أدخل كلمة المرور الخاصة بك"
                    label="أدخل كلمة المرور الخاصة بك"
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
