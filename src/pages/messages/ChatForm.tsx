import React, { useState, useRef } from "react";
import { Send, Paperclip, Smile, X } from "lucide-react";
import { messageAPI } from "@/utils/api/store";

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

  // Get current user info with validation
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("User data not found");
      }
      const user = JSON.parse(userStr);
      if (!user || !user.id) {
        throw new Error("Invalid user data");
      }
      return user;
    } catch (err) {
      console.error("Error getting user data:", err);
      throw new Error("يرجى تسجيل الدخول مرة أخرى");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
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

    // Don't send if no message and no file
    if (!message.trim() && !selectedFile) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current user with validation
      const currentUser = getCurrentUser();

      if (!currentUser || !currentUser.id) {
        throw new Error("يرجى تسجيل الدخول مرة أخرى");
      }

      const response = await messageAPI.sendMessage({
        conversation_id: conversationId,
        participant_type: "user",
        participant_id: currentUser.id,
        body: message.trim() || undefined,
        file: selectedFile || undefined,
      });

      console.log("Message sent successfully:", response);

      // Reset form
      setMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Notify parent component that message was sent
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
    <div className="border-t border-gray-200 p-4 bg-white">
      {/* Error Message */}
      {error && (
        <div className="mb-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">{error}</div>
      )}

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mb-2 p-2 bg-gray-100 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 truncate max-w-xs">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
          <button onClick={removeSelectedFile} className="p-1 hover:bg-gray-200 rounded" aria-label="إزالة الملف">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* File Upload */}
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
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="إرفاق ملف"
          disabled={isLoading}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك..."
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            style={{ minHeight: "44px", maxHeight: "120px" }}
            dir="rtl"
            disabled={isLoading}
          />

          {/* Emoji Button */}
          <button
            type="button"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="إضافة رموز تعبيرية"
            disabled={isLoading}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!message.trim() && !selectedFile) || isLoading}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          aria-label="إرسال الرسالة"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* File Type Info */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        يمكنك إرفاق الصور، الفيديوهات، الملفات الصوتية، PDF، Word، أو ملفات نصية (حد أقصى 10 MB)
      </div>
    </div>
  );
};

export default ChatForm;
