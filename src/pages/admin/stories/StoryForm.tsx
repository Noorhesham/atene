import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/inputs/FormInput";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPreview, setShowPreview] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");

  const form = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      image: null,
      text: "",
      color: "#000000",
    },
  });

  const watchedText = form.watch("text");
  const watchedColor = form.watch("color") || "#000000";

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    form.setValue("color", color);
  };

  const handleSubmit = async (data: StoryFormData) => {
    await onSubmit({ ...data, color: selectedColor });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4">
        {storyType === "media" && <FormInput photo name="image" label="الصورة" mediaType="image" />}

        {storyType === "text" && (
          <>
            {/* Color Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">لون الخلفية</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  "#000000",
                  "#FF0000",
                  "#00FF00",
                  "#0000FF",
                  "#FFFF00",
                  "#FF00FF",
                  "#00FFFF",
                  "#FFA500",
                  "#800080",
                  "#008000",
                  "#FFC0CB",
                  "#A52A2A",
                  "#808080",
                  "#FFFFFF",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? "border-gray-800" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* WhatsApp-style Story Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">نص القصة</label>
              <div
                className="relative w-full h-64 rounded-lg overflow-hidden"
                style={{ backgroundColor: selectedColor }}
              >
                <textarea
                  {...form.register("text")}
                  placeholder="اكتب نص قصتك هنا..."
                  className="absolute inset-0 w-full h-full p-4 text-center text-white placeholder-white/70 resize-none bg-transparent border-none outline-none text-lg font-medium"
                  style={{
                    textShadow: selectedColor === "#FFFFFF" ? "2px 2px 4px rgba(0,0,0,0.5)" : "none",
                  }}
                />
              </div>
            </div>

            {/* Preview Toggle */}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPreview ? "إخفاء المعاينة" : "معاينة القصة"}
              </Button>
            </div>

            {/* Preview */}
            {showPreview && watchedText && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-medium mb-2">معاينة القصة:</h4>
                <div
                  className="w-full h-32 rounded-lg flex items-center justify-center p-4"
                  style={{ backgroundColor: watchedColor }}
                >
                  <p
                    className="text-white text-center text-lg font-medium"
                    style={{
                      textShadow: watchedColor === "#FFFFFF" ? "2px 2px 4px rgba(0,0,0,0.5)" : "none",
                    }}
                  >
                    {watchedText}
                  </p>
                </div>
              </div>
            )}
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
