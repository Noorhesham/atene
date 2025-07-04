import React, { useState, useRef } from "react";
import { Send, Image, Mic, X } from "lucide-react";
import { messageAPI } from "@/utils/api/store";
import { useAuth } from "@/context/AuthContext";

interface ChatFormProps {
  conversationId: number;
  onMessageSent?: () => void;
}

const ChatForm: React.FC<ChatFormProps> = ({ conversationId, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("حجم الملف يجب أن يكون أقل من 10 ميجابايت");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && !selectedFile) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!user || !user.user?.id) {
        throw new Error("يرجى تسجيل الدخول مرة أخرى");
      }

      const response = await messageAPI.sendMessage({
        conversation_id: conversationId,
        participant_type: "user",
        participant_id: user.user?.id,
        body: message.trim() || undefined,
        file: selectedFile || undefined,
      });

      console.log("Message sent successfully:", response);

      setMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "فشل في إرسال الرسالة. حاول مرة أخرى.";
      setError(errorMessage);
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 p-2 mb-24 bg-white">
      {error && (
        <div className="mb-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">{error}</div>
      )}

      {selectedFile && (
        <div className="mb-2 p-2 bg-gray-100 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 truncate max-w-xs">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
          <button onClick={removeSelectedFile} className="p-1 hover:bg-gray-200 rounded" aria-label="إزالة الملف">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2" dir="rtl">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          aria-label="اختيار ملف للإرفاق"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-blue-500 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="إرفاق ملف"
          disabled={isLoading}
        >
          <Image className="w-6 h-6" />
        </button>

        <button
          type="button"
          className="p-2 text-blue-500 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="إرسال رسالة صوتية"
          disabled={isLoading}
        >
          <Mic className="w-6 h-6" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="... نص الرساله"
            className="w-full p-3 pr-4 border-none bg-gray-100 rounded-full resize-none focus:outline-none"
            dir="rtl"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={(!message.trim() && !selectedFile) || isLoading}
          className="p-2 w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
          aria-label="إرسال الرسالة"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
