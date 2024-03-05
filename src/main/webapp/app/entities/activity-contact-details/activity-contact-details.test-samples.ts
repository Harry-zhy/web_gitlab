import { IActivityContactDetails, NewActivityContactDetails } from './activity-contact-details.model';

export const sampleWithRequiredData: IActivityContactDetails = {
  id: 26240,
};

export const sampleWithPartialData: IActivityContactDetails = {
  id: 13360,
  instagram: 'SMS Centralized Canyon',
  facebook: 'viral collaborative',
  tiktok: 'Soap Executive',
  phoneNumber: 'Account Checking',
};

export const sampleWithFullData: IActivityContactDetails = {
  id: 63051,
  website: 'Tools Bike overriding',
  twitter: 'synergies Keyboard Internal',
  instagram: 'cultivate',
  facebook: 'Rustic',
  tiktok: 'solutions',
  phoneNumber: 'engineer 1080p communities',
};

export const sampleWithNewData: NewActivityContactDetails = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
