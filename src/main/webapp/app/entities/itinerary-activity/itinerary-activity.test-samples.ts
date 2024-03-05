import dayjs from 'dayjs/esm';

import { IItineraryActivity, NewItineraryActivity } from './itinerary-activity.model';

export const sampleWithRequiredData: IItineraryActivity = {
  id: 56055,
};

export const sampleWithPartialData: IItineraryActivity = {
  id: 82040,
  activityName: 'Auto Malta bottom-line',
  activityCost: 3819,
};

export const sampleWithFullData: IItineraryActivity = {
  id: 18804,
  activityName: 'collaborative Central',
  activityCost: 13650,
  activityHost: 'hacking',
  activityTime: dayjs('2024-03-05T08:47'),
};

export const sampleWithNewData: NewItineraryActivity = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
