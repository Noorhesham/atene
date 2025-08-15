"use client";

import { useFormContext } from "react-hook-form";

import FormInput from "@/components/inputs/FormInput"; // Your custom component

import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormMessage } from "@/components/ui/form";
import MapAddressInput from "./MapAddressInput";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import Loader from "@/components/Loader";
import { Currency, Owner } from "@/constants/Icons";

const StoreBasicInfo = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const { data: currencies } = useAdminEntityQuery("currencies");
  const { data: users, isLoading } = useAdminEntityQuery("users");
  const userOptions = users?.map((user) => ({
    value: user.id.toString(),
    label: user.first_name + " " + user.last_name,
  }));
  console.log(currencies);
  if (isLoading) return <Loader />;
  return (
    <div className="p-6 bg-white space-y-3">
      {/* Store Name */}
      <div className="flex flex-col items-end justify-between">
        <FormInput
          iconNotLable={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M2.96729 10.4961V15.4981C2.96729 18.3281 2.96729 19.7421 3.84529 20.6211C4.72529 21.5011 6.13829 21.5011 8.96729 21.5011H14.9673C17.7953 21.5011 19.2093 21.5011 20.0883 20.6211C20.9673 19.7421 20.9673 18.3271 20.9673 15.4981V10.4961"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.967 16.9928C14.283 17.5998 13.194 17.9928 11.967 17.9928C10.74 17.9928 9.65104 17.5998 8.96704 16.9928M10.104 8.41775C9.82204 9.43675 8.79604 11.1938 6.84804 11.4478C5.12804 11.6728 3.82204 10.9218 3.48904 10.6078C3.12204 10.3528 2.28404 9.53775 2.07904 9.02975C1.87404 8.51975 2.11304 7.41675 2.28404 6.96675L2.96704 4.98875C3.13404 4.49175 3.52504 3.31675 3.92504 2.91875C4.32504 2.52075 5.13504 2.50375 5.46904 2.50375H12.475C14.278 2.52975 18.221 2.48775 19 2.50375C19.78 2.51975 20.248 3.17375 20.385 3.45375C21.548 6.26975 22 7.88375 22 8.56975C21.848 9.30375 21.22 10.6858 19 11.2948C16.693 11.9268 15.385 10.6968 14.975 10.2248M9.15504 10.2248C9.48004 10.6238 10.499 11.4268 11.975 11.4468C13.452 11.4668 14.727 10.4368 15.18 9.91975C15.308 9.76675 15.585 9.31375 15.873 8.41675"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
          name="name"
          label="اسم المتجر "
          placeholder="اسم المتجر"
        />
        <span className="text-xs text-[#686869]">{watch("name")?.length || 0}/50</span>
      </div>
      {/* Store Identity */}
      <div className="grid grid-cols-1  items-center mt-4  lg:grid-cols-7 gap-4">
        <div className="col-span-2 w-full">
          <h3 className="font-semibold text-gray-800"> هوية متجرك</h3>
          <p className="text-xs mt-1 text-[#49494A]">ستظهر هوية متجرك في صفحة المتجر</p>
          <FormInput photo name="logo" />
        </div>
        <div className=" w-full col-span-5">
          <h3 className="font-semibold text-gray-800"> بنر</h3>
          <p className="text-xs mt-1 text-[#49494A]">ستظهر هوية متجرك في صفحة المتجر</p>
          <FormInput photo name="cover" multiple mainCoverField="mainCover" maxFiles={10} />
        </div>
      </div>{" "}
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
              <div className="r relative">
                <svg
                  className=" absolute top-4 right-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M8 5H20M4 5H4.009M4 12H4.009M4 19H4.009M8 12H20M8 19H20"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>{" "}
                <Textarea
                  placeholder="اكتب الوصف  لمتجرك..."
                  {...field}
                  rows={4}
                  className={`${errors.description ? "border-red-500" : ""} pr-12 pt-4 h-32`}
                />
              </div>
            </FormControl>
            <FormMessage />{" "}
            <div className="flex items-center justify-between">
              <p className="flex text-[#686869] text-sm items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                  <path
                    d="M10.1832 6.73805C10.1914 6.3559 9.88385 6.04168 9.50161 6.04168C9.11955 6.04168 8.81207 6.35562 8.82002 6.73761L8.90862 10.9925C8.91532 11.3144 9.17822 11.5719 9.50023 11.5719C9.82209 11.5719 10.0849 11.3146 10.0918 10.9928L10.1832 6.73805Z"
                    fill="#395A7D"
                  />
                  <path
                    d="M8.93868 13.7136C9.09461 13.8768 9.28173 13.9583 9.50004 13.9583C9.64398 13.9583 9.77472 13.9214 9.89227 13.8474C10.0122 13.7709 10.1082 13.669 10.1802 13.5415C10.2545 13.414 10.2917 13.2725 10.2917 13.117C10.2917 12.8875 10.2125 12.6912 10.0542 12.528C9.89827 12.3648 9.71355 12.2832 9.50004 12.2832C9.28173 12.2832 9.09461 12.3648 8.93868 12.528C8.78514 12.6912 8.70837 12.8875 8.70837 13.117C8.70837 13.3515 8.78514 13.5504 8.93868 13.7136Z"
                    fill="#395A7D"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.4167 10C17.4167 14.3723 13.8723 17.9167 9.50004 17.9167C5.12779 17.9167 1.58337 14.3723 1.58337 10C1.58337 5.62776 5.12779 2.08334 9.50004 2.08334C13.8723 2.08334 17.4167 5.62776 17.4167 10ZM16.2292 10C16.2292 13.7164 13.2165 16.7292 9.50004 16.7292C5.78362 16.7292 2.77087 13.7164 2.77087 10C2.77087 6.28359 5.78362 3.27084 9.50004 3.27084C13.2165 3.27084 16.2292 6.28359 16.2292 10Z"
                    fill="#395A7D"
                  />
                </svg>
                لا بأس إن تجاوز النص 300 كلمة. يسمح بمرونة في عدد الكلمات حسب الحاجة.
              </p>
              <span className="text-xs text-[#686869]">{field.value?.length || 0}/300</span>
            </div>
          </FormItem>
        )}
      />
      <FormInput name="email" type="email" label="البريد الالكتروني" placeholder="example@info.com" />
      <MapAddressInput name="address" label="العنوان" />
      {/* Currency, Owner and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          iconNotLable={<Currency />}
          select
          name="currency_id"
          label="عملة المتجر"
          options={currencies?.map((currency) => ({ value: currency.id.toString(), label: currency.name }))}
        />{" "}
        <FormInput iconNotLable={<Owner />} select name="owner_id" label="المالك" options={userOptions} />
      </div>{" "}
    </div>
  );
};

export default StoreBasicInfo;

   