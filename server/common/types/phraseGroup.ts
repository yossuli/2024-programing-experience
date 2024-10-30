import type { Category } from 'common/validators/phraseGroup';
import type { StrictOmit, SubKeyObj } from '.';
import type { DtoId } from './brandedId';

export type PhraseGroupDto = {
  id: DtoId['phraseGroup'];
  category: Category;
  backgroundImage: { url: string; s3Key: string } | undefined;
  quest: { id: DtoId['quest']; name: string };
};

export type PhraseGroupCreateDto = StrictOmit<PhraseGroupDto, 'id' | 'backgroundImage' | 'quest'> &
  SubKeyObj<PhraseGroupDto, { backgroundImage?: Blob }> & { questId: DtoId['quest'] };

export type PhraseGroupUpdateDto = StrictOmit<PhraseGroupDto, 'id' | 'quest' | 'backgroundImage'> &
  SubKeyObj<PhraseGroupDto, { backgroundImage?: Blob }>;
