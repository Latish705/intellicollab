export interface User {
  id: string;
  name: string;
  email: string;
  is_premium: boolean;
  created_at: string;
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
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserDto) => Promise<void>;
  logout: () => void;
  loading: boolean;
}