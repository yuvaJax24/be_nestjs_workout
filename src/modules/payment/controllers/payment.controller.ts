import { Body, Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentGatewayService } from '../services/payment-gateway.service';
import { PaymentWebhookService } from '../services/payment-webhook.service';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly paymentWebhookService: PaymentWebhookService,
  ) {}

  @Post('intent')
  async createIntent(@Body() body: CreatePaymentDto) {
    return this.paymentGatewayService.createPaymentIntent(body.amount, body.currency, body.orderId);
  }

  @Post('webhook')
  handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-signature') signature: string,
  ): { received: true } {
    const payload = req.rawBody?.toString() ?? '';
    return this.paymentWebhookService.handleWebhook(payload, signature);
  }
}
