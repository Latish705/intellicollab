import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import promclient, { register } from "prom-client";
import logger from "./config/logger";
import { proxyServices } from "./config/service";
import { limiter } from "./middlewares/rate-limiter.middleware";

const collectDefaultMetrics = promclient.collectDefaultMetrics;

collectDefaultMetrics({ register: promclient.register });

const app = express();

app.use(helmet());
app.use(cors());
app.use(limiter);

app.get("/health", (req: Request, res: Response) => {
  logger.info("req came on /health route");
  res.status(200).json({ status: "ok" });
});

app.get("/metrics", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", promclient.register.contentType);
  const metrics = await promclient.register.metrics();
  res.send(metrics);
});

proxyServices(app);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Unhandled error", err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
