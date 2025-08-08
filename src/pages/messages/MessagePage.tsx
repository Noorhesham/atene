import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import People from "./People";
import Chat from "./Chat";
import { type Conversation, conversationAPI } from "@/utils/api/store";

// Default state component when no chat is selected
const DefaultChatState = () => {
  return (
    <div className="flex-1 flex flex-col bg-white items-center justify-center p-8" dir="rtl">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">نصائح عامة</h2>

        <div className="space-y-6 text-right">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 font-bold text-lg">1.</span>
            <p className="text-gray-700">احترم في الأخلاق العامة فقط</p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-blue-500 font-bold text-lg">2.</span>
            <p className="text-gray-700">لا تتم بإرسال أعمال مسيئة</p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-blue-500 font-bold text-lg">3.</span>
            <p className="text-gray-700">قم بتنفيذ المنتج جيداً قبل شرائه</p>
          </div>
        </div>

        <div className="mt-12 text-gray-500">
          <p className="text-sm">اختر محادثة من القائمة لبدء المراسلة</p>
        </div>
      </div>
    </div>
  );
};

const MessagePage = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const location = useLocation();

  // Handle navigation state (when coming from product page)
  useEffect(() => {
    const state = location.state as {
      conversationId?: number;
      storeName?: string;
      storeAvatar?: string;
    } | null;

    if (state?.conversationId) {
      // Fetch the specific conversation and auto-select it
      const loadConversation = async () => {
        try {
          const response = await conversationAPI.getConversations();
          if (response.status) {
            const conversation = response.conversations.find((conv) => conv.id === state.conversationId);
            if (conversation) {
              setSelectedConversation(conversation);
              setShowMobileChat(true); // Show chat on mobile when auto-selecting
            }
          }
        } catch (error) {
          console.error("Error loading conversation:", error);
        }
      };

      loadConversation();
    }
  }, [location.state]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true); // Show chat on mobile when selecting
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedConversation(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 w-full">
      {/* People List - Hidden on mobile when chat is shown */}
      <div className={`${showMobileChat ? "hidden lg:flex" : "flex"} lg:flex`}>
        <People onSelectConversation={handleSelectConversation} selectedConversationId={selectedConversation?.id} />
      </div>

      {/* Chat Area - Show default state or selected chat */}
      <div className={`${showMobileChat ? "flex" : "hidden lg:flex"} lg:flex flex-1`}>
        {selectedConversation ? (
          <Chat selectedConversation={selectedConversation} onBack={handleBackToList} />
        ) : (
          <DefaultChatState />
        )}
      </div>
    </div>
  );
};

export default MessagePage;
