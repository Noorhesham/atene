import React, { useState, useEffect, useRef } from "react";
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import ChatForm from "./ChatForm";
import { messageAPI, type Conversation, type Message } from "@/utils/api/store";

interface ChatProps {
  selectedConversation: Conversation | null;
  onMessageSent?: () => void;
}

const Chat: React.FC<ChatProps> = ({ selectedConversation, onMessageSent }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper function to get current user ID
  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id;
  };

  // Get the other participant in the conversation
  const getOtherParticipant = (conversation: Conversation) => {
    const currentUserId = getCurrentUserId();
    return conversation.participants.find((p) => p.participant_data.id !== currentUserId);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages for the selected conversation
  useEffect(() => {
    if (selectedConversation) {
      // In a real implementation, you would fetch messages for this conversation
      // For now, we'll use mock data since you didn't provide a messages endpoint
      setMessages([]);
      setLoading(false);
    }
  }, [selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle message sent
  const handleMessageSent = () => {
    // Refresh messages or handle real-time updates
    if (onMessageSent) {
      onMessageSent();
    }

    // In a real app, you might want to refresh the messages list
    // or handle real-time updates via WebSocket
  };

  // Mark messages as seen when conversation is opened
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      const unseenMessages = messages.filter((msg) => !msg.seen && msg.sender_id !== getCurrentUserId());
      unseenMessages.forEach(async (msg) => {
        try {
          await messageAPI.markAsSeen(msg.id);
        } catch (err) {
          console.error("Error marking message as seen:", err);
        }
      });
    }
  }, [selectedConversation, messages]);

  // Format message time
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format message date
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "اليوم";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "أمس";
    } else {
      return date.toLocaleDateString("ar-SA");
    }
  };

  // Render message content
  const renderMessageContent = (message: Message) => {
    const currentUserId = getCurrentUserId();
    const isOwnMessage = message.sender_id === currentUserId;

    return (
      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`} dir="rtl">
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {message.file && (
            <div className="mb-2">
              {message.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img src={message.file} alt="صورة مرفقة" className="rounded-lg max-w-full h-auto" />
              ) : (
                <a href={message.file} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                  ملف مرفق
                </a>
              )}
            </div>
          )}

          {message.content && <p className="text-sm">{message.content}</p>}

          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
              {formatMessageTime(message.created_at)}
            </span>
            {isOwnMessage && (
              <span className={`text-xs ${message.seen ? "text-blue-100" : "text-blue-200"}`}>
                {message.seen ? "✓✓" : "✓"}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-semibold mb-2">مرحباً بك في الرسائل</h3>
          <p>اختر محادثة لبدء المراسلة</p>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant(selectedConversation);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full" aria-label="العودة للقائمة">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            <img
              src={otherParticipant?.participant_data.avatar || "/placeholder.png"}
              alt={otherParticipant?.participant_data.name || ""}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <h3 className="font-semibold text-gray-800">
                {selectedConversation.name || otherParticipant?.participant_data.name}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedConversation.type === "direct" ? "متصل" : `${selectedConversation.participants_count} أعضاء`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full" aria-label="مكالمة صوتية">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full" aria-label="مكالمة فيديو">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full" aria-label="المزيد من الخيارات">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">جاري تحميل الرسائل...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h4 className="font-semibold mb-2">ابدأ المحادثة</h4>
              <p>ابعث برسالتك الأولى لبدء المحادثة</p>
            </div>
          </div>
        ) : (
          <div>
            {messages.map((message, index) => {
              // Show date separator if it's a new day
              const showDateSeparator =
                index === 0 ||
                formatMessageDate(message.created_at) !== formatMessageDate(messages[index - 1].created_at);

              return (
                <div key={message.id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {formatMessageDate(message.created_at)}
                      </span>
                    </div>
                  )}
                  {renderMessageContent(message)}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatForm conversationId={selectedConversation.id} onMessageSent={handleMessageSent} />
    </div>
  );
};

export default Chat;
