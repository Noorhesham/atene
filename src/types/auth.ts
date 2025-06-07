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
