"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { storeSchema } from "./schema";
import StoreBasicInfo from "./StoreBasicInfo";
import { StoreOrdersConfig } from "./steps";
import { StoreTeam } from "./steps";
import StorePreview from "./StorePreview";
import StoreProgressSteps from "./StoreProgressSteps";
import StoreContactInfo from "./StoreContact";

type StoreFormData = z.infer<typeof storeSchema>;

const StoreCreationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: "",
      storeIdentity: { logo: null, cover: null },
      storeDescription: "",
      email: "",
      address: "",
      currency: "SAR",
      owner: "kyras adel",
      hasDelivery: true,
      type: "",
      mainCategory: "",
      subCategory: "",
      city: "",
      neighborhood: "",
      mobile: "",
      whatsapp: "",
      facebook: "",
      tiktok: "",
      youtube: "",
      instagram: "",
    },
    mode: "onChange",
  });

  const steps = [
    {
      id: 1,
      title: "البيانات الأساسية",
      component: <StoreBasicInfo />,
      fields: [
        "storeName",
        "storeIdentity",
        "storeDescription",
        "email",
        "address",
        "currency",
        "owner",
        "hasDelivery",
        "type",
        "mainCategory",
        "subCategory",
        "city",
        "neighborhood",
      ] as const,
    },

    {
      id: 2,
      title: "الاتصال والسوشيل",
      component: <StoreContactInfo />,
      fields: ["mobile", "whatsapp", "facebook", "tiktok", "youtube", "instagram"] as const,
    },
    { id: 3, title: "أوقات العمل و الطلبات", component: <StoreOrdersConfig />, fields: [] as const },
    { id: 4, title: "فريق العمل", component: <StoreTeam />, fields: [] as const },
    { id: 5, title: "الاتصال والسوشيل", component: <StoreContactInfo />, fields: [] as const },
  ] as const;
  console.log(form.formState.errors);

  const nextStep = async () => {
    const stepFields = steps[currentStep - 1].fields;
    const isValid = await form.trigger(stepFields);

    if (!isValid) {
      toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Store Data:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("تم إنشاء المتجر بنجاح!");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إنشاء المتجر");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <section className="w-full bg-white">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
          <div className="mx-auto w-full p-4 sm:p-6 lg:p-8 min-h-screen" dir="rtl">
            <div className="flex flex-col gap-8">
              <h1 className="text-2xl font-semibold text-gray-900">إدارة المتجر</h1>
              <StoreProgressSteps
                steps={steps}
                currentStep={currentStep}
                onStepClick={(clickStep) => {
                  if (clickStep === currentStep) {
                    return;
                  } else if (clickStep === currentStep + 1) {
                    nextStep();
                  } else if (clickStep === currentStep - 1) {
                    prevStep();
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
              <div className="lg:col-span-1 lg:sticky top-6">
                <StorePreview />
              </div>
              <div className="lg:col-span-2">{steps[currentStep - 1].component}</div>
            </div>
          </div>
          <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 py-4 px-8 shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between  max-w-[1440px] mx-auto">
              <div className="flex items-center w-full  justify-between gap-3">
                <Button type="submit" className="bg-main text-white hover:bg-main/90 px-6" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الحفظ..." : "حفظ المتجر"}
                </Button>
                <Button type="button" variant="outline" className="bg-gray-100 text-gray-800">
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default StoreCreationForm;
