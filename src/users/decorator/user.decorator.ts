import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { UserModel } from '../entity/users.entity';

export const User = createParamDecorator(
  (data: keyof UserModel, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UserModel;

    if (!user) {
      throw new BadRequestException('User not found in Request');
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
