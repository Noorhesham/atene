"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, MinusCircle, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ApiProduct, useAdminEntity } from "@/hooks/useUsers";

// Import step components
import BasicInformation from "./steps/BasicInformation";
import ProductDetails from "./steps/ProductDetails";
import VariantsForm from "./steps/PricingInventory";
import RelatedProducts from "./steps/AdvancedSettings";
import ProductPreview from "./steps/ProductPreview";
import ProgressSteps from "./steps/ProgressSteps";
import UpSell from "./steps/UpSell";

type VariantType = {
  color?: string;
  size?: string;
  price: string;
  images: string[];
  isActive: boolean;
};

type UpSellProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
};

type ProductSpecification = {
  icon: string;
  title: string;
};

const variantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  price: z.string().min(1, "يرجى إدخال السعر"),
  images: z.array(z.string()).min(1, "يرجى إضافة صورة واحدة على الأقل للمنتج المتغير"),
  isActive: z.boolean(),
});

const productFormSchema = z.object({
  // First form fields
  productName: z.string().min(3, "اسم المنتج يجب أن يكون 3 أحرف على الأقل"),
  price: z.union([z.string().min(1, "السعر يجب أن يكون أكبر من 0"), z.number().min(1, "السعر يجب أن يكون أكبر من 0")]),
  categories: z.array(z.string()).min(1, "يجب اختيار فئة واحدة على الأقل"),
  productStatus: z.enum(["new", "used", "refurbished"], {
    errorMap: () => ({ message: "يرجى اختيار حالة صحيحة للمنتج" }),
  }),
  shortDescription: z.string().min(10, "الوصف الموجز يجب أن يكون 10 أحرف على الأقل"),
  fullDescription: z.string().min(20, "الوصف الكامل يجب أن يكون 20 حرف على الأقل"),
  cover: z.string().min(1, "صورة الغلاف مطلوبة"),
  images: z.array(z.string()).min(1, "يجب إضافة صورة واحدة على الأقل"),

  // Second form fields with clearer messages
  storeVisibility: z.string().min(1, "يرجى اختيار المتجر الذي سيتم عرض المنتج فيه"),
  keywords: z.array(z.object({ value: z.string() })).optional(),
  productAttributes: z
    .array(
      z.object({
        icon: z.string().min(1, "يرجى اختيار أيقونة للصفة"),
        title: z.string().min(1, "يرجى إدخال عنوان للصفة"),
      })
    )
    .optional(),
  hasDelivery: z.boolean(),
  productType: z.string().min(1, "يرجى اختيار نوع المنتج من القائمة"),
  mainCategory: z.string().min(1, "يرجى اختيار القسم الرئيسي للمنتج"),
  subCategory: z.string().min(1, "يرجى اختيار القسم الفرعي المناسب للمنتج"),
  city: z.string().min(1, "يرجى اختيار المدينة التي يتوفر فيها المنتج"),
  neighborhood: z.string().min(1, "يرجى تحديد الحي أو المنطقة لتسهيل عملية التوصيل"),

  // Third form fields - Variants
  hasVariations: z.boolean(),
  variantAttributes: z.array(z.string()).optional(),
  variants: z
    .array(variantSchema)
    .optional()
    .superRefine((variants, ctx) => {
      interface FormData {
        hasVariations: boolean;
        variantAttributes: string[] | undefined;
      }

      const formData: FormData = {
        hasVariations:
          (ctx as z.RefinementCtx & { _parent?: { data?: { hasVariations: boolean } } })._parent?.data?.hasVariations ??
          false,
        variantAttributes: (ctx as z.RefinementCtx & { _parent?: { data?: { variantAttributes: string[] } } })._parent
          ?.data?.variantAttributes,
      };

      if (formData.hasVariations) {
        if (!variants || variants.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "يجب إضافة منتج متغير واحد على الأقل",
          });
          return false;
        }

        let isValid = true;
        variants.forEach((variant, index: number) => {
          (formData.variantAttributes || []).forEach((attr: string) => {
            if (attr === "color" && !variant.color) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "يرجى إدخال اللون",
                path: [index, "color"],
              });
              isValid = false;
            }
            if (attr === "size" && !variant.size) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "يرجى إدخال المقاس",
                path: [index, "size"],
              });
              isValid = false;
            }
          });
        });
        return isValid;
      }
      return true;
    }),

  // Fourth form fields
  relatedProducts: z.array(z.string()).optional(),

  // Fifth form fields - Upsell
  upsellProducts: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        price: z.number(),
        image: z.string(),
        stock: z.number(),
      })
    )
    .optional(),
  upsellDiscountPrice: z.number().optional(),
  upsellDiscountEndDate: z.string().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface StepConfig {
  id: number;
  title: string;
  component: React.ReactNode;
  fields: Array<keyof ProductFormData>;
}

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

const ProductCreationForm = ({
  product,
  disableCreate,
}: {
  product: ApiProduct | null | undefined;
  disableCreate: boolean;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!product;

  // Use the create/update methods from the hook
  const { create: createProduct, update: updateProduct } = useAdminEntity("products");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      price: "",
      categories: [],
      productStatus: "new",
      shortDescription: "",
      fullDescription: "",
      cover: "",
      images: [],
      // Second form default values
      storeVisibility: "",
      keywords: [],
      productAttributes: [],
      hasDelivery: false,
      productType: "",
      mainCategory: "",
      subCategory: "",
      city: "",
      neighborhood: "",
      // Third form default values
      hasVariations: false,
      variantAttributes: [],
      variants: [],
      // Fourth form default values
      relatedProducts: [],

      // Fifth form default values
      upsellProducts: [],
      upsellDiscountPrice: undefined,
      upsellDiscountEndDate: undefined,
    },
    mode: "onChange",
  });

  const { formState } = form;

  // Populate form with existing product data in edit mode
  useEffect(() => {
    if (product) {
      form.reset({
        productName: product.name || "",
        price: product.price?.toString() || "",
        categories: product.category_id ? [product.category_id.toString()] : [],
        productStatus: (product.condition as "new" | "used" | "refurbished") || "new",
        shortDescription: product.short_description || "",
        fullDescription: product.description || "",
        cover: product.cover || "",
        images: product.gallary || [],
        storeVisibility: product.store_id?.toString() || "",
        keywords: product.tags?.map((tag: { value: string }) => ({ value: tag.value })) || [],
        productAttributes: product.specifications || [],
        hasDelivery: false,
        productType: product.type || "",
        mainCategory: product.category_id?.toString() || "",
        subCategory: product.section_id?.toString() || "",
        city: "",
        neighborhood: "",
        hasVariations: product.type === "variation",
        variantAttributes: [],
        variants: [],
        relatedProducts: [],
        upsellProducts: product.upSells || [],
        upsellDiscountPrice: product.cross_sells_price,
        upsellDiscountEndDate: undefined,
      });
    }
  }, [isEditMode, product, form]);

  const steps: StepConfig[] = [
    {
      id: 1,
      title: "المعلومات الأساسية",
      component: <BasicInformation />,
      fields: [
        "productName",
        "price",
        "categories",
        "productStatus",
        "shortDescription",
        "fullDescription",
        "cover",
        "images",
      ],
    },
    {
      id: 2,
      title: "تفاصيل المنتج",
      component: <ProductDetails />,
      fields: [
        "storeVisibility",
        "keywords",
        "productAttributes",
        "hasDelivery",
        "productType",
        "mainCategory",
        "subCategory",
        "city",
        "neighborhood",
      ],
    },
    {
      id: 3,
      title: "الاختلافات و الكميات",
      component: <VariantsForm />,
      fields: ["hasVariations", "variantAttributes", "variants"],
    },
    {
      id: 4,
      title: "منتجات مرتبطة",
      component: <RelatedProducts />,
      fields: ["relatedProducts"],
    },
    {
      id: 5,
      title: "منتجات مكملة",
      component: <UpSell />,
      fields: ["upsellProducts", "upsellDiscountPrice", "upsellDiscountEndDate"],
    },
  ];

  const nextStep = async () => {
    const stepFields = steps[currentStep - 1].fields;
    const isValid = await form.trigger(stepFields);

    if (!isValid) {
      const errorMessages = Object.values(form.formState.errors)
        .map((error) => error?.message)
        .filter(Boolean)
        .join("\n");
      console.log(form.formState.errors);
      toast.error(errorMessages || "يرجى تصحيح جميع الأخطاء قبل الانتقال للخطوة التالية");
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
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("يرجى تصحيح جميع الأخطاء قبل الإرسال");
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

      // Prepare API payload matching the skeleton structure
      const productData = product as ApiProduct & {
        sku?: string;
        review_rate?: number;
        review_count?: number;
      };

      const apiPayload = {
        sku: isEditMode ? productData?.sku : `SKU${Date.now()}`, // Generate SKU for new products
        name: data.productName,
        short_description: data.shortDescription,
        description: data.fullDescription,
        cover: data.cover || "", // Cover image
        gallary: data.images, // All images as gallery (now just filenames)
        type: data.hasVariations ? ("variation" as const) : ("simple" as const),
        condition: data.productStatus,
        category_id: parseInt(data.categories[0]) || 1,
        section_id: parseInt(data.subCategory) || 1,
        review_rate: isEditMode ? productData?.review_rate || 0 : 0,
        review_count: isEditMode ? productData?.review_count || 0 : 0,
        price: parseFloat(data.price.toString()),
        cross_sells_price: data.upsellDiscountPrice || 0,
        crossSells: [], // TODO: Map from crossSells data
        upSells:
          data.upsellProducts?.map((up: UpSellProduct) => ({
            id: up.id,
            name: up.name,
            price: up.price,
            image: up.image,
          })) || [],
        tags: data.keywords?.map((k: { value: string }) => k.value) || [],
        specifications:
          data.productAttributes?.map((attr: ProductSpecification) => ({
            icon: attr.icon,
            title: attr.title,
          })) || [],
        variations: data.hasVariations
          ? data.variants?.map((variant: VariantType, index: number) => ({
              id: index + 1,
              price: parseFloat(variant.price),
              image: variant.images[0] || "",
              attributeOptions: [
                // TODO: Map attribute options based on variant attributes
              ],
            })) || []
          : [],
      };

      console.log("API Payload:", apiPayload);

      // Submit to API
      if (isEditMode) {
        await updateProduct(parseInt(id as string), apiPayload);
        toast.success("تم تحديث المنتج بنجاح!");
      } else {
        await createProduct(apiPayload);
        toast.success("تم إنشاء المنتج بنجاح!");
      }

      // Invalidate cache and navigate
      await queryClient.invalidateQueries({
        queryKey: ["admin", "products"],
      });
      navigate("/admin/products");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(isEditMode ? "حدث خطأ أثناء تحديث المنتج" : "حدث خطأ أثناء إنشاء المنتج");
    } finally {
      setIsSubmitting(false);
    }
  });
  console.log(form.formState.errors);
  return (
    <section className="w-full">
      {" "}
      <div className="mx-auto w-full p-4 sm:p-6 lg:p-8  min-h-screen" dir="rtl">
        {!disableCreate ? (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>المنتجات</span>
                <span>/</span>
                <span className="text-gray-900">{isEditMode ? "تعديل المنتج" : "إنشاء منتج جديد"}</span>
              </div>
            </div>
            <ProgressSteps steps={steps} currentStep={currentStep} />
          </div>
        ) : null}
        <FormProvider {...form}>
          <form onSubmit={handleSubmit}>
            {" "}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                {isEditMode ? "تعديل المنتج" : "إنشاء منتج جديد"}
              </h1>
              {!disableCreate && (
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 px-6" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الحفظ..." : isEditMode ? "تحديث المنتج" : "حفظ المنتج"}
                </Button>
              )}
            </div>
            <div
              className={`grid grid-cols-1 ${
                disableCreate ? "lg:grid-cols-1" : "lg:grid-cols-3"
              } gap-6 items-start mt-8`}
            >
              {" "}
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
              {!disableCreate && (
                <div className="lg:col-span-1 lg:sticky top-6">
                  <ProductPreview />
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
      {!disableCreate && (
        <div className="sticky bottom-0 w-full bg-white border-t border-[#E7EAEE] py-4 px-6 shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between max-w-[1440px] mx-auto">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-white border-[#E7EAEE] text-[#101828] h-11 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" /> السابق
              </Button>
              {currentStep < steps.length && (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-[#2E5DB0] hover:bg-[#264B8B] text-white h-11 px-4 py-2.5 text-sm font-medium"
                >
                  التالي <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 bg-white border-[#E7EAEE] text-[#101828] h-11 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                حفظ كمسودة
              </Button>
              <Button
                type="submit"
                className="bg-[#2E5DB0] hover:bg-[#264B8B] text-white h-11 px-4 py-2.5 text-sm font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري الحفظ..." : isEditMode ? "تحديث المنتج" : "إنشاء المنتج"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductCreationForm;
