import { OAuthProvider } from '../entity/users.entity';

export class FindUserDto {
  email: string;
  oauthProvider: OAuthProvider;
  username?: string;
}
