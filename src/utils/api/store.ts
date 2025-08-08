import { API_BASE_URL } from "@/constants/api";
import { ReviewsResponse } from "@/types/product";

/**
 * Store API utilities
 *
 * All API functions now automatically include the store_id header from localStorage
 * when no explicit storeId is provided. This ensures proper store context for all requests.
 *
 * For revalidation when store changes, use getStoreIdForRevalidation() as a query key
 * or dependency in your React Query hooks.
 */

// Helper function to get current store ID from localStorage
const getCurrentStoreId = (): string | null => {
  return localStorage.getItem("storeId");
};

// Utility function to get headers with current store ID
export const getCurrentStoreHeaders = () => {
  return getAuthHeaders();
};

// Utility function to check if store ID has changed (for revalidation)
export const getStoreIdForRevalidation = (): string => {
  return getCurrentStoreId() || "";
};

export const getStoreReviews = async (storeId: string): Promise<ReviewsResponse> => {
  const response = await fetch(`${API_BASE_URL}/reviews/store/${storeId}`, {
    headers: getAuthHeaders(storeId),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch store reviews");
  }
  return response.json();
};

const getAuthHeaders = (storeId?: string) => {
  const token = localStorage.getItem("token");
  const currentStoreId = storeId || getCurrentStoreId();

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(currentStoreId && { store_id: currentStoreId }),
  };
};

// Conversation Types
export interface Participant {
  id: number;
  conversation_id: number;
  participant_data: {
    id: number;
    name: string;
    avatar: string | null;
    slug?: string; // For stores
  };
  unread_messages_count: number;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  type: "direct" | "group";
  name: string | null;
  owner_type: "user" | "store";
  owner_id: number;
  participants_count: number;
  participants: Participant[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  file?: string;
  seen: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationsResponse {
  status: boolean;
  message: string;
  conversations: Conversation[];
}

export interface UnreadCountResponse {
  status: boolean;
  message: string;
  unread_count: number;
}

export interface MessagesResponse {
  status: boolean;
  message: string;
  messages: Message[];
}

// Conversation API Functions
export const conversationAPI = {
  // Get all conversations for the current user
  getConversations: async (storeId?: string): Promise<ConversationsResponse> => {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: "GET",
      headers: getAuthHeaders(storeId),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data; // Return the full response object which contains { status, message, conversations }
  },

  // Create a new conversation
  createConversation: async (
    data: {
      type: "direct" | "group";
      participants: { type: "user" | "store"; id: number }[];
    },
    storeId?: string
  ) => {
    console.log("Creating conversation with data:", data);

    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: "POST",
      headers: getAuthHeaders(storeId),
      body: JSON.stringify(data),
    });

    console.log("Response status:", response);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      let errorMessage = "Failed to create conversation";
      try {
        const errorData = await response.json();
        console.log("Error response data:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch {
        console.log("Could not parse error response as JSON");
      }
      throw new Error(errorMessage);
    }

    const datares = await response.json();
    console.log("Success response data:", datares);
    return datares;
  },

  // Update conversation
  updateConversation: async (conversationId: number, data: { name?: string }, storeId?: string) => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: "PATCH",
      headers: getAuthHeaders(storeId),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update conversation");
    }

    const datares = await response.json();
    console.log(datares);
    return datares;
  },

  // Add participant to conversation
  addParticipant: async (conversationId: number, data: { type: "user"; id: number }, storeId?: string) => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/participants`, {
      method: "POST",
      headers: getAuthHeaders(storeId),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to add participant");
    }

    const datares = await response.json();
    console.log(datares);
    return datares;
  },

  // Remove participant from conversation
  removeParticipant: async (conversationId: number, participantId: number, storeId?: string) => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/participants/${participantId}`, {
      method: "DELETE",
      headers: getAuthHeaders(storeId),
    });

    if (!response.ok) {
      throw new Error("Failed to remove participant");
    }
    const data = await response.json();
    console.log(data);
    return data;
  },
};

// Message API Functions
export const messageAPI = {
  // Get messages for a conversation
  getMessages: async (conversationId: number, storeId?: string): Promise<MessagesResponse> => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      method: "GET",
      headers: getAuthHeaders(storeId),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    console.log("Messages API Response:", data);
    return data;
  },

  // Send a message
  sendMessage: async (
    data: {
      conversation_id: number;
      participant_type: "user" | "store";
      participant_id: number;
      body?: string;
      file?: File;
    },
    storeId?: string
  ) => {
    // const formData = new FormData();
    // formData.append("conversation_id", data.conversation_id.toString());
    // formData.append("participant_type", data.participant_type);
    // formData.append("participant_id", data.participant_id.toString());

    // if (data.body) {
    //   formData.append("body", data.body);
    // }

    // if (data.file) {
    //   formData.append("file", data.file);
    // }

    console.log("Sending message with data:", data);

    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: getAuthHeaders(storeId),
      body: JSON.stringify(data),
    });
    console.log(response);
    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.message || "Failed to send message");
    }
    const datares = await response.json();
    console.log(datares);
    return datares;
  },

  // Mark message as seen
  markAsSeen: async (messageId: number, storeId?: string) => {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/seen`, {
      method: "POST",
      headers: getAuthHeaders(storeId),
    });

    if (!response.ok) {
      throw new Error("Failed to mark message as seen");
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  // Get unread count
  getUnreadCount: async (storeId?: string): Promise<UnreadCountResponse> => {
    const response = await fetch(`${API_BASE_URL}/unread-count`, {
      method: "GET",
      headers: getAuthHeaders(storeId),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch unread count");
    }
    const data = await response.json();
    console.log(data);
    return data;
  },
};
