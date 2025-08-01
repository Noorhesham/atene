export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  fullname: string;
  phone: string;
  gender: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullname: string;
  };
}
export interface Role {
  name: string;
  id: number;
  guard_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

export interface User {
  user: {
    roles: Role[];
    id: number;
    email: string;
    fullname: string;
    avatar: string;
    gender: string;
    is_active: number;
    phone: string | null;
    referral_code: string | null;
    last_login_at: string;
    user_type: "admin" | "merchant" | "client";
  };
}
