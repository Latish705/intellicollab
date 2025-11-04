import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

const chatRoutes = Router();
const chatController = new ChatController();

// This defines the endpoint: POST /rooms
chatRoutes.post("/rooms", chatController.createRoom);
chatRoutes.post("/messages", chatController.postMessage);

// We will add more routes here later (e.g., for getting messages)

export default chatRoutes;
