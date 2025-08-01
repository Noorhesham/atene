import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/inputs/FormInput";

export const storySchema = z.object({
  image: z.string().nullable(),
  text: z.string(),
  color: z.string().optional(),
});

export type StoryFormData = z.infer<typeof storySchema>;

interface StoryFormProps {
  storyType: "text" | "media" | null;
  onSubmit: (data: StoryFormData) => Promise<void>;
}

const StoryForm = ({ storyType, onSubmit }: StoryFormProps) => {
  const form = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      image: null,
      text: "",
      color: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        {storyType === "media" && <FormInput photo name="image" label="الصورة" mediaType="image" />}
        {storyType === "text" && (
          <>
            <FormInput name="text" label="النص" area />
            <FormInput name="color" label="لون الخلفية" type="color" />
          </>
        )}
        <div className="flex justify-end gap-2">
          <Button type="submit">حفظ</Button>
        </div>
      </form>
    </Form>
  );
};

export default StoryForm;
