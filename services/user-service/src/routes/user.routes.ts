import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/register", UserController.register);

export default userRoutes;
