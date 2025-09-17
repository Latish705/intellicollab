import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { LoginUserDto, RegisterUserDto } from "../DTO/user-request.dto";
import logger from "../config/logger";

export class UserController {
  private userService = new UserService();

  public validate = async (req: Request, res: Response): Promise<any> => {
    try {
    } catch (error: any) {
      logger.error("Error in validate : ", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.body);

      const userFirebaseId = req.headers["x-user-id"];
      // console.log(req.headers, userFirebaseId);

      const registerUserDto: RegisterUserDto = req.body;

      registerUserDto.firebaseId = userFirebaseId as string;

      const newUser = await this.userService.createUser(registerUserDto);
      console.log("New user is created:", newUser);

      res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      logger.error("Error in register : ", (error as Error).message);

      next(error);
    }
  };

  public login = async (req: Request, res: Response): Promise<any> => {
    try {
      const loginUserDto: LoginUserDto = req.body;
      console.log(loginUserDto);

      loginUserDto.firebaseId = req.headers["x-user-id"] as string;
      console.log(loginUserDto);

      const user = await this.userService.findUserByFirebaseId(
        loginUserDto.firebaseId
      );

      console.log(user);

      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (error: any) {
      logger.error("Error in login : ", error.message);
    }
  };

  public validateUser = async (req: Request, res: Response) => {
    try {
      console.log(req.headers);

      const userFirebaseId = req.headers["x-user-id"] as string;

      const user = await this.userService.findUserByFirebaseId(userFirebaseId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ valid: true, user });
    } catch (error: any) {
      logger.error("Error in validateUser : ", error.message);
      res.status(400).json({ success: false, message: error.message });
      if (error.code === "auth/id-token-expired") {
        return res
          .status(401)
          .json({ success: false, message: "Token expired" });
      }
    }
  };

  public async createFromFirebase(req: Request, res: Response) {
    try {
      const userFirebaseId = req.headers["x-user-id"];
      const { firebaseUid, email, name } = req.body;
      if (!firebaseUid || !email || !name) {
        return res
          .status(400)
          .json({ success: false, message: "Missing fields" });
      }

      const newUser = await this.userService.createUserFromFirebaseuserData({
        firebaseId: firebaseUid,
        email,
        name,
      });
      return res.status(201).json({ success: true, user: newUser });
    } catch (error: any) {
      logger.error("Error in createFromFirebase : ", error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
