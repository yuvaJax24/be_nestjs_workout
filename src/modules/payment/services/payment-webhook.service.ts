import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';

@Injectable()
export class PaymentWebhookService {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  handleWebhook(payload: string, signature: string): { received: true } {
    const isValid = this.paymentGatewayService.verifyWebhookSignature(payload, signature);

    if (!isValid) {
      throw new UnauthorizedException('Invalid payment webhook signature');
    }

    return { received: true };
  }
}
