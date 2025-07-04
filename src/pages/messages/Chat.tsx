import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, ArrowLeft } from "lucide-react";
import ChatForm from "./ChatForm";
import { messageAPI, type Conversation } from "@/utils/api/store";
import { useAuth } from "@/context/AuthContext";

interface ChatProps {
  selectedConversation: Conversation;
  onBack: () => void;
}

interface MessageData {
  id: number;
  conversation_id: number;
  body: string;
  file: string | null;
  file_url: string | null;
  sender_id: number;
  product_id: number | null;
  variation_id: number | null;
  sender_data: {
    id: number;
    participant_type: "user" | "store";
    participant_id: number;
  };
  created_at: string;
  updated_at: string;
}

interface MessagesResponse {
  status: boolean;
  message: string;
  messages: MessageData[];
  product: null | object;
  variation: null | object;
}

const Chat: React.FC<ChatProps> = ({ selectedConversation, onBack }) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [shouldScroll, setShouldScroll] = useState(false);

  // Get the other participant in the conversation
  const getOtherParticipant = (conversation: Conversation) => {
    const currentUserId = user?.id;
    return conversation?.participants?.find((p) => p.participant_data.id !== currentUserId);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages for the selected conversation
  const fetchMessages = async () => {
    if (!selectedConversation) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "https://aatene.com/api"}/conversations/${
          selectedConversation.id
        }/messages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data: MessagesResponse = await response.json();

      if (data.status) {
        setMessages(data.messages);
      } else {
        setError("Failed to load messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("فشل في تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  };

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation]);

  // Scroll to bottom when messages change, but only when requested
  useEffect(() => {
    if (shouldScroll) {
      scrollToBottom();
      setShouldScroll(false);
    }
  }, [messages, shouldScroll]);

  // Handle message sent
  const handleMessageSent = () => {
    setShouldScroll(true);
    fetchMessages();
  };

  // Mark messages as seen when conversation is opened
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      const currentUserId = user?.id;
      const unseenMessages = messages.filter((msg) => msg.sender_id !== currentUserId);

      unseenMessages.forEach(async (msg) => {
        try {
          await messageAPI.markAsSeen(msg.id);
        } catch (err) {
          console.error("Error marking message as seen:", err);
        }
      });
    }
  }, [selectedConversation, messages, user]);

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
  const renderMessageContent = (message: MessageData) => {
    const currentUserId = user?.id;
    const isOwnMessage = message.sender_id === currentUserId;

    return (
      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`} dir="rtl">
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {message.file_url && (
            <div className="mb-2">
              {message.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img src={message.file_url} alt="صورة مرفقة" className="rounded-lg max-w-full h-auto" />
              ) : (
                <a
                  href={message.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 underline"
                >
                  ملف مرفق
                </a>
              )}
            </div>
          )}

          {message.body && <p className="text-sm">{message.body}</p>}

          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
              {formatMessageTime(message.created_at)}
            </span>
            {isOwnMessage && <span className={`text-xs text-blue-100`}>✓</span>}
          </div>
        </div>
      </div>
    );
  };

  const otherParticipant = getOtherParticipant(selectedConversation);

  // Check if the other participant is a store (has slug field)
  const isStore = "slug" in (otherParticipant?.participant_data || {});

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              aria-label="العودة للقائمة"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <img
              src={otherParticipant?.participant_data.avatar || "/placeholder.png"}
              alt={otherParticipant?.participant_data.name || ""}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800">
                {selectedConversation?.name || otherParticipant?.participant_data?.name}
              </h3>
              <p className="text-sm text-gray-500">{isStore ? "متجر" : "عميل"}</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="p-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-full"
              aria-label="المزيد من الخيارات"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto !h-[calc(100vh-140px)] p-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-[80%]">
            <div className="text-gray-500">جاري تحميل الرسائل...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[80%]">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button
                onClick={fetchMessages}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-[80%]">
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
      <ChatForm conversationId={selectedConversation?.id} onMessageSent={handleMessageSent} />
    </div>
  );
};

export default Chat;
