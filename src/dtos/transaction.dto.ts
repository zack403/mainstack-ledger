import { z } from 'zod';

export const DepositDto = z
  .object({
    amount: z.number().positive(),
    toAccountId: z.string(),
  })
  .strict();

export const WithdrawalDto = z
  .object({
    amount: z.number().positive(),
    fromAccountId: z.string(),
  })
  .strict();

export const TransferDto = z
  .object({
    fromAccountId: z.string(),
    toAccountId: z.string(),
    amount: z.number().positive(),
  })
  .strict();

export type DepositDtoType = z.infer<typeof DepositDto>;
export type WithdrawalDtoType = z.infer<typeof WithdrawalDto>;
export type TransferDtoType = z.infer<typeof TransferDto>;
