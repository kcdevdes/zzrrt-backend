
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { OAuthProvider, Role, Users } from './entity/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';

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

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findUserById(id: number) {
    return this.userModel.findById(id);
  }

  async updateUser(id: number, user: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async deleteUser(id: number) {
    return this.userModel.findByIdAndDelete(id);
  }

  async findOrCreateUser(dto: FindUserDto) {
    const user = await this.findUserByEmail(dto.email);

    if (user) {
      return user;
    }

    const userDto = new CreateUserDto();
    userDto.email = dto.email;
    userDto.username = dto.username;
    userDto.oauthProvider = dto.oauthProvider;

    return await this.createUser(userDto);
  }

  authorizeRequest(req, id: string | number) {
    if (!req) {
      throw new InternalServerErrorException('Request not found');
    }

    if (!req.user) {
      throw new BadRequestException('User not found in request');
    }

    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'User not authorized to access this resource',
      );
    }

    return true;
  }
}
