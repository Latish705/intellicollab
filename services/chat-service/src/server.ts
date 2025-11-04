import http from "http";
import { Server } from "socket.io";
import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { admin, consumer, producer } from "./config/kafka";
import { ChatService, PostMessageDto } from "./services/chat.service";

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
const kafkaProducer = producer;
const kafkaConsumer = consumer;

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Listen for a user joining a room
  socket.on("joinRoom", (chatId: string) => {
    console.log(`🚪 Client ${socket.id} joining room ${chatId}`);
    socket.join(chatId);
    console.log(`✅ Client ${socket.id} successfully joined room ${chatId}`);
    console.log(
      `👥 Total clients in room ${chatId}:`,
      io.sockets.adapter.rooms.get(chatId)?.size || 0
    );
  });

  // Listen for a new message from a client
  socket.on("newMessage", async (messageData: PostMessageDto) => {
    try {
      // The userId should be passed in messageData,
      // ideally after being decoded from the token that established the socket connection
      console.log("Received new message:", messageData);

      // This saves to DB and publishes to Kafka
      const savedMessage = await chatService.postMessage(messageData);

      // Emit confirmation back to sender
      socket.emit("messageConfirmed", { messageId: savedMessage._id });
    } catch (error) {
      console.error(`Error handling message from ${socket.id}:`, error);
      // Optionally, emit an error back to the sender
      socket.emit("messageError", { message: "Failed to send message." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Add this new function
const initKafkaTopic = async () => {
  await admin.connect();
  const topics = await admin.listTopics();
  const topicName = process.env.KAFKA_TOPIC || "new-messages";

  if (!topics.includes(topicName)) {
    console.log(`Topic "${topicName}" does not exist, creating it...`);
    await admin.createTopics({
      topics: [
        {
          topic: topicName,
          numPartitions: 1, // Start with 1, can increase later
          replicationFactor: 1, // In dev, this is 1. In production, should be 3.
        },
      ],
    });
    console.log(`Topic "${topicName}" created successfully.`);
  } else {
    console.log(`Topic "${topicName}" already exists.`);
  }
  await admin.disconnect();
};

const run = async () => {
  try {
    await connectDB();

    console.log("Initializing Kafka topic...");
    await initKafkaTopic();

    console.log("Connecting to Kafka producer...");
    await kafkaProducer.connect();

    console.log("Connecting to Kafka consumer...");
    try {
      await kafkaConsumer.connect();
      console.log("Kafka consumer connected successfully");

      await kafkaConsumer.subscribe({
        topic: "mongo-chat-messages",
        fromBeginning: true,
      });
      console.log("Subscribed to 'new-messages' topic");

      await kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }: any) => {
          try {
            if (!message.value) return;

            const chatMessage = JSON.parse(message.value.toString());

            // Convert chatId to string if it's an ObjectId
            const chatId = chatMessage.chatId.toString
              ? chatMessage.chatId.toString()
              : chatMessage.chatId;

            console.log(`📨 Kafka message received:`, chatMessage);
            console.log(`📤 Broadcasting to room: ${chatId}`);
            console.log(
              `👥 Clients in room ${chatId}:`,
              io.sockets.adapter.rooms.get(chatId)?.size || 0
            );

            // Broadcast the message from Kafka to all clients in the specific room
            io.to(chatId).emit("message", chatMessage);
            console.log(
              `✅ Broadcasted message ${chatMessage._id} to room ${chatId}`
            );
          } catch (error) {
            console.error("Error processing Kafka message:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error starting Kafka consumer:", error);
      throw error;
    }

    server.listen(PORT, () => {
      console.log(`Chat service server with WebSockets running at ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await gracefulShutdown();
    process.exit(1);
  }
};

// Graceful shutdown function
const gracefulShutdown = async () => {
  console.log("Starting graceful shutdown...");

  try {
    // Disconnect Kafka consumer first (before producer)
    if (kafkaConsumer) {
      try {
        await kafkaConsumer.disconnect();
        console.log("Kafka consumer disconnected");
      } catch (error) {
        console.error("Error disconnecting Kafka consumer:", error);
      }
    }

    // Disconnect Kafka producer
    if (kafkaProducer) {
      try {
        await kafkaProducer.disconnect();
        console.log("Kafka producer disconnected");
      } catch (error) {
        console.error("Error disconnecting Kafka producer:", error);
      }
    }

    // Close Socket.IO
    if (io) {
      io.close();
      console.log("Socket.IO server closed");
    }

    // Close HTTP server
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log("HTTP server closed");
          resolve();
        });
      });
    }
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
  }
};

// Handle process termination
process.on("SIGTERM", async () => {
  console.log("SIGTERM received");
  await gracefulShutdown();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received");
  await gracefulShutdown();
  process.exit(0);
});

run().catch(async (error) => {
  console.error("Unhandled error:", error);
  await gracefulShutdown();
  process.exit(1);
});
