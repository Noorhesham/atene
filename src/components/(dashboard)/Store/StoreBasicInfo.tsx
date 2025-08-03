"use client";

import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/inputs/FormInput"; // Your custom component

import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormMessage } from "@/components/ui/form";
import MapAddressInput from "./MapAddressInput";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
const typeOptions = [{ value: "rings", label: "خواتم" }];
const mainCategoryOptions = [{ value: "women-fashion", label: "أزياء - موضة نسائية" }];
const subCategoryOptions = [{ value: "accessories", label: "اكسسوارات - مجوهرات" }];
const cityOptions = [{ value: "cairo", label: "القاهرة" }];
const neighborhoodOptions = [{ value: "maadi", label: "المعادي" }];
const StoreBasicInfo = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { data: currencies } = useAdminEntityQuery("currencies");
  console.log(currencies);
  return (
    <Card className="p-6 space-y-3">
      <h2 className="text-xl font-semibold text-gray-900">البيانات الأساسية</h2>

      {/* Store Name */}
      <FormInput name="name" label="اسم المتجر " placeholder="اسم المتجر" />

      {/* Store Identity */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">شعار المتجر</h3>
        <p className="text-sm text-gray-500">إضافة شعار المتجر</p>
        <FormInput photo name="logo" />
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">صورة الغلاف</h3>
        <p className="text-sm text-gray-500">المقاسات المفضلة 680 X 180</p>
        <FormInput photo name="cover" multiple mainCoverField="mainCover" maxFiles={10} />
      </div>

      {/* Store Description */}
      {/* <FormInput area name="storeDescription" label="وصف المتجر" placeholder="اكتب وصف متجرك..." /> */}
      <FormField
        name="description"
        control={control}
        render={({ field }) => (
          <FormItem className="space-y-1">
            {" "}
            <div className="flex items-center w-full justify-between gap-2">
              <FormLabel className="flex text-[18px] items-center gap-1">
                وصف المتجر
                <span className="text-red-500">*</span>
              </FormLabel>
            </div>
            <FormControl>
              <Textarea
                placeholder="اكتب الوصف  لمتجرك..."
                {...field}
                rows={4}
                className={`${errors.description ? "border-red-500" : ""} h-32`}
              />
            </FormControl>
            <FormMessage />{" "}
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
              لا بأس إن تجاوز النص 300 كلمة. يسمح بمرونة في عدد الكلمات حسب الحاجة.
            </p>
          </FormItem>
        )}
      />
      {/* Email and Address */}
      <FormInput name="email" type="email" label="البريد الالكتروني" placeholder="example@info.com" />
      <MapAddressInput name="address" label="العنوان" />
      {/* Currency, Owner and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormInput
          select
          name="currency_id"
          label="عملة المتجر"
          options={currencies?.map((currency) => ({ value: currency.id.toString(), label: currency.name }))}
        />
        <FormInput name="phone" label="رقم الهاتف" placeholder="01234567890" />
      </div>

      <div className="space-y-1 ">
        <FormLabel className="text-[18px]">مميزات المتجر</FormLabel>
        <div className="grid px-4 bg-gray-100 grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <FormInput flex select name="type" className=" " label="النوع" options={typeOptions} placeholder="خواتم" />
          </div>
          <FormField
            control={control}
            name="hasDelivery"
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-lg">
                <span className="font-medium text-gray-700">هل لديك خدمة توصيل؟</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => field.onChange(false)}
                    className={`rounded-full px-6 ${!field.value ? "bg-main text-white" : "bg-white text-gray-700"}`}
                  >
                    لا
                  </Button>
                  <Button
                    type="button"
                    onClick={() => field.onChange(true)}
                    className={`rounded-full px-6 ${field.value ? "bg-main text-white" : "bg-white text-gray-700"}`}
                  >
                    نعم
                  </Button>
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
        <FormInput
          select
          flex
          name="mainCategory"
          label="القسم الرئيسي"
          options={mainCategoryOptions}
          placeholder="أزياء - موضة نسائية"
        />{" "}
        <FormInput
          select
          flex
          name="subCategory"
          label="القسم الفرعي"
          options={subCategoryOptions}
          placeholder="اكسسوارات - مجوهرات"
          className="col-span-2"
        />
      </div>
      {/* Categories Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  px-4 rounded-lg">
        <FormInput flex select name="city" label="المدينة" options={cityOptions} placeholder="القاهرة" />

        <FormInput
          select
          flex
          name="neighborhood"
          label="الحي / المنطقة"
          options={neighborhoodOptions}
          placeholder="المعادي"
        />
      </div>
    </Card>
  );
};

export default StoreBasicInfo;
