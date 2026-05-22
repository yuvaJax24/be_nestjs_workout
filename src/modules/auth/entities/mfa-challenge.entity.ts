export class MfaChallengeEntity {
  id!: string;
  userId!: string;
  channel!: 'email' | 'phone' | 'totp';
  expiresAt!: Date;
  consumedAt?: Date;
}
