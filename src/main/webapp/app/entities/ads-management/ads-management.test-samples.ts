import { IAdsManagement, NewAdsManagement } from './ads-management.model';

export const sampleWithRequiredData: IAdsManagement = {
  id: 93856,
};

export const sampleWithPartialData: IAdsManagement = {
  id: 73479,
  age: 98039,
  gender: 'Wooden Home',
  location: 'Greens Tuna Branding',
};

export const sampleWithFullData: IAdsManagement = {
  id: 34505,
  age: 66259,
  gender: 'copying productivity card',
  preference: 'parse Mouse',
  location: 'navigate Toys',
};

export const sampleWithNewData: NewAdsManagement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
