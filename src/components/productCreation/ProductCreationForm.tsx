"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, MinusCircle, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ApiProduct } from "@/types";
import Loader from "@/components/Loader";
// Import step components
import BasicInformation from "./steps/BasicInformation";
import ProductDetails from "./steps/ProductDetails";
import VariantsForm from "./steps/PricingInventory";
import RelatedProducts from "./steps/AdvancedSettings";
import ProductPreview from "./steps/ProductPreview";
import ProgressSteps from "./steps/ProgressSteps";
import UpSell from "./steps/UpSell";
import { useAuth } from "@/context/AuthContext";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";

// Define variant type for dynamic attributes
type VariantData = {
  color?: string;
  size?: string;
  price: string;
  images: string[];
  isActive: boolean;
  [key: string]: string | boolean | string[] | undefined;
};

const variantSchema = z
  .object({
    color: z.string().optional(),
    size: z.string().optional(),
    price: z.string().min(1, "يرجى إدخال السعر"),
    images: z.array(z.string()).min(1, "يرجى إضافة صورة واحدة على الأقل للمنتج المتغير"),
    isActive: z.boolean(),
  })
  .passthrough(); // Allow additional properties for dynamic attributes

const productFormSchema = z.object({
  // First form fields
  productName: z.string().min(3, "اسم المنتج يجب أن يكون 3 أحرف على الأقل"),
  price: z.union([z.string().min(1, "السعر يجب أن يكون أكبر من 0"), z.number().min(1, "السعر يجب أن يكون أكبر من 0")]),
  section_id: z.string().min(1, "يجب اختيار قسم واحد على الأقل"),
  category_id: z.string().min(1, "يجب اختيار فئة واحدة على الأقل"),
  status: z
    .enum(["not_active", "active"], {
      errorMap: () => ({ message: "يرجى اختيار حالة صحيحة للمنتج" }),
    })
    .optional(), // Make status optional
  condition: z.enum(["new", "used", "refurbished"], {
    errorMap: () => ({ message: "يرجى اختيار حالة صحيحة للمنتج" }),
  }),
  shortDescription: z.string().min(10, "الوصف الموجز يجب أن يكون 10 أحرف على الأقل"),
  description: z.string().min(20, "الوصف الكامل يجب أن يكون 20 حرف على الأقل"),
  cover: z.string().min(1, "صورة الغلاف مطلوبة"),
  images: z.array(z.string()).min(1, "يجب إضافة صورة واحدة على الأقل"),

  // Second form fields with clearer messages
  storeVisibility: z.string().min(1, "يرجى اختيار المتجر الذي سيتم عرض المنتج فيه"),
  tags: z.array(z.object({ value: z.string() })).optional(),
  specifications: z
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
      // Get the parent form data using a type assertion
      const parentData = (ctx as { parent?: { hasVariations?: boolean; variantAttributes?: string[] } }).parent;
      const hasVariations = parentData?.hasVariations || false;
      const variantAttributes = parentData?.variantAttributes || [];

      if (hasVariations) {
        if (!variants || variants.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "يجب إضافة منتج متغير واحد على الأقل",
          });
          return false;
        }

        let isValid = true;
        variants.forEach((variant, index: number) => {
          variantAttributes.forEach((attr: string) => {
            const variantValue = (variant as VariantData)[attr];
            if (!variantValue) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `يرجى إدخال ${attr === "color" ? "اللون" : attr === "size" ? "المقاس" : attr}`,
                path: [index, attr],
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

  upSells: z.array(z.union([z.string(), z.number()])).optional(),
  upsellDiscountPrice: z.union([z.string(), z.number()]).optional(),
  upsellDiscountEndDate: z.union([z.string(), z.number()]).optional(),
  crossSells: z.array(z.union([z.string(), z.number()])).optional(),
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
  const location = useLocation();
  const queryClient = useQueryClient();
  const isEditMode = !!product;
  const { user, isLoading } = useAuth();

  // Get attributes data for mapping
  const { data: attributesData = [] } = useAdminEntityQuery("attributes");

  // Get section_id from search params
  const searchParams = new URLSearchParams(location.search);
  const sectionIdFromParams = searchParams.get("section_id");
  console.log(user);
  // Use the create/update methods from the hook
  const { create: createProduct, update: updateProduct } = useAdminEntityQuery("products");

  const isAdmin = user?.user?.user_type === "admin";
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      price: "",
      section_id: sectionIdFromParams || "",
      category_id: "",
      status: user?.user?.user_type === "admin" ? "active" : "not_active", // Set default status based on user type
      condition: "new",
      shortDescription: "",
      description: "",
      cover: "",
      images: [],
      // Second form default values
      storeVisibility: "",
      tags: [],
      specifications: [],
      hasDelivery: false,
      productType: "",
      mainCategory: "",

      city: "",
      neighborhood: "",
      // Third form default values
      hasVariations: false,
      variantAttributes: [],
      variants: [],

      upSells: [],
      upsellDiscountPrice: undefined,
      upsellDiscountEndDate: undefined,
      crossSells: [],
    },
    mode: "onChange",
  });

  const { formState } = form;

  // Populate form with existing product data in edit mode
  useEffect(() => {
    if (product) {
      console.log("Product data for form:", {
        upSells: product.upSells,
        crossSells: product.crossSells,
        upSellsType: typeof product.upSells,
        crossSellsType: typeof product.crossSells,
        variations: product.variations,
        variationsLength: product.variations?.length,
        firstVariation: product.variations?.[0],
        attributeOptions: product.variations?.[0]?.attributeOptions,
      });

      form.reset({
        productName: product.name || "",
        price: product.price?.toString() || "",
        section_id: product.section_id?.toString() || "",
        category_id: product.category.id ? product.category.id.toString() : "",
        condition: (product.condition as "new" | "used" | "refurbished") || "new",
        shortDescription: product.short_description || "",
        description: product.description || "",
        specifications: product.specifications || [],
        tags: product.tags?.map((tag: string) => ({ value: tag })) || [],
        cover: product.cover || "",
        images: product.gallary || [],
        storeVisibility: product.store_id?.toString() || "",
        hasDelivery: false,
        productType: product.type || "",
        subCategory: "",
        city: "",
        neighborhood: "",
        status: product.status === "active" ? "active" : "not_active",
        hasVariations: product.type === "variation",
        variantAttributes:
          product.variations?.length > 0
            ? product.variations[0]?.attributeOptions?.length > 0
              ? product.variations[0]?.attributeOptions?.map(
                  (option: { attribute_id: number; attribute?: { title: string } }) => option.attribute_id?.toString()
                ) || []
              : []
            : [],
        variants:
          product.variations?.map(
            (variation: {
              price?: number;
              image?: string;
              attributeOptions?: Array<{
                attribute_id: number;
                option_id: number;
                attribute?: { title: string };
                option?: { title: string };
              }>;
            }) => {
              const variant: { [key: string]: string | boolean | string[] } = {
                price: variation.price?.toString() || "",
                images: variation.image ? [variation.image] : [],
                isActive: true,
              };

              console.log("Processing variation for form:", {
                variation,
                attributeOptions: variation.attributeOptions,
              });

              // Map attribute options to variant fields using attribute_id as key
              variation.attributeOptions?.forEach((option) => {
                const attrId = option.attribute_id?.toString();
                if (attrId) {
                  variant[attrId] = option.option_id?.toString() || "";
                  console.log(`Mapped attribute ${attrId} to option ${option.option_id}`);
                }
              });

              console.log("Final variant object:", variant);
              return variant;
            }
          ) || [],
        upSells:
          product.upSells
            ?.map((item: string | number | { id: number } | null | undefined) => {
              if (typeof item === "object" && item && item.id) {
                return item.id;
              } else if (typeof item === "number") {
                return item;
              } else if (typeof item === "string") {
                return parseInt(item);
              }
              return null;
            })
            .filter((id): id is number => id !== null) || [],
        upsellDiscountPrice: product.cross_sells_price,
        upsellDiscountEndDate: undefined,
        crossSells:
          product.crossSells
            ?.map((item: string | number | { id: number } | null | undefined) => {
              if (typeof item === "object" && item && item.id) {
                return item.id;
              } else if (typeof item === "number") {
                return item;
              } else if (typeof item === "string") {
                return parseInt(item);
              }
              return null;
            })
            .filter((id): id is number => id !== null) || [],
      });
    }
  }, [isEditMode, product, form, sectionIdFromParams]);

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
        description: data.description,
        cover: data.cover?.startsWith("http") ? data.cover : `${data.cover || ""}`, // Cover image
        gallary: data.images || [], // All images as gallery
        type: data.hasVariations ? ("variation" as const) : ("simple" as const),
        condition: data.condition,
        category_id: data.category_id.toString(),
        section_id: parseInt(data.section_id) || 1,
        review_rate: isEditMode ? productData?.review_rate || 0 : 0,
        review_count: isEditMode ? productData?.review_count || 0 : 0,
        price: parseFloat(data.price.toString()),
        cross_sells_price: data.upsellDiscountPrice || 0,
        crossSells: data.crossSells || [],
        upSells: data.upSells || [],
        tags: data.tags?.map((k: { value: string }) => k.value) || [],
        specifications: data.specifications || [],
        ...(isAdmin && { status: data.status }), // Only include status for admin users
        variations: data.hasVariations
          ? data.variants?.map((variant: any, index: number) => {
              // Get the attributes data to map attribute names to IDs
              const variantAttributes = data.variantAttributes || [];

              console.log(`Processing variant ${index}:`, {
                variant,
                variantAttributes,
                attributesData,
              });

              // Construct attributeOptions array
              const attributeOptions = variantAttributes
                .map((attrId: string) => {
                  // Get the selected value for this attribute
                  const selectedValue = variant[attrId];

                  console.log(`Processing attribute ID ${attrId}:`, {
                    selectedValue,
                    attributeFound: attributesData.find(
                      (attr: { id: number; title: string }) => attr.id.toString() === attrId
                    ),
                  });

                  if (selectedValue) {
                    // Find the attribute by ID
                    const attribute = attributesData.find(
                      (attr: { id: number; title: string }) => attr.id.toString() === attrId
                    );

                    if (attribute) {
                      return {
                        optionable_id: index + 1, // Use variant index + 1 as optionable_id
                        option_id: parseInt(selectedValue as string),
                        attribute_id: attribute.id,
                      };
                    }
                  }
                  return null;
                })
                .filter(Boolean);

              console.log(`AttributeOptions for variant ${index}:`, attributeOptions);

              return {
                id: index + 1,
                price: parseFloat(variant.price),
                image: variant.images[0]?.startsWith("http") ? variant.images[0] : variant.images[0] || "",
                attributeOptions,
              };
            }) || []
          : [],
      };

      console.log("API Payload:", apiPayload);
      console.log("Variations with attributeOptions:", apiPayload.variations);
      console.log("Attributes data:", attributesData);

      // Submit to API
      if (isEditMode) {
        await updateProduct(parseInt(id as string), apiPayload as unknown as Partial<ApiProduct>);
      } else {
        await createProduct(apiPayload as unknown as Partial<ApiProduct>);
      }

      // Invalidate cache and navigate
      await queryClient.invalidateQueries({
        queryKey: [user?.user?.user_type === "merchant" ? "merchant" : "admin", "products"],
      });
      if (user?.user?.user_type === "merchant") {
        navigate("/dashboard/products");
      } else {
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  });
  console.log(form.formState.errors);
  if (isLoading) return <Loader />;
  const steps: StepConfig[] = [
    {
      id: 1,
      title: "المعلومات الأساسية",
      component: <BasicInformation />,
      fields: isAdmin
        ? [
            "productName",
            "price",
            "section_id",
            "category_id",
            "condition",
            "shortDescription",
            "description",
            "cover",
            "images",
            "status",
          ]
        : [
            "productName",
            "price",
            "section_id",
            "category_id",
            "condition",
            "shortDescription",
            "description",
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
        "tags",
        "specifications",
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
      fields: ["crossSells"],
    },
    {
      id: 5,
      title: "منتجات مكملة",
      component: <UpSell />,
      fields: ["upSells", "upsellDiscountPrice", "upsellDiscountEndDate"],
    },
  ];
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
                <Button
                  onClick={() => {
                    handleSubmit();
                  }}
                  type="submit"
                  className="bg-[#2E5DB0] hover:bg-[#264B8B] text-white h-11 px-4 py-2.5 text-sm font-medium"
                  disabled={isSubmitting}
                >
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
                onClick={() => {
                  handleSubmit();
                }}
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
