import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import People from "./People";
import Chat from "./Chat";
import { type Conversation, conversationAPI } from "@/utils/api/store";

const MessagePage = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
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
  };

  const handleMessageSent = () => {
    // Optionally refresh conversations or handle real-time updates
    console.log("Message sent, you might want to refresh conversations or handle real-time updates");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <People onSelectConversation={handleSelectConversation} selectedConversationId={selectedConversation?.id} />
      <Chat selectedConversation={selectedConversation} onMessageSent={handleMessageSent} />
    </div>
  );
};

export default MessagePage;
