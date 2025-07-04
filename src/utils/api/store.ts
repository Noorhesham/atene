import { API_BASE_URL } from "@/constants/api";
import { ReviewsResponse } from "@/types/product";

export const getStoreReviews = async (storeId: string): Promise<ReviewsResponse> => {
  const response = await fetch(`${API_BASE_URL}/reviews/store/${storeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch store reviews");
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
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

// Conversation API Functions
export const conversationAPI = {
  // Get all conversations for the current user
  getConversations: async (): Promise<ConversationsResponse> => {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data; // Return the full response object which contains { status, message, conversations }
  },

  // Create a new conversation
  createConversation: async (data: {
    type: "direct" | "group";
    participants: { type: "user" | "store"; id: number }[];
  }) => {
    console.log("Creating conversation with data:", data);

    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: "POST",
      headers: getAuthHeaders(),
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
  updateConversation: async (conversationId: number, data: { name?: string }) => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
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
  addParticipant: async (conversationId: number, data: { type: "user"; id: number }) => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/participants`, {
      method: "POST",
      headers: getAuthHeaders(),
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
  removeParticipant: async (conversationId: number, participantId: number) => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/participants/${participantId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
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
  // Send a message
  sendMessage: async (data: {
    conversation_id: number;
    participant_type: "user" | "store";
    participant_id: number;
    body?: string;
    file?: File;
  }) => {
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

    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

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
  markAsSeen: async (messageId: number) => {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/seen`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to mark message as seen");
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await fetch(`${API_BASE_URL}/unread-count`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch unread count");
    }
    const data = await response.json();
    console.log(data);
    return data;
  },
};
