// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { mapOAuthUserToCreateUserDto } from './util/user.util';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * 1. createUser
   * 2. findUserByEmail
   * 3. findUserById
   * 4. getProfile
   * 5. updateUser
   * 6. deleteUser
   * 7. findOrCreateUser
   */
}
