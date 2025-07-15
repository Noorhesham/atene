import { useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Control } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import RichText from "./RichText";
import { PhotoInput } from "./PhotoInput";
import Starrating from "../reviews/Rate";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "../ui/select";
import CalendarInput from "./CalendarInput";

interface FormInputProps {
  control?: Control<any>;
  name: string;
  label?: string;
  width?: string;
  mediaType?: "image" | "video";
  toYear?: number;
  type?: string;
  phone?: boolean;
  check?: boolean;
  className?: string;
  description?: string;
  price?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
  switchToggle?: boolean;
  desc?: string;
  disabled?: boolean;
  placeholder?: string;
  label2?: string;
  icon?: React.ReactNode;
  password?: boolean;
  optional?: boolean;
  returnFullPhone?: boolean;
  noProgress?: boolean;
  date?: boolean;
  rate?: boolean;
  area?: boolean;
  photo?: boolean;
  noimg?: boolean;
  disableOldDates?: boolean;
  monthOnly?: boolean;
  noSwitch?: boolean;
  currency?: boolean;
  single?: boolean;
  flex?: boolean;
  error?: string;
  info?: string;
}

const FormInput = ({
  control: controlProp,
  name,
  label,
  type = "text",
  icon,
  phone,
  single,
  className,
  switchToggle = false,
  desc,
  disabled,
  placeholder,
  label2,
  password,
  optional = false,
  date = false,
  photo = false,
  area = false,
  width,
  check = false,
  mediaType,
  rate,
  options,
  select,
  error,
  info,
  flex,
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const formContext = useFormContext();

  // Use provided control prop or get it from context
  const control = controlProp || formContext?.control;
  if (!control) {
    throw new Error("FormInput must be used within a Form or be passed a control prop");
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          flex={flex}
          className={`${width || "w-full"}   ${!check && !flex && "flex flex-col gap-3"} my-2 !space-y-0 ${
            check && "flex items-center "
          } relative`}
        >
          {!switchToggle && label !== "" && !date && (
            <div className={` ${flex ? "w-fit" : "w-full"} flex justify-between  items-center gap-2`}>
              <FormLabel className={`uppercase  text-nowrap relative w-fit text-[18px] ${check && "text-nowrap mt-2"}`}>
                {" "}
                {!flex && !optional && !date && !switchToggle && label && (
                  <span className={`absolute -left-3 top-0   font-normal text-red-600`}>*</span>
                )}
                {label} {icon}
              </FormLabel>
              {info && (
                <p className="flex items-center text-main gap-2">
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
                  {info}
                </p>
              )}
            </div>
          )}
          <div className={`relative  w-full inline-flex items-center justify-center ${className}`}>
            <FormControl className={`  w-full  ${switchToggle ? "" : "   duration-200"} `}>
              {area ? (
                <RichText
                  description={field.value || ""}
                  onChange={field.onChange}
                  name={name}
                  label={label || ""}
                  placeholder={placeholder || ""}
                  className={`bg-white !w-full min-h-24 placeholder:text-gray-400 p-4 rounded-lg ${
                    error ? "border-red-500" : ""
                  }`}
                  rows={4}
                />
              ) : photo ? (
                <div className=" w-fit ml-auto">
                  <PhotoInput single={single} mediaType={mediaType} name={field.name} />
                </div>
              ) : switchToggle ? (
                <div className="flex mx-auto   mt-3 gap-2 items-center ">
                  <Label className=" uppercase md:text-sm  text-xs text-muted-foreground" htmlFor="sale">
                    {label2 || ""}
                  </Label>
                  <Switch disabled={disabled} className="" checked={field.value} onCheckedChange={field.onChange} />
                  <Label className="md:text-sm uppercase flex-grow  text-xs  text-muted-foreground" htmlFor="sale">
                    {label || ""}
                  </Label>
                </div>
              ) : rate ? (
                <div className="flex items-center gap-2 ml-auto">
                  <Label>تقييماتك:</Label>
                  <Starrating OnSetRating={field.onChange} MaxRating={5} />
                </div>
              ) : select && options ? (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className=" w-full">
                    <SelectValue placeholder="اختر..." />
                  </SelectTrigger>
                  <SelectContent className=" w-full">
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : date ? (
                <CalendarInput control={control} name={name} label={label} />
              ) : (
                <div className=" flex flex-col gap-2 w-full items-start">
                  {type === "file" && formContext.getValues(name) && !(formContext.getValues(name) instanceof File) && (
                    <a
                      target="_blank"
                      href={formContext.getValues(name)?.file || "#"}
                      className="flex gap-2 justify-between w-full  rounded-xl hover:bg-sky-100 duration-150  
                      px-4 py-2 items-center"
                    >
                      {formContext.getValues(name) && (
                        <p className="text-gray-800 text-sm">{formContext.getValues(name).title}</p>
                      )}
                      <div className=" relative w-10 h-10">
                        <img src={formContext.getValues(name)?.thumbnail} alt={formContext.getValues(name).title} />
                      </div>
                    </a>
                  )}
                  <Input
                    disabled={disabled}
                    autoComplete={password ? "off" : "on"}
                    type={
                      type == "password" && !showPassword
                        ? "password"
                        : type === "password" && showPassword
                        ? "text"
                        : type || "text"
                    }
                    accept={type === "file" ? "image/*, application/pdf" : undefined}
                    className={`${!phone && ""} bg-white  rounded-lg  mt-auto shadow-sm w-full ${
                      password && formContext.getValues(name) && "pl-8"
                    } ${error ? "border-red-500" : ""}`}
                    placeholder={placeholder}
                    {...field}
                    value={type === "file" ? null : field.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      if (e.target.type === "file") {
                        field.onChange(e.target.files ? e.target.files[0] : null);
                      } else {
                        field.onChange(value);
                      }
                    }}
                  />
                </div>
              )}
            </FormControl>
            {password && field.value && (
              <span
                className=" absolute left-4 top-1/2 -translate-y-1/2  cursor-pointer hover:text-gray-900 text-gray-800"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}
              </span>
            )}
          </div>
          {desc && <FormDescription className=" text-sm text-muted-foreground">{desc}</FormDescription>}
          {error && <FormMessage className=" text-sm dark:text-red-500">{error}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default FormInput;
