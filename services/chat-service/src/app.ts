import { Request, Response, NextFunction } from "express";
import express from "express";
import helmet, { crossOriginEmbedderPolicy } from "helmet";
import cors from "cors";
import promclient, { register } from "prom-client";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const collectDefaultMetrics = promclient.collectDefaultMetrics;

collectDefaultMetrics({ register: promclient.register });

app.get("/metrics", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", promclient.register.contentType);
  const metrics = await promclient.register.metrics();
  res.send(metrics);
});

app.use(userRoutes);

export default app;
