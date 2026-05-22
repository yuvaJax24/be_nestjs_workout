import { Injectable } from '@nestjs/common';
import { computeHmacSha256, secureCompare } from '@/common/utils/crypto.util';
import { PaymentGateway, PaymentIntentResult } from '../interfaces/payment-gateway.interface';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class PaymentGatewayService implements PaymentGateway {
  private readonly webhookSecret = 'replace-with-vault-secret';

  constructor(private readonly paymentRepository: PaymentRepository) {}

  async createPaymentIntent(amount: number, currency: string, orderId: string): Promise<PaymentIntentResult> {
    const paymentId = `payment-${orderId}`;
    this.paymentRepository.create({ id: paymentId, orderId, amount, currency });

    return {
      paymentId,
      clientSecret: `secret-${currency}-${amount}`,
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = computeHmacSha256(payload, this.webhookSecret);
    return secureCompare(expectedSignature, signature);
  }
}
