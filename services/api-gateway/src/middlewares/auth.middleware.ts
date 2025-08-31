import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { NextFunction } from "http-proxy-middleware/dist/types";
import logger from "../config/logger";

const serviceAccount = require("../../service-key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: missing or malformed authorization header",
    });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.headers["x-user-id"] = decodedToken.uid;
    req.headers["x-user-email"] = decodedToken.email;
    next();
  } catch (error) {
    logger.error("Error verifying Firebase ID token ", error);
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Invalid or expired token" });
  }
};
