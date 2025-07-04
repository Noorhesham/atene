import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormInput from "../inputs/FormInput";
import LoadingButton from "../ui/loading-button";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "@/utils/api/auth";
import type { RegisterCredentials } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

// Define error types
interface ValidationError {
  status: boolean | number;
  message: string;
  errors?: Record<string, string[]>;
}

const signupSchema = z
  .object({
    fullname: z.string().min(1, "الاسم الكامل مطلوب"),
    email: z.string().min(1, "البريد الإلكتروني مطلوب"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
    phone: z.string().min(1, "رقم الهاتف مطلوب"),
    // gender: z.enum(["male", "female"], {
    //   required_error: "الجنس مطلوب",
    // }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      // gender: "male",
    },
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await registerUser(credentials);
      await login(response.token); // Use the auth context login function
      return response;
    },
    onSuccess: () => {
      toast.success("تم إنشاء الحساب بنجاح!");
      navigate("/");
    },
    onError: (error: ValidationError) => {
      // Clear any existing errors first
      form.clearErrors();

      if (error.errors && Object.keys(error.errors).length > 0) {
        // Handle field-specific errors
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            form.setError(field as keyof SignupFormData, {
              type: "manual",
              message: messages[0],
            });
            toast.error(messages[0]);
          }
        });
      } else if (error.message) {
        // Handle general error message
        toast.error(error.message);
        // Set error for critical fields to show the message
        ["email", "password"].forEach((field) => {
          form.setError(field as keyof SignupFormData, {
            type: "manual",
            message: error.message,
          });
        });
      }

      // Clear form errors after 5 seconds
      setTimeout(() => {
        form.clearErrors();
      }, 5000);
    },
  });

  const onSubmit = (data: SignupFormData) => {
    // Remove confirmPassword as it's not needed in the API call
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...credentials } = data;
    signup(credentials);
  };

  return (
    <div className="grid bg-white shadow-md rounded-lg lg:grid-cols-2">
      {" "}
      {/* Right Side - Image */}
      <div className="relative lg:block hidden h-full w-full bg-gray-100">
        <img src="/singup.png" className="w-full h-full z-10 object-cover absolute inset-0" alt="Signup background" />
      </div>
      {/* Left Side - Form */}
      <div className="flex flex-col items-center justify-center p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-2">اشتراك</h2>
            <Link to="/login" className="text-gray-500 text-sm">
              لديك حساب بالفعل؟ · تسجيل الدخول
            </Link>
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
              {/* <span className="px-2 bg-white text-gray-500">أو قم بإنشاء حساب جديد</span> */}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-2">
                <FormInput type="text" placeholder="الاسم الكامل" label="الاسم الكامل" name="fullname" />
                <FormInput type="text" placeholder="بريد إلكتروني" label="بريد إلكتروني" name="email" />
                <FormInput type="tel" placeholder="رقم الهاتف" label="رقم الهاتف" name="phone" />
                {/* <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block text-right">الجنس</label>
                  <select
                    {...form.register("gender")}
                    className="w-full rounded-lg border border-gray-300 p-2 text-right"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div> */}
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
              <LoadingButton type="submit" text="إنشاء حساب" isLoading={isPending} />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
