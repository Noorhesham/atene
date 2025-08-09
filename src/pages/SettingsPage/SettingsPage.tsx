import { z } from "zod";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PhoneIcon } from "lucide-react";

import FormInput from "@/components/inputs/FormInput";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import PhoneNumberInput from "@/components/inputs/PhoneNumberInput";

interface Settings {
  name: string;
  logo: string;
  email: string;
  phone: string;
  whatsapp: string;
  policy: string;
  terms: string;
  facebook: string;
  twitter: string;
  youtube: string;
  instagram: string;
  android_link: string;
  ios_link: string;
}

const settingsSchema = z.object({
  name: z.string().min(2, "اسم الموقع مطلوب"),
  logo: z.any().optional(),
  email: z.string().email("بريد إلكتروني غير صالح").optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),

  facebook: z.string().url("رابط فيسبوك غير صالح").or(z.literal("")).optional(),
  twitter: z.string().url("رابط تويتر غير صالح").or(z.literal("")).optional(),
  youtube: z.string().url("رابط يوتيوب غير صالح").or(z.literal("")).optional(),
  instagram: z.string().url("رابط انستغرام غير صالح").or(z.literal("")).optional(),

  android_link: z.string().url("رابط تطبيق أندرويد غير صالح").or(z.literal("")).optional(),
  ios_link: z.string().url("رابط تطبيق آيفون غير صالح").or(z.literal("")).optional(),

  terms: z.string().min(10, "يجب أن يكون النص 10 أحرف على الأقل"),
  policy: z.string().min(10, "يجب أن يكون النص 10 أحرف على الأقل"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { data: settingsData, isLoading } = useAdminEntityQuery("settings");
  const { create: updateSettings, isCreating } = useAdminEntityQuery("settings-update");

  const form = useForm<Settings>({
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
      android_link: "",
      ios_link: "",
      terms: "",
      policy: "",
    },
  });

  useEffect(() => {
    console.log(settingsData.data);
    form.reset(settingsData.data);
  }, [settingsData, form]);

  const onSubmit = (data: SettingsFormData) => {
    console.log("Submitting settings data:", data);
    updateSettings(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  console.log(form.formState.errors);
  return (
    <div className="p-4 sm:p-8 w-full bg-gray-100 min-h-screen" dir="rtl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إعدادات الحساب</h1>
      </header>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>بيانات اساسية</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <FormInput name="storeName" label="اسم الموقع" placeholder="T-Shirt" />
                <FormInput name="email" label="البريد الإلكتروني" placeholder="email@example.com" optional />
                <PhoneNumberInput name="phone" label="رقم الهاتف" icon={<PhoneIcon />} />
                <FormInput name="whatsapp" label="رقم الواتساب" placeholder="0123456789" optional />

                <FormInput name="logo" label="شعار الموقع" photo placeholder="شعار الموقع" optional />
                <FormInput name="cover" label="غلاف الموقع" photo placeholder="غلاف الموقع" optional />
              </div>
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <Card>
            <CardHeader>بيانات التواصل (سوشيال ميديا)</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <FormInput name="facebook" label="فيسبوك" placeholder="https://facebook.com/username" optional />
                <FormInput name="instagram" label="انستغرام" placeholder="https://instagram.com/username" optional />
                <FormInput name="tiktok" label="تيك توك" placeholder="https://tiktok.com/@username" optional />
                <FormInput name="snapchat" label="سناب شات" placeholder="https://snapchat.com/add/username" optional />
                <FormInput name="twitter" label="تويتر" placeholder="https://twitter.com/username" optional />
                <FormInput name="youtube" label="يوتيوب" placeholder="https://youtube.com/username" optional />
                <FormInput
                  name="android_link"
                  label="رابط تطبيق أندرويد"
                  placeholder="https://play.google.com/app"
                  optional
                />
                <FormInput name="ios_link" label="رابط تطبيق آيفون" placeholder="https://apps.apple.com/app" optional />
              </div>
            </CardContent>
          </Card>

          {/* Site Content Card */}
          <Card>
            <CardHeader>محتوى الموقع</CardHeader>
            <CardContent>
              <div className="space-y-6">
                <FormInput name="aboutUs" label="معلومات عنا" />
                <FormInput name="terms" label="الشروط والأحكام" />
                <FormInput name="privacy" label="سياسة الخصوصية" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Loader2 className="w-5 h-5 animate-spin" />}
                حفظ التعديلات
              </Button>
            </CardFooter>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}
