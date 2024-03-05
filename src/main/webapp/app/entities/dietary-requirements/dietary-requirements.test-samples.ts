import { IDietaryRequirements, NewDietaryRequirements } from './dietary-requirements.model';

export const sampleWithRequiredData: IDietaryRequirements = {
  id: 1635,
};

export const sampleWithPartialData: IDietaryRequirements = {
  id: 90746,
};

export const sampleWithFullData: IDietaryRequirements = {
  id: 41368,
  option: 'Mill maximize turquoise',
};

export const sampleWithNewData: NewDietaryRequirements = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
