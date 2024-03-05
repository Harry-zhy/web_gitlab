import dayjs from 'dayjs/esm';

import { IItineraryCaterer, NewItineraryCaterer } from './itinerary-caterer.model';

export const sampleWithRequiredData: IItineraryCaterer = {
  id: 41636,
};

export const sampleWithPartialData: IItineraryCaterer = {
  id: 90535,
  catererName: 'Borders azure',
  catererCost: 5093,
  catererTime: dayjs('2024-03-04T23:46'),
};

export const sampleWithFullData: IItineraryCaterer = {
  id: 98718,
  catererName: 'Metrics violet',
  catererCost: 90850,
  catererHost: 'monetize Keyboard',
  catererTime: dayjs('2024-03-05T02:33'),
};

export const sampleWithNewData: NewItineraryCaterer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
