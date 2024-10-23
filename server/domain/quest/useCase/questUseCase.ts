import type { MaybeId } from 'common/types/brandedId';
import type { QuestDto } from 'common/types/quest';
import type { UserDto } from 'common/types/user';
import { transaction } from 'service/prismaClient';
import { questMethod } from '../model/questMethod';
import type { QuestCreateServerVal, QuestUpdateServerVal } from '../model/questType';
import { questCommand } from '../repository/questCommand';
import { questQuery } from '../repository/questQuery';
import { toQuestDto } from '../service/toQuestDto';

export const questUseCase = {
  create: (user: UserDto, val: QuestCreateServerVal): Promise<QuestDto> =>
    transaction('RepeatableRead', async (tx) => {
      const questGroup = await questQuery.findQuestGroupById(tx, val.questGroupId);
      const created = questMethod.create(user, val, questGroup.Quests);

      await Promise.all(
        created.quests.map((quest) =>
          questCommand.create(tx, { quest, questGroupId: questGroup.id }),
        ),
      );

      const dto = await toQuestDto(created.quests[0]);

      return dto;
    }),
  update: (user: UserDto, val: QuestUpdateServerVal): Promise<QuestDto> =>
    transaction('RepeatableRead', async (tx) => {
      const quest = await questQuery.findById(tx, val.questId);
      const updated = questMethod.update(user, quest, val);

      await questCommand.update(tx, updated);

      const dto = await toQuestDto(updated.quest);

      return dto;
    }),
  delete: (user: UserDto, questId: MaybeId['quest']): Promise<QuestDto> =>
    transaction('RepeatableRead', async (tx) => {
      const quest = await questQuery.findById(tx, questId);
      const deleted = questMethod.delete(user, quest);

      await questCommand.delete(tx, deleted);

      const dto = await toQuestDto(deleted.quest);

      return dto;
    }),
};
