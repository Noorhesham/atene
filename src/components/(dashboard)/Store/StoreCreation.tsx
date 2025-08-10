"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { storeSchema } from "./schema";
import StoreBasicInfo from "./StoreBasicInfo";
import StoreEmployeeManagement from "./StoreEmployeeManagement";
import StoreWorkingHours from "./StoreWorkingHours";
import StorePreview from "./StorePreview";
import StoreProgressSteps from "./StoreProgressSteps";
import StoreContactInfo from "./StoreContact";
import StoreSpecifications from "./StoreSpecifications";
import { ApiStore } from "@/types";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { useAuth } from "@/context/AuthContext";

type StoreFormData = z.infer<typeof storeSchema>;

interface StoreCreationFormProps {
  store?: ApiStore | null;
}

// Accordion Step Component (same as ProductCreationForm)
const AccordionStep = ({
  title,
  isOpen,
  onToggle,
  children,
  isCompleted,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isCompleted: boolean;
}) => (
  <div
    className={`border rounded-lg bg-white transition-all duration-300 ${
      isOpen ? "border-blue-500 shadow-md" : "border-gray-200"
    }`}
  >
    <button type="button" onClick={onToggle} className="w-full flex justify-between items-center p-4 text-right">
      <h3 className={`text-lg font-bold ${isCompleted && !isOpen ? "text-gray-900" : "text-gray-600"}`}>{title}</h3>
      {isOpen ? <MinusCircle className="w-6 h-6 text-gray-500" /> : <PlusCircle className="w-6 h-6 text-gray-500" />}
    </button>
    {isOpen && <div className="p-6 border-t border-gray-200">{children}</div>}
  </div>
);

const StoreCreationForm: React.FC<StoreCreationFormProps> = ({ store }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!store;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  // Use the create method from the hook
  const { create: createStore, update: updateStore } = useAdminEntityQuery("stores", {
    initialPage: 1,
    initialPerPage: 10,
  });

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      owner_id: user?.user?.id.toString() || "",
      name: "",
      logo: null,
      cover: [],
      mainCover: "",
      description: "",
      email: "",
      address: "",
      lng: "",
      lat: "",
      currency_id: "1", // Default currency ID
      phone: "",
      whats_app: null,
      facebook: null,
      tiktok: null,
      youtube: null,
      instagram: null,
      twitter: null,
      linkedin: null,
      pinterest: null,
      open_status: "open_with_working_times",
      workingtimes: [],
      managers: [],
      specifications: [],
    },
    mode: "onChange",
  });
  console.log(store);
  // Populate form with store data when in edit mode
  useEffect(() => {
    if (store) {
      form.reset({
        owner_id: store.owner_id.toString() || "",
        name: store.name || "",
        logo: store.logo || null,
        cover: store.cover || [],
        mainCover: store.cover?.[0] || "",
        description: store.description || "",
        email: store.email || "",
        address: store.address || "",
        lng: store.lng?.toString() || "",
        lat: store.lat?.toString() || "",

        currency_id: store.currency_id.toString() || "1",
        phone: store.phone || "",
        whats_app: store.whats_app || null,
        facebook: store.facebook || null,
        tiktok: store.tiktok || null,
        youtube: store.youtube || null,
        instagram: store.instagram || null,
        twitter: store.twitter || null,
        linkedin: store.linkedin || null,
        pinterest: store.pinterest || null,
        open_status:
          (store.open_status as
            | "open_without_working_times"
            | "open_with_working_times"
            | "temporary_closed"
            | "closed") || "open_with_working_times",
        workingtimes: store.workingtimes || [],
        managers: store.managers.map((manager) => ({ ...manager, email: manager.user_email })) || [],
        specifications: store.specifications || [],
      });
    }
  }, [store, form]);
  const isAdmin = user?.user?.user_type === "admin";
  const steps = [
    {
      id: 1,
      title: "البيانات الأساسية",
      component: <StoreBasicInfo />,
      fields: [
        ...(isAdmin ? ["owner_id"] : []),
        "name",
        "logo",
        "cover",
        "description",
        "email",
        "address",
        "lng",
        "lat",

        "currency_id",
        "phone",
      ] as Array<keyof StoreFormData>,
    },
    {
      id: 2,
      title: "الاتصال والسوشيل",
      component: <StoreContactInfo />,
      fields: ["whats_app", "facebook", "tiktok", "youtube", "instagram", "twitter", "linkedin", "pinterest"] as Array<
        keyof StoreFormData
      >,
    },
    {
      id: 3,
      title: "فريق العمل",
      component: <StoreEmployeeManagement />,
      fields: ["managers"] as Array<keyof StoreFormData>,
    },
    {
      id: 4,
      title: "أوقات العمل و الطلبات",
      component: <StoreWorkingHours />,
      fields: ["open_status", "workingtimes"] as Array<keyof StoreFormData>,
    },
    {
      id: 5,
      title: "مواصفات المتجر",
      component: <StoreSpecifications />,
      fields: ["specifications"] as Array<keyof StoreFormData>,
    },
  ] as const;

  console.log(form.formState.errors);

  const nextStep = async () => {
    const stepFields = steps[currentStep - 1].fields as (keyof StoreFormData)[];
    const isValid = await form.trigger(stepFields);

    if (!isValid) {
      const stepErrors = stepFields.filter((field) => form.formState.errors[field]);
      if (stepErrors.length > 0) {
        toast.error(`يرجى إكمال جميع الحقول المطلوبة في هذه الخطوة`);
      } else {
        toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
      }
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Store Data to submit:", data);

      // Prepare the data for API submission using the provided structure
      const apiData = {
        ...(isAdmin ? { owner_id: parseInt(data.owner_id as string) } : {}),
        name: data.name,
        logo: data.logo,
        cover: data.cover,
        description: data.description,
        address: data.address,
        lng: data.lng ? parseFloat(data.lng) : null,
        lat: data.lat ? parseFloat(data.lat) : null,
        email: data.email,
        currency_id: parseInt(data.currency_id as string),
        phone: data.phone,
        whats_app: data.whats_app || null,
        tiktok: data.tiktok || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        twitter: data.twitter || null,
        youtube: data.youtube || null,
        linkedin: data.linkedin || null,
        pinterest: data.pinterest || null,
        open_status: data.open_status,
        workingtimes: data.workingtimes.map((wt) => ({
          day: wt.day,
          from: wt.from,
          to: wt.to,
          open_always: wt.open_always,
          closed_always: wt.closed_always,
        })),
        managers: data.managers.map((manager) => ({
          title: manager.title,
          status: manager.status,
          email: manager.email,
        })),
        specifications: data.specifications.map((spec) => ({
          icon: spec.icon,
          title: spec.title,
        })),
      };

      if (isEditMode && store) {
        await updateStore(store.id, apiData);
      } else {
        await createStore(apiData);
      }

      // Invalidate stores cache to refresh the data
      await queryClient.invalidateQueries({
        queryKey: ["admin", "stores"],
      });

      // Navigate back to stores management page
      if (user?.user?.user_type === "admin") {
        navigate("/admin/stores");
      } else {
        navigate("/dashboard/stores");
      }
    } catch (error) {
      console.error("Error submitting store:", error);
      if (isEditMode) {
        toast.error("حدث خطأ أثناء تحديث المتجر");
      } else {
        toast.error("حدث خطأ أثناء إنشاء المتجر");
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <section className="w-full ">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
          <div className="mx-auto w-full p-4 sm:p-6 lg:p-8 min-h-screen" dir="rtl">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>المتاجر</span>
                  <span>/</span>
                  <span className="text-gray-900">{isEditMode ? "تعديل المتجر" : "إنشاء متجر جديد"}</span>
                </div>
              </div>
              <StoreProgressSteps
                steps={steps}
                currentStep={currentStep}
                onStepClick={(clickStep) => setCurrentStep(clickStep)}
              />
            </div>

            <div className="flex items-center justify-between mt-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                {isEditMode ? "تعديل المتجر" : "إنشاء متجر جديد"}
              </h1>
              <Button type="submit" className="bg-main text-white hover:bg-main/90 px-6" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "جاري التحديث..."
                    : "جاري الحفظ..."
                  : isEditMode
                  ? "تحديث المتجر"
                  : "حفظ المتجر"}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
              {/* Form Accordion Column */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {steps.map((step) => (
                    <AccordionStep
                      key={step.id}
                      title={step.title}
                      isOpen={currentStep === step.id}
                      onToggle={() => setCurrentStep(step.id)}
                      isCompleted={currentStep > step.id}
                    >
                      {step.component}
                    </AccordionStep>
                  ))}
                </div>
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-1 lg:sticky top-6">
                <StorePreview />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 py-4 px-8 shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between max-w-[1440px] mx-auto">
              {/* <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="bg-white text-gray-700"
                >
                  السابق
                </Button>
                {currentStep < steps.length && (
                  <Button type="button" onClick={nextStep} className="bg-main text-white hover:bg-main/90">
                    التالي
                  </Button>
                )}
              </div> */}
              <div className="flex w-full justify-between items-center gap-3">
                <Button
                  type="submit"
                  className="bg-main text-white hover:bg-main/90"
                  disabled={isSubmitting}
                  onClick={() => {
                    currentStep === steps.length ? handleSubmit() : nextStep();
                  }}
                >
                  {isSubmitting
                    ? isEditMode
                      ? "جاري التحديث..."
                      : "جاري الحفظ..."
                    : isEditMode
                    ? "تحديث المتجر"
                    : "إنشاء المتجر"}
                </Button>{" "}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(user?.user?.user_type === "merchant" ? "/dashboard/stores" : "/admin/stores");
                  }}
                  type="button"
                  variant="outline"
                  className="w-fit  py-4 font-semibold px-8 bg-[#F9FAFB] text-black bg-white"
                >
                  الغاء
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
