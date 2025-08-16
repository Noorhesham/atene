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
        <div className="flex items-start justify-between w-full">
          <FormLabel className="flex flex-col relative items-start text-[18px] gap-1 mb-2">
            {" "}
            <span className="text-red-500 absolute right-10 text-xs top-0">*</span>
            الصور
            <p className=" text-xs text-[#49494A]">يمكنك إضافة حتى (10) صور و (١) فيديو </p>
          </FormLabel>
          <div className="flex items-center gap-2 text-main">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path
                d="M11.5 3.5C7.022 3.5 4.782 3.5 3.391 4.891C2 6.282 2 8.521 2 13.001C2 17.479 2 19.718 3.391 21.109C4.782 22.5 7.021 22.5 11.5 22.5C15.978 22.5 18.218 22.5 19.609 21.109C21 19.718 21 17.479 21 13C21 11.64 21 10.486 20.961 9.5"
                stroke="#406896"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.5 22C8.872 16.775 13.774 9.884 20.998 14.543M14 6.5C14 6.5 15 6.5 16 8.5C16 8.5 19.177 3.5 22 2.5"
                stroke="#406896"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            نصائح لإلتقاط صور جيدة
          </div>
        </div>{" "}
        <div className="text-xs  my-2 w-full text-main font-[400] text-right py-3 px-6 bg-[#5b87b923] rounded-[3px] flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M15.723 3.00017H12.729M15.723 3.00017C15.723 3.42017 14.6048 4.20542 14.226 4.50017M15.723 3.00017C15.723 2.58017 14.6048 1.79492 14.226 1.50017M2.24927 3.00017H5.24327M2.24927 3.00017C2.24927 2.58017 3.36827 1.79492 3.74702 1.50017M2.24927 3.00017C2.24927 3.42017 3.36827 4.20542 3.74702 4.50017M7.36127 16.5002V15.7952C7.36138 15.309 7.20402 14.8359 6.91277 14.4467L4.04552 10.6149C3.80702 10.2969 3.63002 9.91067 3.73877 9.52817C4.00877 8.58392 5.07602 7.74467 6.26927 9.22292L7.46927 10.5039V2.69567C7.54277 1.32317 9.84902 0.890416 10.0875 2.69567V7.14542C11.1998 7.00292 16.437 7.78367 15.675 11.0942L15.567 11.5712C15.4118 12.2597 14.955 13.4852 14.4518 14.2022C13.9275 14.9484 14.1728 16.1522 14.1128 16.5017"
              stroke="#5B87B9"
              stroke-width="1.125"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          يمكنك سحب و افلات الصورة لاعادة ترتيب الصور
        </div>
        <FormInput photo name="images" multiple={true} mainCoverField="cover" />
        <p className="text-sm text-gray-500 mt-2 text-right">
          💡 الصورة الأولى التي تختارها ستكون تلقائياً صورة الغلاف الرئيسي للمنتج
        </p>
      </div>
      <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <FormInput placeholder="اكتب اسم المنتج" label="اسم المنتج" name="productName" />
          <div className=" w-full flex justify-between">
            <p className="text-xs text-[#686869]">
              قم بتضمين الكلمات الرئيسية التي يستخدمها المشترون للبحث عن هذا العنصر.
            </p>
            <span className="text-xs text-[#686869] font-[400]">{form.watch("productName")?.length || 0}/50</span>
          </div>
        </div>
        <FormInput className="" placeholder="اكتب السعر" label="السعر" name="price" type="number" />
      </div>
      <FormInput
        select
        placeholder="اختر الفئة"
        label="الفئة"
        name="category_id"
        options={categoryOptions}
        error={errors.category_id?.message as string}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          placeholder="اختر وضع المنتج"
          label="وضع المنتج"
          name="condition"
          options={conditionOptions}
          error={errors.condition?.message as string}
        />
      </div>
      <div className="flex flex-col  w-full">
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
        <span className=" mt-3 text-xs mr-auto w-fit text-[#686869] font-[400]">
          {form.watch("shortDescription")?.length || 0}/300
        </span>
      </div>{" "}
      <FormInput
        info="وصف المنتج"
        area
        name="description"
        label="وصف المنتج"
        placeholder="اكتب وصف المنتج..."
        className="w-full"
      />{" "}
    </div>
  );
};

export default BasicInformation;
