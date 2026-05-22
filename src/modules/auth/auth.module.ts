import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { OauthOrchestratorService } from './oauth/oauth-orchestrator.service';
import { GoogleOauthProvider } from './oauth/providers/google-oauth.provider';
import { MicrosoftOauthProvider } from './oauth/providers/microsoft-oauth.provider';
import { MfaService } from './mfa/mfa.service';
import { TotpProvider } from './mfa/providers/totp.provider';
import { OtpProvider } from './mfa/providers/otp.provider';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    OauthOrchestratorService,
    GoogleOauthProvider,
    MicrosoftOauthProvider,
    MfaService,
    TotpProvider,
    OtpProvider,
  ],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
