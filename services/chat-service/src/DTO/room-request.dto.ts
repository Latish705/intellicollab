export interface CreateRoomDto {
  name: string;
  description?: string;
  organisation_id: string;
  created_by_user_id: string; // This will be passed from the JWT token
  is_private?: boolean;
}
