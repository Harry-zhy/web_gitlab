import dayjs from 'dayjs/esm';

import { IVenueInformation, NewVenueInformation } from './venue-information.model';

export const sampleWithRequiredData: IVenueInformation = {
  id: 18772,
};

export const sampleWithPartialData: IVenueInformation = {
  id: 38736,
  name: 'compress enhance',
  capacity: 94896,
  location: 'Awesome Cambridgeshire',
  openingTimeFrom: dayjs('2024-03-04T20:33'),
  openingTimeUntil: dayjs('2024-03-05T14:19'),
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithFullData: IVenueInformation = {
  id: 30391,
  name: 'ADP SMS',
  price: 60478,
  capacity: 51744,
  location: 'Programmable',
  openingTimeFrom: dayjs('2024-03-05T14:14'),
  openingTimeUntil: dayjs('2024-03-05T14:17'),
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithNewData: NewVenueInformation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
