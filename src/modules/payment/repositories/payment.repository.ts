import { Injectable } from '@nestjs/common';
import { PaymentEntity } from '../entities/payment.entity';

@Injectable()
export class PaymentRepository {
  private readonly payments = new Map<string, PaymentEntity>();

  create(params: { id: string; orderId: string; amount: number; currency: string }): PaymentEntity {
    const payment: PaymentEntity = {
      id: params.id,
      orderId: params.orderId,
      amount: params.amount,
      currency: params.currency,
      status: 'pending',
      createdAt: new Date(),
    };

    this.payments.set(payment.id, payment);
    return payment;
  }

  markSucceeded(paymentId: string): PaymentEntity | undefined {
    const payment = this.payments.get(paymentId);
    if (!payment) return undefined;
    payment.status = 'succeeded';
    this.payments.set(paymentId, payment);
    return payment;
  }
}
