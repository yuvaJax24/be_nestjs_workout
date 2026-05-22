import { IsCurrency, IsNumber, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsCurrency()
  currency!: string;

  @IsString()
  orderId!: string;
}
