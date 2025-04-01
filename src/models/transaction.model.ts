import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { TransactionType, TransactionStatus, Currency } from '../enums';

interface ITransaction extends Document {
  transactionId: string;
  type: TransactionType;
  fromAccountId?: string | null;
  toAccountId?: string | null;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  currency: Currency;
  status: TransactionStatus;
  requestId: string;
  description?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      default: () => `txn-${uuidv4()}`,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    fromAccountId: {
      type: String,
      index: true,
      required: true,
      ref: 'Account',
    },
    toAccountId: { type: String, index: true, required: true, ref: 'Account' },
    amount: { type: String, required: true, match: /^\d+\.\d{2}$/ },
    balanceBefore: {
      type: String,
      required: true,
      default: '0.00',
      match: /^\d+\.\d{2}$/,
    },
    balanceAfter: {
      type: String,
      required: true,
      default: '0.00',
      match: /^\d+\.\d{2}$/,
    },
    currency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    requestId: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

TransactionSchema.index({ fromAccountId: 1, createdAt: -1 });
TransactionSchema.index({ toAccountId: 1, createdAt: -1 });
TransactionSchema.index({ requestId: 1 });

export const TransactionModel = model<ITransaction>(
  'Transaction',
  TransactionSchema
);
