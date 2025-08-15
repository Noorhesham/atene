import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2, PhoneIcon } from "lucide-react";
import toast from "react-hot-toast";
import { FetchFunction } from "@/constants/api";

import FormInput from "@/components/inputs/FormInput";
import PhoneNumberInput from "@/components/inputs/PhoneNumberInput";
import AccordionStep from "@/components/AccordionStep";
import { TickGreen } from "@/components/icons";
import StoreContactInfo from "@/components/(dashboard)/Store/StoreContact";

interface Settings {
  name: string;
  logo?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  policy: string;
  terms: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
  android_link?: string;
  ios_link?: string;
  aboutUs: string;

  tiktok?: string;
  snapchat?: string;
  privacy: string;
}

const settingsSchema = z.object({
  name: z.string().min(2, "اسم الموقع مطلوب"),
  logo: z.any(),
  email: z.string().email("بريد إلكتروني غير صالح").or(z.literal("")),
  phone: z.string().or(z.literal("")),
  whatsapp: z.string().or(z.literal("")),
  facebook: z.string().url("رابط فيسبوك غير صالح").or(z.literal("")).optional(),
  twitter: z.string().url("رابط تويتر غير صالح").or(z.literal("")).optional(),
  youtube: z.string().url("رابط يوتيوب غير صالح").or(z.literal("")).optional(),
  instagram: z.string().url("رابط انستغرام غير صالح").or(z.literal("")).optional(),
  tiktok: z.string().url("رابط تيك توك غير صالح").or(z.literal("")).optional(),
  snapchat: z.string().url("رابط سناب شات غير صالح").or(z.literal("")).optional(),
  android_link: z.string().url("رابط تطبيق أندرويد غير صالح").or(z.literal("")).optional(),
  ios_link: z.string().url("رابط تطبيق آيفون غير صالح").or(z.literal("")).optional(),
  terms: z.string().min(10, "يجب أن يكون النص 10 أحرف على الأقل"),
  policy: z.string().min(10, "يجب أن يكون النص 10 أحرف على الأقل"),
  aboutUs: z.string().min(10, "يجب أن يكون النص 10 أحرف على الأقل"),
  privacy: z.string().min(10, "يجب أن يكون النص 10 أحرف على الأقل"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface StepConfig {
  id: number;
  title: string;
  component: React.ReactNode;
  fields: Array<keyof SettingsFormData>;
}

const useSettings = () => {
  const [data, setData] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await FetchFunction<{ data: Settings }>("https://aatene.com/api/admin/settings/get", "GET");
      setData(response.settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("فشل في تحميل الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (settingsData: Settings) => {
    try {
      setIsCreating(true);
      const response = await FetchFunction<{ data: Settings }>(
        "https://aatene.com/api/admin/settings",
        "POST",
        JSON.stringify(settingsData)
      );
      setData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    data,
    isLoading,
    isCreating,
    fetchSettings,
    updateSettings,
  };
};

export default function SettingsPage() {
  const { data: settingsData, isLoading, isCreating, fetchSettings, updateSettings } = useSettings();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      logo: "",
      email: "",
      phone: "",
      whatsapp: "",
      facebook: "",
      twitter: "",
      youtube: "",
      instagram: "",
      tiktok: "",
      snapchat: "",
      android_link: "",
      ios_link: "",
      terms: "",
      policy: "",
      aboutUs: "",

      privacy: "",
    },
    mode: "onChange",
  });

  const { formState } = form;
  console.log(formState.errors);
  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settingsData) {
      console.log(settingsData);
      const formData = {
        name: settingsData.name || "",
        logo: settingsData.logo || "",
        email: settingsData.email || "",
        phone: settingsData.phone || "",
        whatsapp: settingsData.whatsapp || "",
        facebook: settingsData.facebook || "",
        twitter: settingsData.twitter || "",
        youtube: settingsData.youtube || "",
        instagram: settingsData.instagram || "",
        tiktok: settingsData.tiktok || "",
        snapchat: settingsData.snapchat || "",
        android_link: settingsData.android_link || "",
        ios_link: settingsData.ios_link || "",
        terms: settingsData.terms || "",
        policy: settingsData.policy || "",
        aboutUs: settingsData.aboutUs || "",
        privacy: settingsData.privacy || "",
      };
      form.reset(formData);
    }
  }, [settingsData, isLoading]);

  const handleStepClick = async (stepId: number) => {
    // If trying to navigate to a step ahead of current step, validate current step first
    if (stepId > currentStep) {
      const stepFields = steps[currentStep - 1].fields;
      const isValid = await form.trigger(stepFields);

      if (!isValid) {
        const errorMessages = Object.values(form.formState.errors)
          .map((error) => error?.message)
          .filter(Boolean)
          .join("\n");
        toast.error(errorMessages || "يرجى تصحيح جميع الأخطاء قبل الانتقال للخطوة التالية");
        return;
      }
    }

    setCurrentStep(stepId);
  };

  const onSubmit = form.handleSubmit(async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        // Show all validation errors
        const allErrors = Object.values(form.formState.errors)
          .map((error) => error?.message)
          .filter(Boolean);

        if (allErrors.length > 0) {
          toast.error(allErrors.join("\n"));
        } else {
          toast.error("يرجى تصحيح جميع الأخطاء قبل الإرسال");
        }

        // Find the first step with an error and open it
        for (const step of steps) {
          const stepHasError = step.fields.some((field) => formState.errors[field as keyof typeof formState.errors]);
          if (stepHasError) {
            setCurrentStep(step.id);
            break;
          }
        }
        return;
      }

      console.log("Submitting settings data:", data);
      await updateSettings(data);
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const steps: StepConfig[] = [
    {
      id: 1,
      title: "البيانات الأساسية",
      component: (
        <div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
            <div className="flex  flex-col items-end">
              <FormInput name="name" label="اسم الموقع" placeholder="اسم الموقع" />
              <span className="text-xs w-fit  mr-auto text-[#686869]">{form.getValues("name")?.length || 0} / 20</span>
            </div>
            <FormInput name="logo" label="شعار الموقع" photo placeholder="شعار الموقع" optional />

            <FormInput name="email" label="البريد الإلكتروني" placeholder="email@example.com" optional />
            <div className=" grid  grid-cols-2 gap-x-8 gap-y-4">
              {" "}
              <PhoneNumberInput name="phone" label="رقم الهاتف" icon={<PhoneIcon />} />
              <FormInput name="whatsapp" label="رقم الواتساب" placeholder="0123456789" optional />
            </div>
          </div>
        </div>
      ),
      fields: ["name", "email", "phone", "whatsapp", "logo"],
    },
    {
      id: 2,
      title: "وسائل التواصل الاجتماعي",
      component: <StoreContactInfo />,
      fields: ["facebook", "instagram", "tiktok", "snapchat", "twitter", "youtube", "android_link", "ios_link"],
    },
    {
      id: 3,
      title: "محتوى الموقع",
      component: (
        <div>
          <div className="space-y-6">
            <FormInput area name="aboutUs" label="معلومات عنا" />
            <FormInput area name="terms" label="الشروط والأحكام" />
            <FormInput area name="policy" label="سياسة الخصوصية" />
            <FormInput area name="privacy" label="سياسة الخصوصية" />
          </div>
        </div>
      ),
      fields: ["aboutUs", "terms", "policy", "privacy"],
    },
  ];

  return (
    <div className=" w-full  min-h-screen" dir="rtl">
      <header className=" sm:px-8 sm:py-8 pb-0">
        <h1 className="text-2xl font-bold text-gray-900">إعدادات الحساب</h1>
      </header>

      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-8 p-4 sm:p-8">
          {/* Progress Steps */}

          {/* Form Steps */}
          <div className="space-y-4">
            {steps.map((step) => {
              // Check if this step has any validation errors
              const stepHasError = step.fields.some(
                (field) => formState.errors[field as keyof typeof formState.errors]
              );

              return (
                <AccordionStep
                  icon={<TickGreen />}
                  key={step.id}
                  title={step.title}
                  isOpen={currentStep === step.id}
                  onToggle={() => handleStepClick(step.id)}
                  isCompleted={currentStep > step.id}
                  hasErrors={stepHasError}
                >
                  {step.component}
                </AccordionStep>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end"></div>
        </form>{" "}
        <Button
          onClick={() => {
            onSubmit();
          }}
          className="w-fit bg-main mr-10 mb-10"
          type="submit"
          disabled={isSubmitting || isCreating}
        >
          {isSubmitting || isCreating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          حفظ التعديلات
        </Button>
      </FormProvider>
    </div>
  );
}
