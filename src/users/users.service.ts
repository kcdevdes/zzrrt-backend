import { Injectable } from '@nestjs/common';
import { OAuthProvider, Role, User } from './entity/users.entity';
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
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async createUser(dto: CreateUserDto) {
    const newUser = new this.userModel({
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

  async updateUser(id: string, user: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async findOrCreateUser(dto: FindUserDto) {
    const user = await this.findUserByEmail(dto.email);

    if (user) {
      return user;
    }

    const userDto: CreateUserDto = {
      email: dto.email,
      username: dto.username,
      oauthProvider: dto.oauthProvider,
    };
    return await this.createUser(userDto);
  }
}
