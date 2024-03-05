import dayjs from 'dayjs/esm';

import { IActivitySaved, NewActivitySaved } from './activity-saved.model';

export const sampleWithRequiredData: IActivitySaved = {
  id: 67315,
  name: 'silver Cotton',
  date: dayjs('2024-03-05T04:22'),
};

export const sampleWithPartialData: IActivitySaved = {
  id: 94933,
  name: 'Arab Senegal',
  date: dayjs('2024-03-05T09:50'),
};

export const sampleWithFullData: IActivitySaved = {
  id: 20134,
  name: 'web-readiness Principal Investment',
  date: dayjs('2024-03-05T09:22'),
  company: 'Secured',
};

export const sampleWithNewData: NewActivitySaved = {
  name: 'Soap Optimization',
  date: dayjs('2024-03-04T19:34'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
