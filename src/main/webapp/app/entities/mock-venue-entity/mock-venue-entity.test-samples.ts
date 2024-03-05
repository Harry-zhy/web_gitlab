import { IMockVenueEntity, NewMockVenueEntity } from './mock-venue-entity.model';

export const sampleWithRequiredData: IMockVenueEntity = {
  id: 76382,
  rating: 0,
};

export const sampleWithPartialData: IMockVenueEntity = {
  id: 8900,
  name: 'blockchains Administrator Keyboard',
  companyName: 'grow time-frame microchip',
  rating: 1,
  description: 'Metal Games',
};

export const sampleWithFullData: IMockVenueEntity = {
  id: 97126,
  name: 'open-source cultivate',
  companyName: 'systematic',
  location: 'global',
  rating: 2,
  description: 'Lari Latvian Dinar',
  contact: 'Awesome withdrawal Kyat',
};

export const sampleWithNewData: NewMockVenueEntity = {
  rating: 5,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
