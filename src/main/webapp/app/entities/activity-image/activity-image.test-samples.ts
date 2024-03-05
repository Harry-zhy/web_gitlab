import { IActivityImage, NewActivityImage } from './activity-image.model';

export const sampleWithRequiredData: IActivityImage = {
  id: 78473,
};

export const sampleWithPartialData: IActivityImage = {
  id: 11170,
};

export const sampleWithFullData: IActivityImage = {
  id: 77090,
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithNewData: NewActivityImage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
