import { Injectable } from '@nestjs/common';
import { MfaProvider } from '../mfa-provider.interface';

@Injectable()
export class OtpProvider implements MfaProvider {
  readonly channel = 'email' as const;

  async sendOrGenerate(userId: string): Promise<{ challengeId: string }> {
    return { challengeId: `email-${userId}` };
  }

  async verify(_userId: string, code: string): Promise<boolean> {
    return code.length >= 6;
  }
}
