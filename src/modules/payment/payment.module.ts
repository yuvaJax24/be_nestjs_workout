import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentGatewayService } from './services/payment-gateway.service';
import { PaymentWebhookService } from './services/payment-webhook.service';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  controllers: [PaymentController],
  providers: [PaymentGatewayService, PaymentWebhookService, PaymentRepository],
  exports: [PaymentGatewayService, PaymentRepository],
})
export class PaymentModule {}
