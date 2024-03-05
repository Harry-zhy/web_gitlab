import dayjs from 'dayjs/esm';
import { IIntro } from 'app/entities/intro/intro.model';

export interface IQuestionnaire {
  id: number;
  date?: dayjs.Dayjs | null;
  userName?: string | null;
  questionnaire?: Pick<IIntro, 'id'> | null;
}

export type NewQuestionnaire = Omit<IQuestionnaire, 'id'> & { id: null };
