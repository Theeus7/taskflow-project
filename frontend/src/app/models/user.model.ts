export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
}