import { IMockCatererEntity, NewMockCatererEntity } from './mock-caterer-entity.model';

export const sampleWithRequiredData: IMockCatererEntity = {
  id: 15447,
  rating: 2,
};

export const sampleWithPartialData: IMockCatererEntity = {
  id: 35273,
  rating: 0,
  description: 'Inlet',
};

export const sampleWithFullData: IMockCatererEntity = {
  id: 40095,
  name: 'Garden',
  cuisine: 'input facilitate',
  rating: 4,
  description: 'CSS Metal',
  quantity: 71314,
  contact: 'Operations knowledge input',
};

export const sampleWithNewData: NewMockCatererEntity = {
  rating: 1,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
