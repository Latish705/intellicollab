import bcrypt from "bcrypt";
import User from "../models/user.model";
import { RegisterUserDto } from "../DTO/user-request.dto";
import { UserResponseDto } from "../DTO/user-response.dto";

export class UserService {
  public async createUser(userData: RegisterUserDto): Promise<UserResponseDto> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUserEntity = new User({
      ...userData,
      password_hash: hashedPassword,
    });

    const savedUser = await newUserEntity.save();

    return this.toUserResponseDto(savedUser);
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
