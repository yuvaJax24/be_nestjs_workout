export class PaymentEntity {
  id!: string;
  orderId!: string;
  amount!: number;
  currency!: string;
  status!: 'pending' | 'succeeded' | 'failed';
  createdAt!: Date;
}
