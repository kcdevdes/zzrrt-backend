// create-user.dto.ts
export class CreateUserDto {
  username: string;
  email: string;
  oauthProvider: OAuthProvider;
  role?: Role;
}

export class OAuthProvider {
  provider: string;
  providerId: string;
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}
