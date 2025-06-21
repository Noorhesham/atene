import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "../inputs/FormInput";
import { Form } from "../ui/form";
import Card from "../Card";
import { Button } from "../ui/button";
import { ChevronLeft, Loader2, User } from "lucide-react";
import { API_BASE_URL } from "@/constants/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface ReviewFormProps {
  productId?: string;
  storeId?: string;
  type?: "product" | "store";
}

// Define the schema for validation using Zod
const reviewSchema = z.object({
  content: z.string().min(10, "يجب أن تكون المراجعة على الأقل 10 أحرف"),
  rate: z.number().min(1, "التقييم مطلوب").max(5, "التقييم يجب أن يكون بين 1 و 5").nullable(),
  images: z.any().optional(), // We'll handle file validation separately
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const ReviewForm = ({ productId, storeId, type = "product" }: ReviewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: data, isAuthenticated, isLoading } = useAuth();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: "",
      rate: null,
      images: undefined,
    },
  });

  const { handleSubmit, reset } = form;

  const onSubmit = async (data: ReviewFormData) => {
    if (!isAuthenticated) {
      toast.error("يجب تسجيل الدخول لإضافة مراجعة");
      return;
    }

    if (!productId && !storeId) {
      toast.error("حدث خطأ أثناء إرسال المراجعة");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("content", data.content);
      if (data.rate) {
        formData.append("rate", data.rate.toString());
      }

      // Handle multiple files
      if (data.images && data.images.length > 0) {
        Array.from(data.images as FileList).forEach((file) => {
          formData.append("images[]", file);
        });
      }

      // Add type-specific ID
      if (type === "product" && productId) {
        formData.append("product_id", productId);
      } else if (type === "store" && storeId) {
        formData.append("store_id", storeId);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      console.log(formData);
      // Send the request
      const response = await fetch(`${API_BASE_URL}/reviews/${type}/${type === "product" ? productId : storeId}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast.success("تم إرسال مراجعتك بنجاح");
      reset();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("حدث خطأ أثناء إرسال المراجعة");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="flex bg-[#F2F2F2] w-full items-center justify-center p-8">
        <p className="text-gray-500">يجب تسجيل الدخول لإضافة مراجعة</p>
      </Card>
    );
  }
  if (isLoading || !data?.user) {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }
  console.log(form.formState.errors);
  return (
    <Card className="flex bg-[#F2F2F2] w-full items-start gap-4 p-6">
      <div className="flex-shrink-0">
        {data?.user.avatar ? (
          <img src={data.user.avatar} alt={data.user.fullname} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
            {data?.user.fullname?.[0]?.toUpperCase() || <User size={24} />}
          </div>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormInput area placeholder="اكتب مراجعتك ..." name="content" />

          <FormInput photo name="images" />
          <div className="flex lg:items-center lg:flex-row flex-col justify-between gap-2">
            <FormInput rate name="rate" />

            <Button type="submit" className="flex items-center gap-2 rounded-full !w-fit " disabled={isSubmitting}>
              <ChevronLeft /> {isSubmitting ? "جاري الإرسال..." : "إرسال المراجعة"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default ReviewForm;
