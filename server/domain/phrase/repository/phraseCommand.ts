import type { Prisma } from '@prisma/client';
import type { PhraseSaveVal } from '../model/phraseType';

export const phraseCommand = {
  create: async (tx: Prisma.TransactionClient, val: PhraseSaveVal): Promise<void> => {
    await tx.phrase.create({
      data: {
        id: val.phrase.id,
        phrase: val.phrase.phrase,
        indexInGroup: val.phrase.indexInGroup,
        phraseGroupId: val.phrase.phraseGroupId,
      },
    });

    await tx.phrase.updateMany({
      where: {
        phraseGroupId: val.phrase.phraseGroupId,
        indexInGroup: {
          gt: val.phrase.indexInGroup,
        },
      },
      data: {
        indexInGroup: {
          increment: 1,
        },
      },
    });
    await tx.phraseGroup.update({
      where: { id: val.phrase.phraseGroupId },
      data: {
        phrases: {
          connect: {
            id: val.phrase.id,
          },
        },
      },
    });
  },
  update: async (tx: Prisma.TransactionClient, val: PhraseSaveVal): Promise<void> => {
    await tx.phrase.update({
      where: { id: val.phrase.id },
      data: {
        phrase: val.phrase.phrase,
        indexInGroup: val.phrase.indexInGroup,
      },
    });
  },
  delete: async (tx: Prisma.TransactionClient, val: PhraseSaveVal): Promise<void> => {
    await tx.phrase.delete({
      where: { id: val.phrase.id },
    });

    await tx.phrase.updateMany({
      where: {
        phraseGroupId: val.phrase.phraseGroupId,
        indexInGroup: {
          gt: val.phrase.indexInGroup,
        },
      },
      data: {
        indexInGroup: {
          decrement: 1,
        },
      },
    });
  },
};
