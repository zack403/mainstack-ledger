import { z } from 'zod';
import { Currency } from '../enums';

export const UpdateAccountDto = z
  .object({
    currency: z
      .enum(Object.values(Currency) as [string, ...string[]])
      .optional(),
  })
  .strict();

export type UpdateAccountDtoType = z.infer<typeof UpdateAccountDto>;
