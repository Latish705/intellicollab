import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "persistence-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9094"],
});

export const mongoConsumer = kafka.consumer({
  groupId: "mongo-persistence-group",
});

export const qdrantConsumer = kafka.consumer({
  groupId: "qdrant-persistence-group",
});
