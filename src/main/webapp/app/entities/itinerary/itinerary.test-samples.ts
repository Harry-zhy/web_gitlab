import dayjs from 'dayjs/esm';

import { IItinerary, NewItinerary } from './itinerary.model';

export const sampleWithRequiredData: IItinerary = {
  id: 15011,
};

export const sampleWithPartialData: IItinerary = {
  id: 63396,
  startTime: dayjs('2024-03-04T16:08'),
};

export const sampleWithFullData: IItinerary = {
  id: 29203,
  startTime: dayjs('2024-03-05T09:16'),
  endTime: dayjs('2024-03-05T08:55'),
  location: 'copying',
};

export const sampleWithNewData: NewItinerary = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
