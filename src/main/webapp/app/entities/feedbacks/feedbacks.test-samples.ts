import dayjs from 'dayjs/esm';

import { IFeedbacks, NewFeedbacks } from './feedbacks.model';

export const sampleWithRequiredData: IFeedbacks = {
  id: 2990,
  date: dayjs('2024-03-04T17:04'),
  userName: 'PNG',
};

export const sampleWithPartialData: IFeedbacks = {
  id: 43919,
  date: dayjs('2024-03-04T18:02'),
  userName: 'content-based implementation',
};

export const sampleWithFullData: IFeedbacks = {
  id: 73628,
  date: dayjs('2024-03-04T16:02'),
  userName: 'Nevada Generic Future-proofed',
};

export const sampleWithNewData: NewFeedbacks = {
  date: dayjs('2024-03-04T21:18'),
  userName: 'Global Alabama',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
