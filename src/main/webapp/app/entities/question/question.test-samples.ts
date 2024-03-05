import { QuesType } from 'app/entities/enumerations/ques-type.model';

import { IQuestion, NewQuestion } from './question.model';

export const sampleWithRequiredData: IQuestion = {
  id: 47363,
  question: 'Account budgetary invoice',
  quesType: QuesType['FILL_IN'],
};

export const sampleWithPartialData: IQuestion = {
  id: 19176,
  question: 'virtual orchestrate',
  quesType: QuesType['FILL_IN'],
};

export const sampleWithFullData: IQuestion = {
  id: 77477,
  question: 'e-tailers Venezuela',
  quesType: QuesType['FILL_IN'],
};

export const sampleWithNewData: NewQuestion = {
  question: 'infomediaries',
  quesType: QuesType['PARENT_QUESTION'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
