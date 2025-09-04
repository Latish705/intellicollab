export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  user: User;
  isAI?: boolean;
}

export interface Room {
  id: string;
  name: string;
  unreadCount?: number;
}

export interface JoinRequest {
  id: string;
  user: User;
  date: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  members: number;
  avatar: string;
  tags: string[];
  established: string;
}

export type View = "rooms" | "explore";
