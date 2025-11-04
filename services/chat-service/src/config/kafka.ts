import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "chat-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9094"],
});

export const admin = kafka.admin();

const topicName = process.env.KAFKA_TOPIC || "intellicollab_messages";

const run = async () => {
  try {
    await admin.connect();
    await admin.createTopics({
      topics: [{ topic: topicName }],
    });
  } catch (error) {
    console.error("Error creating Kafka topic:", error);
  }
};
run();

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "chat-service-group" });
