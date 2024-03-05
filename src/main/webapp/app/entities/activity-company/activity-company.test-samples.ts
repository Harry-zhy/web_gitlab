import { IActivityCompany, NewActivityCompany } from './activity-company.model';

export const sampleWithRequiredData: IActivityCompany = {
  id: 50380,
  name: 'Fresh',
};

export const sampleWithPartialData: IActivityCompany = {
  id: 61765,
  name: 'Garden El',
};

export const sampleWithFullData: IActivityCompany = {
  id: 74545,
  name: 'Inlet solid',
  about: 'Devolved contingency',
};

export const sampleWithNewData: NewActivityCompany = {
  name: 'Electronics success parsing',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
