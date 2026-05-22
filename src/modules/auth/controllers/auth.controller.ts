import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtCookieAuthGuard } from '@/common/guards/jwt-cookie-auth.guard';
import { OauthLoginDto } from '../dto/oauth-login.dto';
import { VerifyMfaDto } from '../dto/verify-mfa.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('oauth/login')
  async oauthLogin(@Body() body: OauthLoginDto): Promise<{ userId: string; challengeId: string }> {
    return this.authService.oauthLogin(body.provider, body.code);
  }

  @Post('mfa/verify')
  async verifyMfa(@Body() body: VerifyMfaDto, @Res({ passthrough: true }) response: Response): Promise<{ success: true }> {
    const tokenResult = await this.authService.verifyMfa(body.userId, body.channel, body.code);

    response.cookie('access_token', tokenResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    return { success: true };
  }

  @UseGuards(JwtCookieAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: { sub: string }): { userId: string } {
    return { userId: user.sub };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): { success: true } {
    response.clearCookie('access_token', { path: '/' });
    return { success: true };
  }
}
