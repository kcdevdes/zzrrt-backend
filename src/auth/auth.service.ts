import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/models/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private userService: UserService,
  ) {}

  /**
   * 1. login
   * 2. authenticateUser
   * 3. createUser
   * 4. logout
   */
}
