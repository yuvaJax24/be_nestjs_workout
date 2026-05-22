import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OauthProvider, OauthUserProfile } from './oauth-provider.interface';
import { GoogleOauthProvider } from './providers/google-oauth.provider';
import { MicrosoftOauthProvider } from './providers/microsoft-oauth.provider';

@Injectable()
export class OauthOrchestratorService {
  private readonly providers = new Map<string, OauthProvider>();

  constructor(
    googleProvider: GoogleOauthProvider,
    microsoftProvider: MicrosoftOauthProvider,
  ) {
    [googleProvider, microsoftProvider].forEach((provider) => {
      this.providers.set(provider.name, provider);
    });
  }

  async authenticate(providerName: string, code: string): Promise<OauthUserProfile> {
    const provider = this.providers.get(providerName);

    if (!provider) {
      throw new UnauthorizedException(`Unsupported OAuth provider: ${providerName}`);
    }

    return provider.exchangeAuthorizationCode(code);
  }
}
