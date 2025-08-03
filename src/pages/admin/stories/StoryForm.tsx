import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/inputs/FormInput";
import { useState } from "react";

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
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [previewText, setPreviewText] = useState("");

  const presetColors = [
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
    "#FFD700",
  ];

  const form = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      image: null,
      text: "",
      color: "#000000",
    },
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPreviewText(text);
    form.setValue("text", text);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    form.setValue("color", color);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4    p-4">
        {storyType === "media" && <FormInput photo name="image" label="الصورة" mediaType="image" />}
        {storyType === "text" && (
          <>
            {/* WhatsApp-style Story Preview */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">معاينة القصة</label>
              <div
                className="w-full aspect-[9/16] max-w-[300px] mx-auto rounded-lg overflow-hidden relative"
                style={{ backgroundColor: selectedColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <textarea
                    value={previewText}
                    onChange={handleTextChange}
                    placeholder="اكتب نص قصتك هنا..."
                    className="w-full h-full bg-transparent border-none outline-none resize-none text-center text-white text-2xl font-medium placeholder-white/70 leading-relaxed"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                      WebkitTextStroke: "0.5px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">لون الخلفية</label>
              <div className="flex  m-auto items-center gap-3">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                  aria-label="اختر لون الخلفية"
                />
                <span className="text-sm text-gray-600">{selectedColor}</span>
              </div>

              {/* Preset Colors */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">ألوان سريعة</label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setSelectedColor(color);
                        form.setValue("color", color);
                      }}
                      aria-label={`اختر اللون ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Hidden text input for form submission */}
            <input type="hidden" {...form.register("text")} aria-label="نص القصة" />
            <input type="hidden" {...form.register("color")} aria-label="لون الخلفية" />
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
