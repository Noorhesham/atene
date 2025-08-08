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

const statusOptions = [
  { value: "not_active", label: "مسودة" },
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path
                      d="M12 5.25C11.0479 5.25 10.1052 5.43753 9.22554 5.80187C8.34593 6.16622 7.5467 6.70025 6.87348 7.37348C6.20025 8.0467 5.66622 8.84593 5.30187 9.72554C4.93753 10.6052 4.75 11.5479 4.75 12.5C4.75 13.4521 4.93753 14.3948 5.30187 15.2745C5.66622 16.1541 6.20025 16.9533 6.87348 17.6265C7.5467 18.2997 8.34593 18.8338 9.22554 19.1981C10.1052 19.5625 11.0479 19.75 12 19.75C13.9228 19.75 15.7669 18.9862 17.1265 17.6265C18.4862 16.2669 19.25 14.4228 19.25 12.5C19.25 10.5772 18.4862 8.73311 17.1265 7.37348C15.7669 6.01384 13.9228 5.25 12 5.25ZM3.25 12.5C3.25 10.1794 4.17187 7.95376 5.81282 6.31282C7.45376 4.67187 9.67936 3.75 12 3.75C14.3206 3.75 16.5462 4.67187 18.1872 6.31282C19.8281 7.95376 20.75 10.1794 20.75 12.5C20.75 14.8206 19.8281 17.0462 18.1872 18.6872C16.5462 20.3281 14.3206 21.25 12 21.25C9.67936 21.25 7.45376 20.3281 5.81282 18.6872C4.17187 17.0462 3.25 14.8206 3.25 12.5Z"
                      fill="#406896"
                    />
                    <path
                      opacity="0.5"
                      d="M10.75 10.5C10.75 9.81 11.31 9.25 12 9.25H12.116C12.3475 9.25024 12.5733 9.3213 12.7632 9.45366C12.9531 9.58601 13.098 9.7733 13.1783 9.99039C13.2587 10.2075 13.2707 10.4439 13.2127 10.668C13.1547 10.8921 13.0295 11.0931 12.854 11.244L12.084 11.905C11.8232 12.1296 11.6137 12.4076 11.4698 12.7203C11.3259 13.0329 11.251 13.3728 11.25 13.717V14.25C11.25 14.4489 11.329 14.6397 11.4697 14.7803C11.6103 14.921 11.8011 15 12 15C12.1989 15 12.3897 14.921 12.5303 14.7803C12.671 14.6397 12.75 14.4489 12.75 14.25V13.717C12.75 13.458 12.863 13.212 13.06 13.044L13.83 12.384C14.2387 12.0338 14.5302 11.5668 14.6655 11.0458C14.8007 10.5249 14.7731 9.97503 14.5864 9.47025C14.3997 8.96547 14.0628 8.53 13.6212 8.22244C13.1795 7.91489 12.6542 7.75001 12.116 7.75H12C11.6389 7.75 11.2813 7.82113 10.9476 7.95933C10.614 8.09753 10.3108 8.3001 10.0555 8.55546C9.8001 8.81082 9.59753 9.11398 9.45933 9.44762C9.32113 9.78127 9.25 10.1389 9.25 10.5V10.607C9.25 10.8059 9.32902 10.9967 9.46967 11.1373C9.61032 11.278 9.80109 11.357 10 11.357C10.1989 11.357 10.3897 11.278 10.5303 11.1373C10.671 10.9967 10.75 10.8059 10.75 10.607V10.5ZM12 17.5C12.2652 17.5 12.5196 17.3946 12.7071 17.2071C12.8946 17.0196 13 16.7652 13 16.5C13 16.2348 12.8946 15.9804 12.7071 15.7929C12.5196 15.6054 12.2652 15.5 12 15.5C11.7348 15.5 11.4804 15.6054 11.2929 15.7929C11.1054 15.9804 11 16.2348 11 16.5C11 16.7652 11.1054 17.0196 11.2929 17.2071C11.4804 17.3946 11.7348 17.5 12 17.5Z"
                      fill="#406896"
                    />
                  </svg>
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
