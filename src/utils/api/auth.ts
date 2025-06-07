import { API_ENDPOINTS } from "@/constants/api";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types/auth";

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      // If we have validation errors (422)
      if (response.status === 422) {
        throw {
          status: response.status,
          message: "Validation failed",
          errors: data.errors || data.message,
        };
      }

      // For other errors
      throw {
        status: response.status,
        message: data.message || "Login failed",
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    // If it's our formatted error, throw it as is
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }
    // For network errors or other unexpected errors
    throw {
      status: 500,
      message: "An unexpected error occurred",
      errors: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      // If we have validation errors (422)
      if (response.status === 422) {
        throw {
          status: response.status,
          message: "Validation failed",
          errors: data.errors || data.message,
        };
      }

      // For other errors
      throw {
        status: response.status,
        message: data.message || "Registration failed",
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    // If it's our formatted error, throw it as is
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }
    // For network errors or other unexpected errors
    throw {
      status: 500,
      message: "An unexpected error occurred",
      errors: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
