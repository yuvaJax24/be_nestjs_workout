import { IsIn, IsString } from 'class-validator';

export class VerifyMfaDto {
  @IsString()
  userId!: string;

  @IsIn(['email', 'phone', 'totp'])
  channel!: 'email' | 'phone' | 'totp';

  @IsString()
  code!: string;
}
