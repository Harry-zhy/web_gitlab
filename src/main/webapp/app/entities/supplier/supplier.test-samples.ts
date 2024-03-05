import { ISupplier, NewSupplier } from './supplier.model';

export const sampleWithRequiredData: ISupplier = {
  id: 7333,
};

export const sampleWithPartialData: ISupplier = {
  id: 53975,
  isSupplier: false,
};

export const sampleWithFullData: ISupplier = {
  id: 43379,
  isSupplier: false,
};

export const sampleWithNewData: NewSupplier = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
