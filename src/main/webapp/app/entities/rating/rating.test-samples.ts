import { IRating, NewRating } from './rating.model';

export const sampleWithRequiredData: IRating = {
  id: 92458,
  value: 88012,
};

export const sampleWithPartialData: IRating = {
  id: 38329,
  value: 62920,
};

export const sampleWithFullData: IRating = {
  id: 48944,
  value: 33071,
};

export const sampleWithNewData: NewRating = {
  value: 32763,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
