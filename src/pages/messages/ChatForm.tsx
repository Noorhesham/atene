import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import ChatInput from "@/components/inputs/ChatInput";
import { Send, Paperclip, Mic } from "lucide-react";

// Define the schema for chat message validation using Zod
const messageSchema = z.object({
  message: z.string().min(1, "الرسالة مطلوبة"),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface ChatFormProps {
  selectedPerson: string | null;
}

const ChatForm: React.FC<ChatFormProps> = ({ selectedPerson }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Setup form with react-hook-form
  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const { handleSubmit, reset, watch } = form;
  const messageValue = watch("message");

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  // Remove a selected file
  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Handle sending a message
  const onSubmit = (data: MessageFormData) => {
    if (!selectedPerson) return;

    // In a real app, this would send to an API with the message and any files
    console.log(`Sending message to ${selectedPerson}: ${data.message}`);
    console.log("With files:", selectedFiles);

    // Reset the form and selected files
    reset();
    setSelectedFiles([]);
  };

  return (
    <>
      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 border-t flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative w-16 h-16 rounded overflow-hidden bg-gray-100">
              {file.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                  {file.name.slice(0, 6)}...
                </div>
              )}
              <button
                type="button"
                className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                onClick={() => removeFile(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area with Form */}
      <div className="border-t bg-white p-2">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
            />
            <div className="flex items-center gap-1">
              <button type="button" className="p-2 text-gray-500 hover:text-gray-700" onClick={openFileDialog}>
                <Paperclip className="h-6 w-6 text-gray-500" />
              </button>
              <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                <Mic className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 mx-2">
              <ChatInput name="message" placeholder="نص الرسالة ..." />
            </div>

            <button
              type="submit"
              className="p-2 text-blue-500 hover:text-blue-700 bg-[#F1F1F5] rounded-full"
              disabled={!messageValue && selectedFiles.length === 0}
            >
              <Send className="h-6 w-6 text-primary" />
            </button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ChatForm;
