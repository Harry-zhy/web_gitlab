import { IDecoSavedCompany, NewDecoSavedCompany } from './deco-saved-company.model';

export const sampleWithRequiredData: IDecoSavedCompany = {
  id: 94977,
};

export const sampleWithPartialData: IDecoSavedCompany = {
  id: 42563,
};

export const sampleWithFullData: IDecoSavedCompany = {
  id: 78391,
  name: 'virtual',
};

export const sampleWithNewData: NewDecoSavedCompany = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
