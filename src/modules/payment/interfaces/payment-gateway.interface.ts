export interface PaymentIntentResult {
  paymentId: string;
  clientSecret: string;
}

export interface PaymentGateway {
  createPaymentIntent(amount: number, currency: string, orderId: string): Promise<PaymentIntentResult>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}
