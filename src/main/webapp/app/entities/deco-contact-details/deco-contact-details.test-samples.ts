import { IDecoContactDetails, NewDecoContactDetails } from './deco-contact-details.model';

export const sampleWithRequiredData: IDecoContactDetails = {
  id: 40682,
};

export const sampleWithPartialData: IDecoContactDetails = {
  id: 8602,
  phoneNumber: 'Lead Market',
  instagram: 'Frozen Refined lime',
};

export const sampleWithFullData: IDecoContactDetails = {
  id: 58689,
  website: 'Soft Missouri Loan',
  phoneNumber: 'Architect',
  instagram: 'convergence',
  twitter: 'Fresh',
  facebook: 'up',
  tiktok: 'Polynesia generation bandwidth',
};

export const sampleWithNewData: NewDecoContactDetails = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
