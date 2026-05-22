import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_CONSTANTS } from '@/common/constants/auth.constants';
import { AuthRepository } from '../repositories/auth.repository';
import { MfaService } from '../mfa/mfa.service';
import { OauthOrchestratorService } from '../oauth/oauth-orchestrator.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly oauthOrchestrator: OauthOrchestratorService,
    private readonly mfaService: MfaService,
  ) {}

  async oauthLogin(provider: string, code: string): Promise<{ userId: string; challengeId: string }> {
    const profile = await this.oauthOrchestrator.authenticate(provider, code);
    const user = this.authRepository.upsertOauthUser({
      email: profile.email,
      displayName: profile.displayName,
      oauthProvider: provider,
      oauthProviderUserId: profile.providerUserId,
    });

    await this.mfaService.startChallenge(user.id, 'email');
    const challenge = this.authRepository.createMfaChallenge(user.id, 'email', AUTH_CONSTANTS.MFA_OTP_TTL_SECONDS);

    return { userId: user.id, challengeId: challenge.id };
  }

  async verifyMfa(userId: string, channel: 'email' | 'phone' | 'totp', code: string): Promise<{ accessToken: string }> {
    const passed = await this.mfaService.verifyCode(userId, channel, code);

    if (!passed) {
      throw new UnauthorizedException('Invalid MFA code');
    }

    return { accessToken: `signed-jwt-for-${userId}` };
  }
}
