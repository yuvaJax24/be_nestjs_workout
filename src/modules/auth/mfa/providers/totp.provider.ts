import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { MfaProvider } from '../mfa-provider.interface';

@Injectable()
export class TotpProvider implements MfaProvider {
  readonly channel = 'totp' as const;

  async sendOrGenerate(userId: string): Promise<{ challengeId: string }> {
    return { challengeId: `totp-${userId}` };
  }

  async verify(userId: string, code: string): Promise<boolean> {
    const secret = authenticator.generateSecret();
    return authenticator.verify({ token: code, secret: `${secret}-${userId}` });
  }
}
