import { IMockActivityEntity, NewMockActivityEntity } from './mock-activity-entity.model';

export const sampleWithRequiredData: IMockActivityEntity = {
  id: 25820,
  rating: 3,
};

export const sampleWithPartialData: IMockActivityEntity = {
  id: 72846,
  name: 'Automotive withdrawal',
  rating: 2,
  description: 'Island',
  quantity: 83062,
  contact: 'frame sensor hack',
};

export const sampleWithFullData: IMockActivityEntity = {
  id: 22761,
  name: 'Analyst',
  companyName: 'orchestrate efficient Bedfordshire',
  rating: 0,
  description: 'Dollar Malawi Reverse-engineered',
  quantity: 32453,
  contact: 'navigate Towels Internal',
};

export const sampleWithNewData: NewMockActivityEntity = {
  rating: 1,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
