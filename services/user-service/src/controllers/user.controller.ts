import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { RegisterUserDto } from "../DTO/user-request.dto";

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
}
