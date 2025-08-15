import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckSquare, ListChecks, Percent, Tag, Loader2, Users, Calendar, Coins } from "lucide-react";
import { z } from "zod";
import { useMemo } from "react";
import FormInput from "@/components/inputs/FormInput";
import { ApiCoupon } from "@/types";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { MultiSelect } from "@/components/inputs/MultiSelect";

// Updated Zod schema to include the new field
const couponSchema = z.object({
  code: z.string().min(1, "كود الكوبون مطلوب").max(50, "الكود يجب أن يكون 50 حرفًا أو أقل"),
  type: z.enum(["value", "percentage"], { required_error: "نوع الكوبون مطلوب" }),
  value: z.coerce.number().min(1, "قيمة الخصم مطلوبة"),
  start_date: z.string().min(1, "تاريخ البداية مطلوب"),
  end_date: z.string().min(1, "تاريخ الانتهاء مطلوب"),
  usage_limit: z.coerce.number().min(1, "عدد مرات الاستخدام مطلوب"),
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
      usage_limit: editingCoupon?.usage_limit || 200,
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

  if (couponsQuery.isLoading || categoriesQuery.isLoading || productsQuery.isLoading || storesQuery.isLoading)
    return (
      <div className="flex justify-center items-center h-full p-10">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form dir="rtl" onSubmit={form.handleSubmit(onSubmit)} className="p-2">
          <header className="p-4 rounded-md absolute top-0 left-0 w-full bg-[#C8D7E8]">
            <h2 className="text-base mr-10 pt-3 font-semibold text-gray-800 text-right">إضافة كوبون جديد</h2>
          </header>

          <div className="p-6 px-0 pt-14">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-0 bg-transparent gap-4 mb-6">
                <TabsTrigger
                  value="details"
                  className="flex items-center justify-center gap-2 text-gray-600 font-semibold border-b-2 border-transparent data-[state=active]:text-[#406896] data-[state=active]:border-[#406896] pb-3"
                >
                  <ListChecks size={20} /> بيانات الكوبون
                </TabsTrigger>
                <TabsTrigger
                  value="includes"
                  className="flex items-center justify-center gap-2 text-gray-600 font-semibold border-b-2 border-transparent data-[state=active]:text-[#406896] data-[state=active]:border-[#406896] pb-3"
                >
                  <CheckSquare size={20} /> مشمول في الكوبون
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div>
                  <FormInput
                    name="code"
                    label="كود الكوبون"
                    placeholder="كود الكوبون"
                    iconNotLable={
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9.50038 14.5L14.5004 9.5M9.50038 9.5H9.51138M14.4894 14.5H14.5004M2.46438 9.344C2.21638 9.344 1.98938 9.142 2.00038 8.879C2.06738 7.337 2.25538 6.333 2.78038 5.539C3.07984 5.08653 3.45539 4.68933 3.89038 4.365C5.05538 3.5 6.70038 3.5 9.99238 3.5H14.0064C17.2984 3.5 18.9434 3.5 20.1104 4.365C20.5414 4.685 20.9174 5.082 21.2194 5.539C21.7444 6.333 21.9324 7.337 21.9994 8.879C22.0104 9.142 21.7834 9.344 21.5344 9.344C20.1484 9.344 19.0244 10.533 19.0244 12C19.0244 13.467 20.1484 14.656 21.5344 14.656C21.7834 14.656 22.0104 14.858 21.9994 15.122C21.9324 16.663 21.7444 17.667 21.2194 18.462C20.9198 18.9141 20.5443 19.311 20.1094 19.635C18.9434 20.5 17.2984 20.5 14.0064 20.5H9.99338C6.70138 20.5 5.05638 20.5 3.88938 19.635C3.45475 19.3106 3.07954 18.9134 2.78038 18.461C2.25538 17.667 2.06738 16.663 2.00038 15.121C1.98938 14.858 2.21638 14.656 2.46438 14.656C3.85038 14.656 4.97438 13.467 4.97438 12C4.97438 10.533 3.85038 9.344 2.46438 9.344Z"
                          stroke="#AAAAAA"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                    className="bg-white"
                  />
                  <div className="flex items-center  justify-between">
                    <span className="text-sm text-gray-500">{form.watch("code").length}/50</span>
                    <p className="text-sm text-gray-500">حروف انجليزية وعربية وارقام وبدون مسافات</p>
                  </div>
                </div>

                <FormField
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الكوبون</FormLabel>
                      <FormControl>
                        <div className="flex border ml-auto border-gray-200 rounded-lg p-1 w-fit">
                          <Button
                            type="button"
                            onClick={() => field.onChange("percentage")}
                            variant="ghost"
                            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md ${
                              field.value === "percentage"
                                ? "bg-white text-[#406896] shadow"
                                : "bg-transparent text-gray-500"
                            }`}
                          >
                            نسبة
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="24"
                              viewBox="0 0 25 24"
                              fill="none"
                            >
                              <path
                                d="M15.7496 8.9996L9.7496 14.9996M15.7496 14.9996H15.7396M9.7596 8.9996H9.7496M8.4416 19.6156C9.0316 19.6156 9.3276 19.6156 9.5966 19.7156C9.6346 19.7296 9.6716 19.7449 9.7076 19.7616C9.9686 19.8816 10.1776 20.0896 10.5956 20.5076C11.5576 21.4696 12.0386 21.9506 12.6296 21.9956C12.7096 22.0016 12.7896 22.0016 12.8696 21.9956C13.4606 21.9506 13.9416 21.4696 14.9036 20.5076C15.3216 20.0896 15.5306 19.8816 15.7916 19.7616C15.8276 19.7449 15.8643 19.7296 15.9016 19.7156C16.1716 19.6156 16.4666 19.6156 17.0576 19.6156H17.1676C18.6746 19.6156 19.4286 19.6156 19.8976 19.1476C20.3666 18.6796 20.3656 17.9246 20.3656 16.4176V16.3076C20.3656 15.7176 20.3656 15.4216 20.4656 15.1526C20.4796 15.1146 20.4949 15.0776 20.5116 15.0416C20.6316 14.7806 20.8396 14.5716 21.2576 14.1536C22.2196 13.1916 22.7006 12.7106 22.7456 12.1196C22.7516 12.0396 22.7516 11.9596 22.7456 11.8796C22.7006 11.2886 22.2196 10.8076 21.2576 9.8456C20.8396 9.4276 20.6316 9.2186 20.5116 8.9576L20.4656 8.8476C20.3656 8.5776 20.3656 8.2826 20.3656 7.6916V7.5816C20.3656 6.0746 20.3656 5.3206 19.8976 4.8516C19.4296 4.3826 18.6746 4.3836 17.1676 4.3836H17.0576C16.4676 4.3836 16.1716 4.3836 15.9026 4.2836L15.7916 4.2376C15.5306 4.1176 15.3216 3.9096 14.9036 3.4916C13.9416 2.5296 13.4606 2.0486 12.8696 2.0036C12.7897 1.9988 12.7095 1.9988 12.6296 2.0036C12.0386 2.0486 11.5576 2.5296 10.5956 3.4916C10.1776 3.9096 9.9686 4.1186 9.7076 4.2376L9.5976 4.2836C9.3276 4.3836 9.0326 4.3836 8.4416 4.3836H8.3316C6.8246 4.3836 6.0706 4.3836 5.6016 4.8516C5.1326 5.3196 5.1336 6.0746 5.1336 7.5816V7.6916C5.1336 8.2816 5.1336 8.5776 5.0336 8.8466C5.01894 8.8846 5.0036 8.9216 4.9876 8.9576C4.8676 9.2186 4.6596 9.4276 4.2416 9.8456C3.2796 10.8076 2.7986 11.2886 2.7536 11.8796C2.7488 11.9595 2.7488 12.0397 2.7536 12.1196C2.7986 12.7106 3.2796 13.1916 4.2416 14.1536C4.6596 14.5716 4.8686 14.7806 4.9876 15.0416C5.00427 15.0776 5.0196 15.1143 5.0336 15.1516C5.1336 15.4216 5.1336 15.7166 5.1336 16.3076V16.4176C5.1336 17.9246 5.1336 18.6786 5.6016 19.1476C6.0696 19.6166 6.8246 19.6156 8.3316 19.6156H8.4416Z"
                                stroke="#38587A"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </Button>
                          <Button
                            type="button"
                            onClick={() => field.onChange("value")}
                            variant="ghost"
                            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md ${
                              field.value === "value"
                                ? "bg-white text-[#406896] shadow"
                                : "bg-transparent text-gray-500"
                            }`}
                          >
                            قيمة
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="24"
                              viewBox="0 0 25 24"
                              fill="none"
                            >
                              <path
                                d="M21.193 16.835C20.6449 13.5635 19.0785 10.5484 16.717 8.219C16.2 7.716 15.942 7.465 15.371 7.233C14.8 7 14.309 7 13.328 7H11.172C10.191 7 9.69998 7 9.12898 7.233C8.55898 7.465 8.29898 7.716 7.78298 8.219C5.42144 10.5484 3.85508 13.5635 3.30698 16.835C2.81998 19.773 5.52998 22 8.55798 22H15.942C18.971 22 21.682 19.773 21.192 16.835"
                                stroke="black"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M13.8772 12.919C13.6612 12.12 12.5602 11.4 11.2392 11.939C9.91818 12.478 9.70918 14.211 11.7062 14.396C12.6102 14.479 13.1982 14.299 13.7372 14.808C14.2772 15.316 14.3772 16.731 12.9982 17.112C11.6212 17.493 10.2562 16.898 10.1082 16.052M12.0922 10.992V11.753M12.0922 17.229V17.993M7.50718 4.443C7.30018 4.143 7.00118 3.735 7.61918 3.643C8.25418 3.547 8.91318 3.981 9.55918 3.973C10.1422 3.964 10.4392 3.705 10.7592 3.335C11.0952 2.946 11.6152 2 12.2502 2C12.8852 2 13.4052 2.946 13.7412 3.335C14.0612 3.705 14.3582 3.965 14.9412 3.972C15.5872 3.982 16.2462 3.547 16.8812 3.642C17.4992 3.735 17.2002 4.142 16.9932 4.442L16.0612 5.801C15.6612 6.381 15.4622 6.671 15.0442 6.836C14.6262 7.001 14.0872 7 13.0082 7H11.4922C10.4122 7 9.87318 7 9.45618 6.836C9.03918 6.672 8.83918 6.38 8.43918 5.8L7.50718 4.443Z"
                                stroke="black"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>{" "}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormInput
                  name="value"
                  label={form.watch("type") === "percentage" ? "نسبة الخصم" : "قيمة الخصم"}
                  type="number"
                  placeholder={form.watch("type") === "percentage" ? "20" : "100"}
                  icon={<Percent size={18} className="text-gray-400" />}
                />

                <div className="grid grid-cols-2 gap-6">
                  <FormInput
                    name="start_date"
                    date
                    label="تاريخ بداية الكوبون"
                    placeholder="2025-05-28 23:00"
                    icon={<Calendar size={18} className="text-gray-400" />}
                  />
                  <FormInput
                    name="end_date"
                    date
                    label="تاريخ انتهاء الكوبون"
                    placeholder="2025-05-29 23:00"
                    icon={<Calendar size={18} className="text-gray-400" />}
                  />
                </div>

                <FormInput
                  name="usage_limit"
                  label="عدد مرات الاستخدام للجميع"
                  placeholder="200"
                  type="number"
                  icon={<Users size={18} className="text-gray-400" />}
                />
              </TabsContent>

              <TabsContent value="includes" className="py-6 space-y-4">
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تصنيفات مشمولة</FormLabel>
                      <FormControl>
                        <MultiSelect
                          name="categories"
                          options={
                            categoriesQuery.data?.map((cat) => ({ value: cat.id.toString(), label: cat.name })) || []
                          }
                          value={form.watch("categories") || []}
                          onValueChange={(values) => field.onChange(values.map(String))}
                          placeholder="اختر التصنيفات..."
                        />
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
                        <MultiSelect
                          name="products"
                          options={
                            productsQuery.data?.map((prod) => ({ value: prod.id.toString(), label: prod.name })) || []
                          }
                          value={form.watch("products") || []}
                          onValueChange={(values) => field.onChange(values.map(String))}
                          placeholder="اختر المنتجات..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={closeModal}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold"
            >
              إلغاء
            </Button>
            <Button type="submit" className="bg-[#406896] text-white hover:bg-[#3A5779] font-semibold">
              {couponsQuery.isCreating || couponsQuery.isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : null}
              حفظ
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
