import { IsIn, IsString } from 'class-validator';

export class OauthLoginDto {
  @IsString()
  @IsIn(['google', 'microsoft'])
  provider!: string;

  @IsString()
  code!: string;
}
