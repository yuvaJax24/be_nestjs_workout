import { Injectable } from '@nestjs/common';
import { OauthProvider, OauthUserProfile } from '../oauth-provider.interface';

@Injectable()
export class GoogleOauthProvider implements OauthProvider {
  readonly name = 'google';

  async exchangeAuthorizationCode(code: string): Promise<OauthUserProfile> {
    return {
      email: `google_user_${code}@example.com`,
      providerUserId: `google-${code}`,
      displayName: 'Google User',
    };
  }
}
