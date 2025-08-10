import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/inputs/FormInput";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Loader from "@/components/Loader";
import { QuestionMark } from "@/components/icons";

const statusOptions = [
  { value: "not-active", label: "مسودة" },
  { value: "active", label: "منشور" },
];

const conditionOptions = [
  { value: "new", label: "جديد" },
  { value: "used", label: "مستعمل" },
  { value: "refurbished", label: "مجدد" },
];

const BasicInformation = () => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const form = useFormContext();
  const sectionId = form.watch("section_id") || searchParams[0].get("section_id");
  const { data: sections = [], isLoading } = useAdminEntityQuery("sections", {});
  const { data: categories = [], isLoading: isLoadingCategories } = useAdminEntityQuery("categories", {});
  const { data: users = [], isLoading: isLoadingUsers } = useAdminEntityQuery("users");
  const isAdmin = user?.user?.user_type === "admin";

  // Set store_id from localStorage for non-admin users
  useEffect(() => {
    if (!isAdmin) {
      const storeId = localStorage.getItem("storeId");
      if (storeId) {
        setValue("storeVisibility", storeId);
      }
    }
  }, [isAdmin, setValue]);

  // Ensure category_id is set correctly when categories load
  useEffect(() => {
    if (categories.length > 0) {
      const currentCategoryId = form.getValues("category_id");
      console.log("Categories loaded, current category_id:", currentCategoryId);

      // If we have a category_id but it's not in the options, try to find it
      if (currentCategoryId && !categories.find((cat: any) => cat.id.toString() === currentCategoryId)) {
        console.log("Category ID not found in options, resetting...");
        setValue("category_id", "");
      }
    }
  }, [categories, form, setValue]);

  if (isLoading || isLoadingCategories || isLoadingUsers) return <Loader />;

  const categoryOptions = categories.map((cat: any) => ({
    value: cat.id.toString(), // Convert to string to match form field type
    label: cat.name,
  }));
  console.log("Category options:", categoryOptions);
  console.log("Current category_id value:", form.getValues("category_id"));
  console.log("Categories data:", categories);

  // Check if the current category_id value exists in the options
  const currentCategoryId = form.getValues("category_id");
  const selectedCategory = categoryOptions.find((option) => option.value === currentCategoryId);
  console.log("Selected category:", selectedCategory);

  const section = sections.find((section: any) => section.id.toString() === sectionId);
  console.log(section, sections);
  console.log(users);
  const userOptions = users.map((user: any) => ({
    value: user.id.toString(),
    label: `${user.first_name} ${user.last_name}`,
  }));

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm">
            <Package />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{section?.name}</h4>
            <p className="text-xs text-gray-500">{section?.description}</p>
          </div>
        </div>
        <Button onClick={() => window.history.back()} variant="link" className="text-main hover:text-main/80">
          تغيير
        </Button>
      </div>
      <div>
        <FormLabel className="flex text-[18px] items-center gap-1 mb-2">
          صورة الغلاف
          <span className="text-red-500">*</span>
        </FormLabel>
        <FormInput photo name="cover" />
      </div>
      <div>
        <FormLabel className="flex text-[18px] items-center gap-1 mb-2">صور المنتج الإضافية</FormLabel>
        <FormInput photo name="images" multiple={true} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput placeholder="اكتب اسم المنتج" label="اسم المنتج" name="productName" />
        <FormInput placeholder="اكتب السعر" label="السعر" name="price" type="number" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          select
          placeholder="اختر الفئة"
          label="الفئة"
          name="category_id"
          options={categoryOptions}
          error={errors.category_id?.message as string}
        />
        {isAdmin && (
          <FormInput
            select
            placeholder="اختر المالك"
            label="المالك"
            name="client_id"
            options={userOptions}
            error={errors.client_id?.message as string}
          />
        )}
        {isAdmin && (
          <FormInput
            select
            placeholder="اختر حالة المنتج"
            label="حالة المنتج"
            name="status"
            options={statusOptions}
            error={errors.status?.message as string}
          />
        )}
        <FormInput
          select
          placeholder="اختر حالة المنتج"
          label="حالة المنتج"
          name="condition"
          options={conditionOptions}
          error={errors.condition?.message as string}
        />
      </div>
      <div className="">
        <FormField
          name="shortDescription"
          control={control}
          render={({ field }) => (
            <FormItem>
              {" "}
              <div className="flex items-center w-full justify-between gap-2">
                <FormLabel className="flex text-[18px] items-center gap-1">
                  الوصف الموجز
                  <span className="text-red-500">*</span>
                </FormLabel>
                <p className="flex text-main items-center gap-2">
                  <QuestionMark />
                  ماهو الوصف الموجز
                </p>
              </div>
              <FormControl>
                <Textarea
                  placeholder="اكتب الوصف الموجز..."
                  {...field}
                  rows={4}
                  className={errors.shortDescription ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>{" "}
      <FormInput
        info="وصف المنتج"
        area
        name="description"
        label="وصف المنتج"
        placeholder="اكتب وصف المنتج..."
        className="w-full"
      />
    </div>
  );
};

export default BasicInformation;
