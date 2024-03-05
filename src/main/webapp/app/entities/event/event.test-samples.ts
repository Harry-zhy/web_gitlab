import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 63022,
};

export const sampleWithPartialData: IEvent = {
  id: 43735,
  title: 'Borders Games',
};

export const sampleWithFullData: IEvent = {
  id: 852,
  date: dayjs('2024-03-05T08:33'),
  spaces: 72471,
  title: 'transform one-to-one',
};

export const sampleWithNewData: NewEvent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
