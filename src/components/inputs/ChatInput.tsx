import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "../ui/form";

interface ChatInputProps {
  name: string;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ name, placeholder = "نص الرسالة ..." }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <input
              {...field}
              type="text"
              placeholder={placeholder}
              className="flex-1 p-2 px-4 border rounded-full text-right w-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[#F1F1F5] border-[#F1F1F5]"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ChatInput;
