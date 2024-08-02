import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, UserDocument } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserDocument)
    private readonly userRepository: Repository<UserDocument>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...dto,
      role: Role.user,
    });

    return await this.userRepository.save(newUser);
  }

  async findUserById(_id: string) {
    try {
      return await this.userRepository.findOneBy({ _id });
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

  async updateUser(_id: string, user: Partial<UserDocument>) {
    const existingUser = await this.findUserById(_id);
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    try {
      await this.userRepository.update({ _id }, user);
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
      await this.userRepository.delete({ _id });
      return {
        response: 'User deleted successfully',
        user: existingUser,
      };
    } catch (err) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  async findOrCreateUser(dto: CreateUserDto): Promise<UserDocument> {
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
