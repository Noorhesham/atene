import React, { useState, useEffect } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";
import { conversationAPI, messageAPI, type Conversation } from "@/utils/api/store";

interface PeopleProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: number;
}

// Helper function to get current user ID
const getCurrentUserId = () => {
  // This should return the current logged-in user ID
  // You might get this from your auth context or localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.id;
};

const People: React.FC<PeopleProps> = ({ onSelectConversation, selectedConversationId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await conversationAPI.getConversations();
      console.log("Conversations response:", response);
      if (response.status) {
        setConversations(response.conversations);
      } else {
        setError("Failed to load conversations");
      }
    } catch (err) {
      setError("Failed to load conversations");
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await messageAPI.getUnreadCount();
      if (response.status) {
        setUnreadCount(response.unread_count);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find((p) => p.participant_data.id !== getCurrentUserId());
    return otherParticipant?.participant_data.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get the other participant in a direct conversation
  const getOtherParticipant = (conversation: Conversation) => {
    const currentUserId = getCurrentUserId();
    return conversation.participants.find((p) => p.participant_data.id !== currentUserId);
  };

  // Format the last activity time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("ar-SA");
    }
  };

  if (loading) {
    return (
      <div className="w-full lg:w-1/3 bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-gray-500">جاري تحميل المحادثات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full lg:w-1/3 bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/3 bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">الرسائل</h2>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">{unreadCount}</span>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-full" aria-label="إنشاء محادثة جديدة">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full" aria-label="المزيد من الخيارات">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="البحث في المحادثات"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir="rtl"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="overflow-y-auto h-[calc(100vh-140px)]">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? "لا توجد محادثات مطابقة للبحث" : "لا توجد محادثات بعد"}
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            const isSelected = selectedConversationId === conversation.id;
            const hasUnread = (otherParticipant?.unread_messages_count || 0) > 0;

            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-blue-50 border-r-4 border-r-blue-500" : ""
                }`}
                dir="rtl"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={otherParticipant?.participant_data.avatar || "/placeholder.png"}
                      alt={otherParticipant?.participant_data.name || ""}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {hasUnread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">{otherParticipant?.unread_messages_count}</span>
                      </div>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold truncate ${hasUnread ? "text-gray-900" : "text-gray-700"}`}>
                        {conversation.name || otherParticipant?.participant_data.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">{formatTime(conversation.updated_at)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.type === "direct" ? "محادثة مباشرة" : "محادثة جماعية"}
                      </p>
                      {conversation.participants_count > 2 && (
                        <span className="text-xs text-gray-400">{conversation.participants_count} أعضاء</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default People;
