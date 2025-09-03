import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { Request, Response } from "express";

const userRoutes = Router();

const userController = new UserController();
userRoutes.get("/test", (req: Request, res: Response) => {
  res.json({ message: "User service test endpoint" });
});
userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.post("/create-from-firebase", userController.createFromFirebase);
userRoutes.get("/validate", userController.validateUser);

export default userRoutes;
