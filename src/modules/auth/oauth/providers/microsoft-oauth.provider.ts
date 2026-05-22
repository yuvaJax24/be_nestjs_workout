import { Injectable } from '@nestjs/common';
import { OauthProvider, OauthUserProfile } from '../oauth-provider.interface';

@Injectable()
export class MicrosoftOauthProvider implements OauthProvider {
  readonly name = 'microsoft';

  async exchangeAuthorizationCode(code: string): Promise<OauthUserProfile> {
    return {
      email: `microsoft_user_${code}@example.com`,
      providerUserId: `microsoft-${code}`,
      displayName: 'Microsoft User',
    };
  }
}
