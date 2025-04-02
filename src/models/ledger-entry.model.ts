import { Schema, model, Document } from 'mongoose';
import { EntryType } from '../enums';
import { v4 as uuidv4 } from 'uuid';

export interface ILedgerEntry extends Document {
  entryId: string;
  transactionId: string;
  accountId: string;
  amount: string;
  entryType: EntryType;
  createdAt: Date;
}

const LedgerEntrySchema = new Schema<ILedgerEntry>(
  {
    entryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => `led-${uuidv4()}`,
    },
    transactionId: {
      type: String,
      required: true,
      index: true,
      ref: 'Transaction',
    },
    accountId: { type: String, required: true, index: true, ref: 'Account' },
    amount: { type: String, required: true, match: /^-?\d+\.\d{2}$/ },
    entryType: { type: String, enum: Object.values(EntryType), required: true },
  },
  { timestamps: true }
);

LedgerEntrySchema.index({ accountId: 1, createdAt: -1 });

export const LedgerEntryModel = model<ILedgerEntry>(
  'LedgerEntry',
  LedgerEntrySchema
);
