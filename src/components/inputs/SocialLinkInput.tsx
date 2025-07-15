import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const SocialLinkInput = ({ name, label, icon, placeholder }: { name: string; label: string; icon: React.ReactNode; placeholder: string }) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <Input {...field} placeholder={placeholder} className="pl-10" />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SocialLinkInput;