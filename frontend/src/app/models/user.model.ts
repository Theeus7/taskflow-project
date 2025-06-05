export interface User {
  id: number;
  username: string;
  email: string;
  role?: 'user' | 'admin';
  profile_image?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface UserProfileUpdate {
  username?: string;
  email?: string;
  current_password?: string;
  new_password?: string;
  profile_image?: string;
  role?: 'user' | 'admin';
}