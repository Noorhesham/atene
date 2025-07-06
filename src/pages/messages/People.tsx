import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import { conversationAPI, messageAPI, type Conversation } from "@/utils/api/store";
import { useAuth } from "@/context/AuthContext";

interface PeopleProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: number;
}

// Helper function to get current user ID

const People: React.FC<PeopleProps> = ({ onSelectConversation, selectedConversationId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  // Fetch conversations and unread count on component mount
  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      // Fallback to calculating from conversations
      setUnreadCount(12); // Default fallback
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find((p) => p.participant_data.id !== user?.user?.id);
    return otherParticipant?.participant_data.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get the other participant in a direct conversation
  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.participant_data.id !== user?.user?.id);
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

  // Calculate total unread messages from conversations
  const totalUnreadFromConversations = conversations.reduce((total, conversation) => {
    const otherParticipant = getOtherParticipant(conversation);
    return total + (otherParticipant?.unread_messages_count || 0);
  }, 0);

  // Get read messages count
  const readCount = Math.max(0, unreadCount - totalUnreadFromConversations);

  if (loading) {
    return (
      <div className="w-full  bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-gray-500">جاري تحميل المحادثات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full  bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="w-full  bg-white border-l border-gray-200">
      <div className="flex items-center justify-between py-2 px-4 border-b border-gray-200">
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 cursor-pointer relative"
          ref={dropdownRef}
        >
          <h2 className="text-base font-bold">رسائل</h2>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
          <span className="text-sm text-black p-1 px-2 font-bold bg-[#F3F3F3] rounded-full">{unreadCount}</span>

          {/* Messages Dropdown */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-0 z-10 min-w-[200px]">
              <div className="divide-y divide-gray-100">
                <div className="flex justify-between items-center p-3 bg-blue-50">
                  <span className="text-sm text-gray-700">الكل</span>
                  <span className="text-sm font-bold text-gray-800 bg-gray-200 px-2 py-1 rounded-full min-w-[24px] text-center">
                    {unreadCount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3">
                  <span className="text-sm text-gray-700">غير مقروءة</span>
                  <span className="text-sm font-bold text-white bg-red-500 px-2 py-1 rounded-full min-w-[24px] text-center">
                    {totalUnreadFromConversations}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3">
                  <span className="text-sm text-gray-700">مقروءة</span>
                  <span className="text-sm font-bold text-white bg-green-500 px-2 py-1 rounded-full min-w-[24px] text-center">
                    {readCount}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white"
          aria-label="إنشاء محادثة جديدة"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative p-4">
        <Search className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="رسائل البحث"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir="rtl"
        />
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
            const hasUnreadMessages = (otherParticipant?.unread_messages_count || 0) > 0;
            console.log(otherParticipant);
            // Check if the other participant is a store (has slug field)
            const isStore = "slug" in (otherParticipant?.participant_data || {});

            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-[#213851]" : ""
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  {/* Right Section: Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center ring-2 ring-cyan-400 p-0.5">
                      <img
                        src={otherParticipant?.participant_data.avatar || "/placeholder.png"}
                        alt={otherParticipant?.participant_data.name || ""}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Middle Section: Name, Subtitle, Buttons */}
                  <div className="flex flex-col mx-3 flex-grow text-right">
                    <h3 className={`font-bold text-lg ${isSelected ? "text-white" : "text-gray-800"}`}>
                      {conversation.name || otherParticipant?.participant_data.name}
                    </h3>
                    <p className={`text-sm ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                      {isStore ? "السعر شامل التوصيل" : "عميل"}
                    </p>
                    <div className="flex items-center ml-auto self-end gap-2 mt-2">
                      <button className="text-[12px] bg-[#E6F5F2] text-[#38A169] font-semibold rounded-full px-4 py-1.5">
                        مطلوب مساعدة
                      </button>
                      <button className="text-[12px] bg-[#FFF2E6] text-[#D97706] font-semibold rounded-full px-4 py-1.5">
                        سؤال
                      </button>
                    </div>
                  </div>

                  {/* Left Section: Time and status indicator */}
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className={`text-xs whitespace-nowrap ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                      {formatTime(conversation.updated_at)}
                    </span>
                    {hasUnreadMessages && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                    {/* {hasUnreadMessages>0 ? (
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                    ) : (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    )} */}
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
