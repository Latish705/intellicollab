import rateLimit from "express-rate-limit";
import { config } from "../config";
import { Request, Response } from "express";

export const limiter = rateLimit({
  skip: (req: Request, res: Response) => {
    return config.NODE_ENV !== "production";
  },
  windowMs: 15 * 60 * 1000,
  max: 100,
});
