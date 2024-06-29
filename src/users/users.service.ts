import { Injectable } from '@nestjs/common';
import { OAuthProvider, Role, User } from './entity/users.entity';
import { InjectModel } from '@nestjs/mongoose';
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
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async createUser(
    username: string,
    email: string,
    oauthProvider: OAuthProvider,
    password?: string,
  ) {
    const newUser = new this.userModel({
      username,
      email,
      oauthProvider,
      password,
      role: Role.user,
    });

    return await newUser.save();
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async updateUser(id: string, user: Partial<User>) {
    return await this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async deleteUser(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }

  async findOrCreateUser(
    email: string,
    oauthProvider: OAuthProvider,
    username?: string,
  ) {
    const user = await this.findUserByEmail(email);

    if (user) {
      return user;
    }

    return await this.createUser(username, email, oauthProvider);
  }
}
