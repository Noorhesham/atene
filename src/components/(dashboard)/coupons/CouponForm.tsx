import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckSquare, ListChecks, Percent, Tag, X, Users, Calendar } from "lucide-react";
import { z } from "zod";
import FormInput from "@/components/inputs/FormInput";
import toast from "react-hot-toast";

const couponSchema = z.object({
  couponCode: z.string().min(1, "كود الكوبون مطلوب"),
  couponType: z.enum(["percentage", "fixed"], { required_error: "نوع الكوبون مطلوب" }),
  discountValue: z.number().min(0, "قيمة الخصم مطلوبة"),
  startDate: z.string().min(1, "تاريخ البداية مطلوب"),
  endDate: z.string().min(1, "تاريخ الانتهاء مطلوب"),
  usageLimit: z.number().min(1, "يجب تحديد عدد مرات الاستخدام"),
  includedCategories: z.array(z.string()).optional(),
  includedProducts: z.array(z.string()).optional(),
});

type CouponFormData = z.infer<typeof couponSchema>;

export const AddCouponForm = ({ closeModal }: { closeModal: () => void }) => {
  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      couponType: "percentage",
    },
  });

  const onSubmit = (data: CouponFormData) => {
    console.log(data);
    toast.success("تم حفظ الكوبون بنجاح!");
    closeModal();
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form dir="rtl" onSubmit={form.handleSubmit(onSubmit)} dir="rtl">
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
                name="couponCode"
                label="كود الكوبون "
                placeholder="مثال: RAMADAN25"
                desc="حروف انجليزية وارقام وبدون مسافات"
              />

              <FormField
                control={form.control}
                name="couponType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="  mb-2  ml-auto">نوع الكوبون </FormLabel>
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
                          onClick={() => field.onChange("fixed")}
                          className={`w-1/2 ${
                            field.value === "fixed"
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
                name="discountValue"
                label="نسبة الخصم "
                type="number"
                placeholder="20%"
                icon={<Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput name="startDate" date label="تاريخ بداية الكوبون " placeholder="2025-05-28 23:00" />
                <FormInput date name="endDate" label="تاريخ انتهاء الكوبون " placeholder="2025-05-29 23:00" />
              </div>
              <FormInput
                name="usageLimit"
                label="عدد مرات الاستخدام للجميع "
                type="number"
                placeholder="200"
                icon={<Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
              />
            </TabsContent>
            <TabsContent value="includes" className="py-6 space-y-4">
              <FormInput
                select
                name="includedCategories"
                label="تصنيفات مشمولة "
                options={[{ value: "cat1", label: "ملابس" }]}
                placeholder="اختر..."
              />
              <FormInput name="includedProducts" label="منتجات مشمولة " placeholder="ابحث عن منتج..." />
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="bg-gray-100 text-gray-800 text-sm font-medium pl-2 pr-3 py-1 rounded-full flex items-center gap-2">
                  تيشيرت بولو
                  <button type="button" className="text-gray-500 hover:text-gray-800">
                    <X size={16} />
                  </button>
                </div>
                <div className="bg-gray-100 text-gray-800 text-sm font-medium pl-2 pr-3 py-1 rounded-full flex items-center gap-2">
                  بنطلون جينز
                  <button type="button" className="text-gray-500 hover:text-gray-800">
                    <X size={16} />
                  </button>
                </div>
              </div>
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
