import dayjs from 'dayjs/esm';

import { IQuestionnaire, NewQuestionnaire } from './questionnaire.model';

export const sampleWithRequiredData: IQuestionnaire = {
  id: 6169,
  date: dayjs('2024-03-04T22:37'),
  userName: 'moderator Executive Berkshire',
};

export const sampleWithPartialData: IQuestionnaire = {
  id: 42321,
  date: dayjs('2024-03-05T10:17'),
  userName: 'adapter',
};

export const sampleWithFullData: IQuestionnaire = {
  id: 18145,
  date: dayjs('2024-03-04T20:20'),
  userName: 'Optimization Steel TCP',
};

export const sampleWithNewData: NewQuestionnaire = {
  date: dayjs('2024-03-05T00:16'),
  userName: 'process Bike sky',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
