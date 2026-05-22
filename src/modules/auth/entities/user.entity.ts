export class UserEntity {
  id!: string;
  email!: string;
  displayName?: string;
  oauthProvider!: string;
  oauthProviderUserId!: string;
  mfaEnabled = true;
}
