import { ICaterers, NewCaterers } from './caterers.model';

export const sampleWithRequiredData: ICaterers = {
  id: 79442,
};

export const sampleWithPartialData: ICaterers = {
  id: 63344,
  guestLimit: 85730,
};

export const sampleWithFullData: ICaterers = {
  id: 16481,
  name: 'back-end cutting-edge',
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
  pricePerPerson: 56623,
  guestLimit: 52839,
};

export const sampleWithNewData: NewCaterers = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
