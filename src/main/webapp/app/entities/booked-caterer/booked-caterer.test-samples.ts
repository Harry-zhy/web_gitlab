import { IBookedCaterer, NewBookedCaterer } from './booked-caterer.model';

export const sampleWithRequiredData: IBookedCaterer = {
  id: 35594,
};

export const sampleWithPartialData: IBookedCaterer = {
  id: 15476,
  confirmationStatus: false,
};

export const sampleWithFullData: IBookedCaterer = {
  id: 14306,
  confirmationStatus: false,
};

export const sampleWithNewData: NewBookedCaterer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
