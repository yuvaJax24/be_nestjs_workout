import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MfaProvider } from './mfa-provider.interface';
import { OtpProvider } from './providers/otp.provider';
import { TotpProvider } from './providers/totp.provider';

@Injectable()
export class MfaService {
  private readonly providers = new Map<MfaProvider['channel'], MfaProvider>();

  constructor(otpProvider: OtpProvider, totpProvider: TotpProvider) {
    this.providers.set('email', otpProvider);
    this.providers.set('phone', otpProvider);
    this.providers.set('totp', totpProvider);
  }

  async startChallenge(userId: string, channel: MfaProvider['channel']): Promise<{ challengeId: string }> {
    const provider = this.providers.get(channel);

    if (!provider) {
      throw new UnauthorizedException('Unsupported MFA channel');
    }

    return provider.sendOrGenerate(userId);
  }

  async verifyCode(userId: string, channel: MfaProvider['channel'], code: string): Promise<boolean> {
    const provider = this.providers.get(channel);

    if (!provider) {
      throw new UnauthorizedException('Unsupported MFA channel');
    }

    return provider.verify(userId, code);
  }
}
