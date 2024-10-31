import { z } from 'zod';
import { defineValidators } from './$relay';

export default defineValidators(() => ({
  params: z.object({ questId: z.string() }),
}));
