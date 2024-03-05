import dayjs from 'dayjs/esm';

import { IItineraryDateTime, NewItineraryDateTime } from './itinerary-date-time.model';

export const sampleWithRequiredData: IItineraryDateTime = {
  id: 47127,
};

export const sampleWithPartialData: IItineraryDateTime = {
  id: 29253,
};

export const sampleWithFullData: IItineraryDateTime = {
  id: 70219,
  date: dayjs('2024-03-04T17:49'),
  startTime: dayjs('2024-03-04T18:56'),
  endTime: dayjs('2024-03-05T00:49'),
};

export const sampleWithNewData: NewItineraryDateTime = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
