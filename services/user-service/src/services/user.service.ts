import bcrypt from "bcrypt";
import User from "../models/user.model";
import { RegisterUserDto } from "../DTO/user-request.dto";
import { UserResponseDto } from "../DTO/user-response.dto";
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export class UserService {
  private isFirstSignin = async (
    req: Request,
    res: Response
  ): Promise<boolean> => {
    try {
      const user = req.body.user;
      if (!user) {
        throw new Error("firebase user not found");
      }
      const userId = user.uid;
      const dbUser = await this.findUserByFirebaseId(userId);
      if (!dbUser) {
        return true;
      }
      return false;
    } catch (error: any) {
      logger.error("Error in check isFirstSignin : ", error.message);
      return false;
    }
  };

  public async createUser(userData: RegisterUserDto): Promise<UserResponseDto> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUserEntity = new User({
      ...userData,
    });

    const savedUser = await newUserEntity.save();

    return this.toUserResponseDto(savedUser);
  }

  public async findUserByFirebaseId(firebaseId: string) {
    return await User.findOne({ firebaseId });
  }

  private toUserResponseDto(user: any): UserResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      is_premium: user.is_premium,
      created_at: user.created_at.toISOString(),
    };
  }
}
