import Room, { IRoom } from "../models/room.model";
import { CreateRoomDto } from "../DTO/room-request.dto";

import Message from "../models/message.model";
import { consumer, producer } from "../config/kafka";

const kafkaProducer = producer;

// DTO for a new message
export interface PostMessageDto {
  chatId: string;
  senderId: string;
  message: string;
}

export class ChatService {
  constructor() {
    // Ensure producer is connected when service is instantiated
    kafkaProducer.connect().catch(console.error);
  }

  public async postMessage(messageData: PostMessageDto): Promise<any> {
    // 1. Save the message to MongoDB
    // const newMessage = new Message({
    //   room_id: messageData.room_id,
    //   user_id: messageData.user_id,
    //   message_text: messageData.message_text,
    // });
    // const savedMessage = await newMessage.save();

    // 2. Publish the saved message to the 'new-messages' Kafka topic
    await kafkaProducer.send({
      topic: "mongo-chat-messages",
      messages: [{ value: JSON.stringify(messageData) }],
    });
    console.log(`Published message to Kafka:`, messageData);

    return messageData;
  }

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
