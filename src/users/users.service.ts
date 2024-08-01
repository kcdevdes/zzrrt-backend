import { Injectable } from '@nestjs/common';
import { OAuthProvider, Role, Users } from './entity/users.entity';
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
  constructor(@InjectModel('Users') private usersModel: Model<Users>) {}

  async createUser(
    username: string,
    email: string,
    oauthProvider: OAuthProvider,
    password?: string,
  ) {
    const newUser = new this.usersModel({
      username,
      email,
      oauthProvider,
      password,
      role: Role.user,
    });

    return await newUser.save();
  }

  async findUserByEmail(email: string) {
    return await this.usersModel.findOne({ email });
  }

  async findUserById(id: string) {
    return await this.usersModel.findById(id);
  }

  async updateUser(id: string, user: Partial<Users>) {
    return await this.usersModel.findByIdAndUpdate(id, user, { new: true });
  }

  async deleteUser(id: string) {
    return await this.usersModel.findByIdAndDelete(id);
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
