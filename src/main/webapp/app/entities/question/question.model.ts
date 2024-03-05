import { IQuestionnaire } from 'app/entities/questionnaire/questionnaire.model';
import { QuesType } from 'app/entities/enumerations/ques-type.model';

export interface IQuestion {
  id: number;
  question?: string | null;
  quesType?: QuesType | null;
  questionnaire?: Pick<IQuestionnaire, 'id'> | null;
  subQues?: Pick<IQuestion, 'id'> | null;
}

export type NewQuestion = Omit<IQuestion, 'id'> & { id: null };
