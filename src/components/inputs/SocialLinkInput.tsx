import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const SocialLinkInput = ({
  name,
  label,
  icon,
  placeholder,
}: {
  name: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative mt-2">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
            <Input {...field} placeholder={placeholder} className="pr-10" />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SocialLinkInput;
