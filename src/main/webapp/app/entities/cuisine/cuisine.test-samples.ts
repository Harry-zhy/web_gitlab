import { ICuisine, NewCuisine } from './cuisine.model';

export const sampleWithRequiredData: ICuisine = {
  id: 48016,
};

export const sampleWithPartialData: ICuisine = {
  id: 5682,
};

export const sampleWithFullData: ICuisine = {
  id: 17136,
  region: 'Lane Manager',
};

export const sampleWithNewData: NewCuisine = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
