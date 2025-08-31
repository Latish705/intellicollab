import { Request, Response, NextFunction } from "express";
import { ChatService } from "../services/chat.service";
import { CreateRoomDto } from "../DTO/room-request.dto";

export class ChatController {
  private chatService = new ChatService();

  public createRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // We get the user ID from a header set by the API Gateway after it verifies the JWT
      const userId = req.headers["x-user-id"] as string;

      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User ID missing" });
      }

      const roomData: CreateRoomDto = {
        ...req.body,
        created_by_user_id: userId, // Set the creator from the trusted header
      };

      const newRoom = await this.chatService.createRoom(roomData);

      res.status(201).json({ success: true, room: newRoom });
    } catch (error) {
      next(error);
    }
  };
}
