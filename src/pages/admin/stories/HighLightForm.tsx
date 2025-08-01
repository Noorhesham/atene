import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";
import type { ApiStory } from "@/hooks/useUsersQuery";
import { z } from "zod";
import FormInput from "@/components/inputs/FormInput";

export const highlightSchema = z.object({
  name: z.string().min(1, "اسم المجموعة مطلوب"),
  stories: z.array(z.number()),
});
interface HighlightFormProps {
  step: number;
  stories: ApiStory[];
  selectedStories: number[];
  onStorySelect: (id: number) => void;
  onSubmit: (data: HighlightFormData) => Promise<void>;
}
export type HighlightFormData = z.infer<typeof highlightSchema>;

const HighlightForm = ({ step, stories, selectedStories, onStorySelect, onSubmit }: HighlightFormProps) => {
  const form = useForm<HighlightFormData>({
    resolver: zodResolver(highlightSchema),
    defaultValues: {
      name: "",
      stories: selectedStories,
    },
  });

  // Update form values when selectedStories changes
  useEffect(() => {
    form.setValue("stories", selectedStories);
  }, [selectedStories, form]);

  return (
    <div className="w-full">
      {step === 1 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <FormInput name="name" label="عنوان المجموعة" placeholder="مجموعة جديدة" />
            <div className="flex justify-end gap-2">
              <Button type="submit">التالي</Button>
            </div>
          </form>
        </Form>
      )}
      {step === 2 && (
        <div className="p-4">
          <h3 className="text-center font-semibold mb-4">اختر القصص</h3>
          <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
            {stories.map((story) => (
              <div key={story.id} className="relative cursor-pointer" onClick={() => onStorySelect(story.id)}>
                {story.image ? (
                  <img
                    src={story.image}
                    alt={`Story ${story.id}`}
                    className="w-full h-full object-cover rounded-md aspect-[9/16]"
                  />
                ) : (
                  <div
                    className="w-full aspect-[9/16] rounded-md flex items-center justify-center"
                    style={{ backgroundColor: story.color || "#f3f4f6" }}
                  >
                    <p className="text-center p-4">{story.text}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 rounded-md"></div>
                {selectedStories.includes(story.id) ? (
                  <CheckCircle className="absolute top-2 right-2 text-white bg-blue-500 rounded-full" />
                ) : (
                  <Circle className="absolute top-2 right-2 text-white bg-gray-500 bg-opacity-50 rounded-full" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => {
                const name = form.getValues("name");
                if (!name) {
                  form.setError("name", { message: "اسم المجموعة مطلوب" });
                  return;
                }
                onSubmit({ name, stories: selectedStories });
              }}
            >
              تم
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default HighlightForm;
