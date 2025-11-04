import express from "express";
import cors from "cors";
import { MongoService } from "./services/MongoService";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.status(200).send("Persistence Service is up and running!");
});

app.get("/consumermongo", async (req, res) => {
  try {
    const mongoService = new MongoService();
    await mongoService.saveChatMessage();
    res.status(200).send("Mongo Consumer started successfully.");
  } catch (error) {
    console.error("Error starting Mongo Consumer:", error);
    res.status(500).send("Failed to start Mongo Consumer.");
  }
});

export default app;
