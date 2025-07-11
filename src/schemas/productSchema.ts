import { z } from "zod";

// --- UPDATED ZOD SCHEMA to match new UI ---
export const productSchema = z.object({
  productName: z.string().min(1, "اسم المنتج مطلوب"),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "يجب أن يكون السعر رقمًا" }).min(0.01, "السعر مطلوب").optional()
  ),
  categories: z.array(z.string()).min(1, "يجب اختيار فئة واحدة على الأقل"),
  productStatus: z.string().min(1, "حالة المنتج مطلوبة"),
  shortDescription: z.string().max(300, "الوصف الموجز يجب ألا يتجاوز 300 حرف").optional(),
  fullDescription: z.string().optional(),
  images: z
    .array(
      z.object({
        id: z.string(),
        file: z.instanceof(File),
        preview: z.string(),
        isPrimary: z.boolean(),
      })
    )
    .min(1, "يجب رفع صورة واحدة على الأقل"),

  // Kept from original schema for other steps
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل").optional(),
  sku: z.string().optional(),
});
