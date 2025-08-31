import { User as FirebaseUser } from "firebase/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  is_premium: boolean;
  created_at: string;
  firebase_uid?: string;
}

export interface Room {
  _id: string;
  name: string;
  description?: string;
  organisation_id: string;
  created_by_user_id: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  _id: string;
  room_id: string;
  user_id: string;
  message_text: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export interface CreateRoomDto {
  name: string;
  description?: string;
  organisation_id: string;
  created_by_user_id: string;
  is_private?: boolean;
}

export interface AuthContextType {
  user: User | null;
  firebaseUser?: FirebaseUser | null;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: RegisterUserDto) => Promise<any>;
  logout: () => void;
  loading: boolean;
}
