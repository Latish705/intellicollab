import http from "http";
import { Server } from "socket.io";
import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { kafka } from "./config/kafka";
import { ChatService } from "./services/chat.service";

dotenv.config();

const PORT = process.env.PORT || 4002;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Configure for your client's origin in production
    methods: ["GET", "POST"],
  },
});

const chatService = new ChatService();
const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: "chat-service-group" });

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });

  socket.on("newMessage", async (data) => {
    // When a message is received from a client,
    // hand it off to the service to be saved and published to Kafka.
    try {
      await chatService.postMessage(data);
    } catch (error) {
      console.error("Failed to process new message:", error);
      // Optionally, emit an error back to the sender
      socket.emit("messageError", { message: "Failed to send message." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const run = async () => {
  await connectDB();
  await kafkaProducer.connect();

  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topic: "new-messages", fromBeginning: true });

  await kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      const chatMessage = JSON.parse(message.value.toString());

      // Broadcast the message from Kafka to all clients in the specific room
      io.to(chatMessage.room_id).emit("message", chatMessage);
      console.log(
        `Broadcasted message ${chatMessage._id} to room ${chatMessage.room_id}`
      );
    },
  });

  server.listen(PORT, () => {
    console.log(`Chat service server with WebSockets running at ${PORT}`);
  });
};

run().catch(console.error);
