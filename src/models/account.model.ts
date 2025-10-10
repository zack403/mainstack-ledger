import { Document, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AccountStatus, AccountType, Currency } from '../enums';

export interface IAccount extends Document {
  accountId: string;
  userId: string;
  accountNumber: string;
  accountType: AccountType;
  balance: string;
  currency: Currency;
  status: AccountStatus;
  accountName?: string;
  createdAt: Date;
  updatedAt: Date;
  version?: number;
}

const AccountSchema = new Schema<IAccount>(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
      default: () => `acc-${uuidv4()}`,
    },
    userId: { type: String, required: true, ref: 'User' },
    accountNumber: { type: String, required: true, unique: true, index: true },
    accountName: { type: String, trim: true },
    accountType: {
      type: String,
      enum: Object.values(AccountType),
      required: true,
      default: AccountType.SAVINGS,
    },
    balance: {
      type: String,
      required: true,
      default: '0.00',
      match: /^\d+\.\d{2}$/,
    },
    currency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
      default: Currency.NGN,
    },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      required: true,
      default: AccountStatus.ACTIVE,
    },
    version: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, versionKey: '_v', optimisticConcurrency: true }
);

AccountSchema.index({ userId: 1, currency: 1 });

export const AccountModel = model<IAccount>('Account', AccountSchema);
