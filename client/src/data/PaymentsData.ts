import { Payment } from "@/types/Payment";

export const samplePayments: Payment[] = [
  {
    _id: "pay_001",
    userId: "68c18e9bb4d61c84089de24c",
    amount: 1500,
    currency: "KSH",
    method: "m-pesa",
    status: "completed",
    transactionId: "MPESA123456",
    created_at: "2025-09-05T10:15:30.000Z",
    updated_at: "2025-09-05T10:17:00.000Z"
  },
  {
    _id: "pay_002",
    userId: "78d21e9ab4f72c83012fe11b",
    amount: 25,
    currency: "USD",
    method: "paypal",
    status: "pending",
    transactionId: "PAYPAL789012",
    created_at: "2025-09-08T14:22:45.000Z"
  },
  {
    _id: "pay_003",
    userId: "68c18e9bb4d61c84089de24c",
    amount: 500,
    currency: "KSH",
    method: "m-pesa",
    status: "failed",
    created_at: "2025-09-09T09:05:10.000Z",
    updated_at: "2025-09-09T09:06:30.000Z"
  }
];
