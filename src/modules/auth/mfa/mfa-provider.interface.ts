export interface MfaProvider {
  readonly channel: 'email' | 'phone' | 'totp';
  sendOrGenerate(userId: string): Promise<{ challengeId: string }>;
  verify(userId: string, code: string): Promise<boolean>;
}
