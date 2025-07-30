import { z } from "zod";

const workingTimeSchema = z.object({
  id: z.any().optional(),
  day: z.string(),
  from: z.string(),
  to: z.string(),
  open_always: z.boolean(),
  closed_always: z.boolean(),
});

const managerSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  status: z.string(),
  email: z.string().email(),
});

const specificationSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  icon: z.string(),
});

export const storeSchema = z.object({
  // Basic Info
  name: z.string().min(1, "اسم المتجر مطلوب"),
  logo: z.string().optional().nullable(),
  cover: z.string().optional().nullable(),
  description: z.string().min(10, "وصف المتجر يجب أن يكون 10 أحرف على الأقل"),
  address: z.string().min(1, "العنوان مطلوب"),
  lng: z.string().optional(),
  lat: z.string().optional(),
  email: z.string().email("بريد إلكتروني غير صالح"),
  owner_id: z.string(),
  currency_id: z.string(),
  phone: z.string().min(11, "رقم الهاتف غير صالح"),

  // Contact & Social
  whats_app: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  youtube: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  pinterest: z.string().optional().nullable(),

  // Store settings
  open_status: z.enum([
    "open_always",
    "open_with_working_times",
    "closed_always",
    "temporarily_closed",
    "permanently_closed",
  ]),

  // Arrays
  workingtimes: z.array(workingTimeSchema),
  managers: z.array(managerSchema),
  specifications: z.array(specificationSchema).min(1, "يجب إضافة مواصفة واحدة على الأقل"),
});
