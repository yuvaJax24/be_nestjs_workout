import { Injectable } from '@nestjs/common';
import { MfaChallengeEntity } from '../entities/mfa-challenge.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class AuthRepository {
  private readonly users = new Map<string, UserEntity>();
  private readonly challenges = new Map<string, MfaChallengeEntity>();

  upsertOauthUser(params: {
    email: string;
    displayName?: string;
    oauthProvider: string;
    oauthProviderUserId: string;
  }): UserEntity {
    const existingUser = Array.from(this.users.values()).find(
      (user) => user.oauthProvider === params.oauthProvider && user.oauthProviderUserId === params.oauthProviderUserId,
    );

    if (existingUser) {
      existingUser.email = params.email;
      existingUser.displayName = params.displayName;
      return existingUser;
    }

    const user: UserEntity = {
      id: params.oauthProviderUserId,
      email: params.email,
      displayName: params.displayName,
      oauthProvider: params.oauthProvider,
      oauthProviderUserId: params.oauthProviderUserId,
      mfaEnabled: true,
    };

    this.users.set(user.id, user);
    return user;
  }

  createMfaChallenge(userId: string, channel: 'email' | 'phone' | 'totp', ttlSeconds: number): MfaChallengeEntity {
    const challenge: MfaChallengeEntity = {
      id: `${channel}-${userId}-${Date.now()}`,
      userId,
      channel,
      expiresAt: new Date(Date.now() + ttlSeconds * 1000),
    };

    this.challenges.set(challenge.id, challenge);
    return challenge;
  }

  findMfaChallenge(challengeId: string): MfaChallengeEntity | undefined {
    return this.challenges.get(challengeId);
  }

  consumeMfaChallenge(challengeId: string): void {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) return;
    challenge.consumedAt = new Date();
    this.challenges.set(challengeId, challenge);
  }
}
