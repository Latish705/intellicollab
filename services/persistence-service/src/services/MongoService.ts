import { validateHeaderName } from "http";
import { mongoConsumer } from "../config/kafka";
import MongoMessage from "../models/mongoMessage";

interface KafkaChatMessage {
  chatId: string;
  senderId: string;
  message: string;
  timestamp: Date;
}

interface KafkaAIChatLog {
  sessionId: string;
  userId: string;
  modelId: string;
  prompt_text: string;
  response_text: string;
  token_used: number;
  timestamp: Date;
}

export class MongoService {
  public async saveChatMessage() {
    try {
      // here the logical step are first we will subscribe to kafka topic of mongo chat service
      // in that will consumer messages whenever there are new messages
      console.log("🔌 Connecting to Kafka consumer for MongoDB...");
      await mongoConsumer.connect();
      console.log("✅ Kafka consumer connected");
      
      console.log("📡 Subscribing to topic: mongo-chat-messages");
      await mongoConsumer.subscribe({
        topic: "mongo-chat-messages",
        fromBeginning: false,
      });
      console.log("✅ Successfully subscribed to mongo-chat-messages");
      
      console.log("👂 Listening for messages... (waiting for producers to send messages)");
      await mongoConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log("\n🔔 NEW MESSAGE RECEIVED!");
          console.log("📨 Message Details:", {
            topic,
            partition,
            offset: message.offset,
            timestamp: new Date().toISOString(),
            value: message.value?.toString(),
          });
          
          const rawValue = message.value?.toString();
          if (rawValue) {
            try {
              const parsedValue: KafkaChatMessage = JSON.parse(rawValue);
              console.log("📝 Parsed message:", parsedValue);
              
              const mongoMessage = new MongoMessage({
                chatId: parsedValue.chatId,
                senderId: parsedValue.senderId,
                message: parsedValue.message,
              });
              
              await mongoMessage.save();
              console.log(
                `✅ Successfully saved message to MongoDB | Sender: ${parsedValue.senderId} | Chat: ${parsedValue.chatId}`
              );
            } catch (parseError) {
              console.error("❌ Error parsing or saving message:", parseError);
              console.error("Raw message value:", rawValue);
            }
          } else {
            console.warn("⚠️  Received message with empty value");
          }
        },
      });
    } catch (error) {
      console.error("❌ Failed to initialize mongo chat consumer:", error);
      try {
        await mongoConsumer.disconnect();
      } catch (disconnectErr) {
        console.error(
          "❌ Failed to disconnect mongo consumer after error:",
          disconnectErr
        );
      }
      throw error;
    }
  }

  public async saveAIChatLog(data: KafkaAIChatLog) {}
}
