export type Payment = {
  _id: string;
  userId: string;
  amount: number;
  currency: 'KSH' | 'USD';
  method: 'm-pesa' | 'paypal';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  created_at: string;
  updated_at?: string;
}