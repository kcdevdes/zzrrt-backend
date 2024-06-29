// user.util.ts
import { CreateUserDto, OAuthProvider, Role } from '../dtos/create-user.dto';

export function mapOAuthUserToCreateUserDto(oauthUser: any): CreateUserDto {
  const { provider, providerId, email, name } = oauthUser;

  // Remove 'undefined' from the name if present
  const username = name
    .split(' ')
    .filter((part) => part !== 'undefined')
    .join(' ');

  const oauthProvider: OAuthProvider = { provider, providerId };

  return {
    username,
    email,
    oauthProvider,
    role: Role.User,
  };
}
