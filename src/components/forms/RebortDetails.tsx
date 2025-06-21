"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormInput from "../inputs/FormInput";
import { Button } from "@/components/ui/button";
import MainButton from "../MainButton";
import { CheckCircle } from "lucide-react";

const detailsSchema = z.object({
  subject: z.string().min(1, "الموضوع مطلوب"),
  content: z.string().min(10, "المحتوى يجب أن يكون 10 أحرف على الأقل"),
});

type DetailsFormData = z.infer<typeof detailsSchema>;

interface AbuseReportDetailsProps {
  onBack: () => void;
  reportType: string;
  closeModal: () => void;
}

const AbuseReportDetails: React.FC<AbuseReportDetailsProps> = ({ onBack, reportType, closeModal }) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const form = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      subject: "",
      content: "",
    },
  });

  const onSubmit = (data: DetailsFormData) => {
    console.log({ reportType, ...data });
    setIsSubmitted(true);
  };

  return isSubmitted ? (
    <div className="m-auto  lg:mt-10 mt-5 flex items-center justify-center text-center flex-col gap-4 self-center h-fit px-4">
      <CheckCircle className="w-20 h-20 text-green-500" /> {/* ✅ tick icon */}
      <h2 className="lg:text-3xl font-bold">شكرًا لك!</h2>
      <p className="text-gray-500 text-base font-[400]">
        تم إرسال طلبك وهو في الطريق. تحقق من بريدك الإلكتروني للحصول على التفاصيل.
      </p>
      <MainButton
        className="mt-4 !bg-gradient-to-r  from-[#5E8CBE] to-[#3B5D80]"
        text="استمرار"
        onClick={() => closeModal()}
      />{" "}
      {/* ✅ close modal */}
    </div>
  ) : (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="p-6 bg-white rounded-lg space-y-4 max-w-md w-full"
    >
      <div className="space-y-2 text-right">
        <h3 className=" lg:text-3xl font-bold">الإبلاغ عن إساءة</h3>
        <p className="text-gray-500 text-base font-[400]">ما الذي نقدر ان نساعدك بيه ؟</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormInput className=" !rounded-2xl" type="text" placeholder="اكتب هنا" label="الموضوع" name="subject" />
            <FormInput className=" !rounded-2xl" area placeholder="اكتب هنا" label="المحتوى/الفرع" name="content" />
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={onBack} variant="outline" className="flex-1 rounded-full">
              رجوع
            </Button>

            <MainButton className=" flex-1" text="إرسال" />
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default AbuseReportDetails;
