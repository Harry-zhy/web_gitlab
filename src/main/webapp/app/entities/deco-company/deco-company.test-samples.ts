import { IDecoCompany, NewDecoCompany } from './deco-company.model';

export const sampleWithRequiredData: IDecoCompany = {
  id: 79035,
  name: 'networks',
};

export const sampleWithPartialData: IDecoCompany = {
  id: 54374,
  name: 'Georgia ROI connecting',
  rating: 79596,
};

export const sampleWithFullData: IDecoCompany = {
  id: 65776,
  name: 'user-centric Persevering Avon',
  about: 'Associate',
  rating: 43770,
};

export const sampleWithNewData: NewDecoCompany = {
  name: 'Checking Helena South',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
