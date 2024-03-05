import { IQuestion } from 'app/entities/question/question.model';

export interface IMCQOption {
  id: number;
  value?: string | null;
  question?: Pick<IQuestion, 'id'> | null;
}

export type NewMCQOption = Omit<IMCQOption, 'id'> & { id: null };
