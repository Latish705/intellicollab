import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

const chatRoutes = Router();
const chatController = new ChatController();

// This defines the endpoint: POST /rooms
chatRoutes.post("/rooms", chatController.createRoom);

// We will add more routes here later (e.g., for getting messages)

export default chatRoutes;
