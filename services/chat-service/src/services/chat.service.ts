import Room, { IRoom } from "../models/room.model";
import { CreateRoomDto } from "../DTO/room-request.dto";

export class ChatService {
  /**
   * Creates a new chat room.
   * @param roomData - The data for the new room.
   * @returns The newly created room document.
   */
  public async createRoom(roomData: CreateRoomDto): Promise<IRoom> {
    try {
      const newRoom = new Room({
        name: roomData.name,
        description: roomData.description,
        organisation_id: roomData.organisation_id,
        created_by_user_id: roomData.created_by_user_id,
        is_private: roomData.is_private || false,
      });

      await newRoom.save();
      return newRoom;
    } catch (error) {
      // In a real app, you'd have more sophisticated logging and error handling
      console.error("Error creating room:", error);
      throw new Error("Could not create room.");
    }
  }

  // We will add more methods here later, like `postMessage`, `getMessages`, etc.
}
