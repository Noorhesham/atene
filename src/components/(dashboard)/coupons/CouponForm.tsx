import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckSquare, ListChecks, Percent, Tag, Loader2 } from "lucide-react";
import { z } from "zod";
import { useMemo } from "react";
import FormInput from "@/components/inputs/FormInput";
import { ApiCoupon } from "@/types";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { MultiSelect } from "@/components/inputs/MultiSelect";

const couponSchema = z.object({
  code: z.string().min(1, "كود الكوبون مطلوب"),
  type: z.enum(["value", "percentage"], { required_error: "نوع الكوبون مطلوب" }),
  value: z.union([z.number().min(1, "قيمة الخصم مطلوبة"), z.string()]),
  start_date: z.string().min(1, "تاريخ البداية مطلوب"),
  end_date: z.string().min(1, "تاريخ الانتهاء مطلوب"),
  categories: z.array(z.union([z.number(), z.string()])),
  products: z.array(z.union([z.number(), z.string()])),
  store_id: z.union([z.number(), z.string()]),
  status: z.enum(["active", "in-active"], { required_error: "حالة الكوبون مطلوبة" }),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface AddCouponFormProps {
  closeModal: () => void;
  editingCoupon?: ApiCoupon & { id: number };
}

export const AddCouponForm = ({ closeModal, editingCoupon }: AddCouponFormProps) => {
  const couponsQuery = useAdminEntityQuery("coupons");
  const categoriesQuery = useAdminEntityQuery("categories");
  const productsQuery = useAdminEntityQuery("products");
  const storesQuery = useAdminEntityQuery("stores");

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: editingCoupon?.code || "",
      type: editingCoupon?.type || ("percentage" as const),
      value: Number(editingCoupon?.value) || 0,
      start_date: editingCoupon?.start_date || "",
      end_date: editingCoupon?.end_date || "",
      store_id: editingCoupon?.store_id || "",
      categories: editingCoupon?.categories?.map((cat) => cat.id?.toString()) || [],
      products: editingCoupon?.products?.map((prod) => prod.id?.toString()) || [],
      status: editingCoupon?.status || "active",
    },
  });

  const onSubmit = async (data: CouponFormData) => {
    try {
      if (editingCoupon) {
        await couponsQuery.update(editingCoupon.id, data);
      } else {
        await couponsQuery.create(data);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save coupon:", error);
    }
  };
  console.log(couponsQuery.data);
  if (couponsQuery.isLoading || categoriesQuery.isLoading || productsQuery.isLoading || storesQuery.isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  console.log(form.formState.errors, form.watch());
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form dir="rtl" onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold text-center mb-6">إضافة كوبون جديد</h2>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-lg">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-main rounded-md"
              >
                <ListChecks className="ml-2" size={16} /> بيانات الكوبون
              </TabsTrigger>
              <TabsTrigger
                value="includes"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-main rounded-md"
              >
                <CheckSquare className="ml-2" size={16} /> مشمول في الكوبون
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="py-6 space-y-4">
              <FormInput
                name="code"
                label="كود الكوبون "
                placeholder="مثال: RAMADAN25"
                desc="حروف انجليزية وارقام وبدون مسافات"
              />
              <FormInput
                name="store_id"
                label="المتجر المشمول في الكوبون "
                placeholder="اختر المتجر"
                options={storesQuery.data?.map((store) => ({
                  value: store.id.toString(),
                  label: store.name,
                }))}
                select
              />
              <FormInput
                name="status"
                label="حالة الكوبون"
                placeholder="اختر الحالة"
                options={[
                  { value: "active", label: "نشط" },
                  { value: "inactive", label: "غير نشط" },
                ]}
                select
              />
              <FormField
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 ml-auto">نوع الكوبون </FormLabel>
                    <FormControl>
                      <div className="flex border border-gray-300 rounded-lg p-1">
                        <Button
                          type="button"
                          onClick={() => field.onChange("percentage")}
                          className={`w-1/2 ${
                            field.value === "percentage"
                              ? "bg-white text-main shadow-sm"
                              : "bg-transparent text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <Percent className="ml-2" size={16} /> نسبة
                        </Button>
                        <Button
                          type="button"
                          onClick={() => field.onChange("value")}
                          className={`w-1/2 ${
                            field.value === "value"
                              ? "bg-white text-main shadow-sm"
                              : "bg-transparent text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <Tag className="ml-2" size={16} /> قيمة
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormInput
                name="value"
                label={`قيمة الخصم ${form.watch("type") === "percentage" ? "%" : ""}`}
                type="number"
                placeholder={form.watch("type") === "percentage" ? "20%" : "100"}
                icon={
                  form.watch("type") === "percentage" ? (
                    <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  ) : undefined
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput name="start_date" date label="تاريخ بداية الكوبون " placeholder="2025-05-28 23:00" />
                <FormInput date name="end_date" label="تاريخ انتهاء الكوبون " placeholder="2025-05-29 23:00" />
              </div>
            </TabsContent>
            <TabsContent value="includes" className="py-6 space-y-4">
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تصنيفات مشمولة</FormLabel>
                    <FormControl>
                      {categoriesQuery.isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري تحميل التصنيفات...</span>
                        </div>
                      ) : (
                        <MultiSelect
                          name="categories"
                          options={
                            categoriesQuery.data?.map((cat) => ({
                              value: cat.id.toString(),
                              label: cat.name,
                            })) || ([] as any)
                          }
                          value={form.watch("categories") || []}
                          onValueChange={(values) => field.onChange(values.map(Number))}
                          placeholder="اختر التصنيفات..."
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="products"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>منتجات مشمولة</FormLabel>
                    <FormControl>
                      {productsQuery.isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري تحميل المنتجات...</span>
                        </div>
                      ) : (
                        <MultiSelect
                          name="products"
                          options={
                            productsQuery.data?.map((prod) => ({
                              value: prod.id.toString(),
                              label: prod.name,
                            })) || ([] as any)
                          }
                          value={form.watch("products") || []}
                          onValueChange={(values) => field.onChange(values.map(Number))}
                          placeholder="اختر المنتجات..."
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={closeModal} className="bg-gray-100">
              إلغاء
            </Button>
            <Button type="submit" className="bg-main text-white hover:bg-main/90">
              حفظ
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
