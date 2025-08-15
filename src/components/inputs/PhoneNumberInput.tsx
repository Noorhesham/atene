import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

const PhoneNumberInput = ({ name, label, icon }: { name: string; label: string; icon: React.ReactNode }) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  country={"eg"}
                  inputClass="!w-full !h-11 !pr-16 !pl-10 !border-gray-300 !rounded-lg"
                  buttonClass="!bg-transparent !border-l !border-gray-300"
                  containerClass="phone-input-container"
                />
              )}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneNumberInput;
