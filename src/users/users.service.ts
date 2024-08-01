import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, Users } from './entity/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  /**
   * 1. createUser
   * 2. findUserByEmail
   * 3. findUserById
   * 4. updateUser
   * 5. deleteUser
   * 6. findOrCreateUser
   */
  constructor(@InjectModel('Users') private usersModel: Model<Users>) {}

  async createUser(dto: CreateUserDto) {
    const newUser = new this.usersModel({
      ...dto,
      role: Role.user,
    });

    return await newUser.save();
  }

  async findUserById(_id: string) {
    try {
      return await this.usersModel.findById(_id);
    } catch (err) {
      throw new InternalServerErrorException('Error finding user by id');
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.usersModel.findOne({ email });
    } catch (err) {
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  async updateUser(_id: string, user: Partial<Users>) {
    const existingUser = await this.findUserById(_id);
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    try {
      await this.usersModel.updateOne({ _id }, user);
      return {
        response: 'User updated successfully',
        user: await this.findUserById(_id),
      };
    } catch (err) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async deleteUser(_id: string) {
    const existingUser = await this.findUserById(_id);
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    try {
      await this.usersModel.deleteOne({ _id });
      return {
        response: 'User deleted successfully',
        user: existingUser,
      };
    } catch (err) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  async findOrCreateUser(dto: CreateUserDto): Promise<Users> {
    // Finds user by userId
    const user = await this.findUserByEmail(dto.email);

    // If user exists, return the user
    if (user) {
      return user;
    }

    // If user does not exist, create a new user and return it
    const userDto = new CreateUserDto();
    userDto.email = dto.email;
    userDto.username = dto.username;
    userDto.oauthProvider = dto.oauthProvider;

    return await this.createUser(userDto);
  }

  authorizeRequest(req, _id: string) {
    if (!req) {
      throw new InternalServerErrorException('Request not found');
    }

    if (!req.user) {
      throw new BadRequestException('User not found in request');
    }

    if (req.user._id !== _id) {
      throw new UnauthorizedException(
        'User not authorized to access this resource',
      );
    }

    return true;
  }
}
