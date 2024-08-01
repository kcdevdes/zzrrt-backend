import { OAuthProvider } from '../entity/users.entity';

export class CreateUserDto {
  username: string;
  email: string;
  oauthProvider: OAuthProvider;
  password?: string;
}