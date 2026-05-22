export interface OauthUserProfile {
  email: string;
  providerUserId: string;
  displayName?: string;
}

export interface OauthProvider {
  readonly name: string;
  exchangeAuthorizationCode(code: string): Promise<OauthUserProfile>;
}
