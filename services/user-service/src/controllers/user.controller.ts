import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { LoginUserDto, RegisterUserDto } from "../DTO/user-request.dto";
import logger from "../config/logger";

export class UserController {
  private userService = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registerUserDto: RegisterUserDto = req.body;

      const newUser = await this.userService.createUser(registerUserDto);

      res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response): Promise<any> => {
    try {
      const loginUserDto: LoginUserDto = req.body;

      const user = await this.userService.findUserByFirebaseId(
        loginUserDto.firebaseId
      );

      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (error: any) {
      logger.error("Error in login : ", error.message);
    }
  };
}
