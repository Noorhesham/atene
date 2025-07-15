import { z } from "zod";


export const storeSchema = z.object({
  // Step 1
  storeName: z.string().min(1, "اسم المتجر مطلوب"),
  storeIdentity: z.object({
    logo: z.any().optional(),
    cover: z.any().optional(),
  }),
  storeDescription: z.string().min(10, "وصف المتجر يجب أن يكون 10 أحرف على الأقل"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  address: z.string().min(1, "العنوان مطلوب"),
  currency: z.string().min(1, "العملة مطلوبة"),
  owner: z.string().min(1, "المالك مطلوب"),
  hasDelivery: z.boolean().default(true),
  type: z.string().min(1, "النوع مطلوب"),
  mainCategory: z.string().min(1, "القسم الرئيسي مطلوب"),
  subCategory: z.string().min(1, "القسم الفرعي مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  neighborhood: z.string().min(1, "الحي مطلوب"),

  // Step 2
  mobile: z.string().refine((val) => val.length === 11, { message: "رقم الهاتف غير صالح" }).optional().or(z.literal("")),
  whatsapp: z.string().refine((val) => val.length === 11, { message: "رقم الواتساب غير صالح" }).optional().or(z.literal("")),
  facebook: z.string().url("رابط فيسبوك غير صالح").optional().or(z.literal("")),
  tiktok: z.string().url("رابط تيك توك غير صالح").optional().or(z.literal("")),
  youtube: z.string().url("رابط يوتيوب غير صالح").optional().or(z.literal("")),
  instagram: z.string().url("رابط انستغرام غير صالح").optional().or(z.literal("")),
});
