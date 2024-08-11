import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, UserModel } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...dto,
      role: Role.USER,
    });

    return await this.userRepository.save(newUser);
  }

  async findUserById(id: string) {
    try {
      return await this.userRepository.findOneBy({ id });
    } catch (err) {
      throw new InternalServerErrorException('Error finding user by id');
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (err) {
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  async updateUser(id: string, user: Partial<UserModel>) {
    const existingUser = await this.findUserById(id);
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    try {
      await this.userRepository.update({ id }, user);
      return {
        response: 'User updated successfully',
        user: await this.findUserById(id),
      };
    } catch (err) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async deleteUser(id: string) {
    const existingUser = await this.findUserById(id);
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    try {
      await this.userRepository.delete({ id });
      return {
        response: 'User deleted successfully',
        user: existingUser,
      };
    } catch (err) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  async findOrCreateUser(dto: CreateUserDto): Promise<UserModel> {
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

  /**
   * Returns if a user holds a valid token and _id both in order to access to the user's resource
   * @param req Request Object with `user` and `token` properties attached by AccessTokenGuard
   * @param id The ID to which a user wants to access
   */
  authorizeRequest(req, id: string) {
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
