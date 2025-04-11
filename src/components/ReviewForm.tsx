import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./inputs/FormInput"; // Assuming you have this component
import { Form } from "./ui/form";

// Define the schema for validation using Zod
const reviewSchema = z.object({
  name: z.string().min(1, "أدخل الاسم").max(100, "الاسم طويل جدًا"),
  phone: z.string().min(1, "رقم الهاتف مطلوب").max(20, "رقم الهاتف طويل جدًا"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  review: z.string().min(10, "يجب أن تكون المراجعة على الأقل 10 أحرف"),
  rating: z.number().min(1, "التقييم مطلوب").max(5, "التقييم يجب أن يكون بين 1 و 5"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const ReviewForm = () => {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = form;
  const onSubmit = (data: ReviewFormData) => {
    // Logic for form submission, e.g., send data to the server.
    console.log(data);

    reset();
  };

  return (
    <div>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-700">مراجعة المنتج</h1>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-2">
              <FormInput type="text" placeholder="أدخل الاسم" label="الاسم" name="name" />

              <FormInput type="email" placeholder="person@gmail.com" label="البريد الإلكتروني" name="email" />
            </div>
            {/* Review Textarea */}
            <FormInput area placeholder="اكتب مراجعتك ..." label=" اكتب مراجعتك" name="review" />

            {/* Rating */}
            <div className="flex gap-1">
              <label className="block text-sm font-medium text-left">التقييم</label>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="cursor-pointer">
                    {i < (errors.rating ? 0 : 5) ? "⭐" : "☆"}
                  </span>
                ))}
              </div>
              {errors.rating && <p className="text-red-600 text-sm">{errors.rating.message}</p>}
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                إرسال المراجعة
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ReviewForm;
