export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  message?: string;
}

export interface CheckEmailResponse {
  exists: boolean;
}
