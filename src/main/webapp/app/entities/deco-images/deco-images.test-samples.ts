import { IDecoImages, NewDecoImages } from './deco-images.model';

export const sampleWithRequiredData: IDecoImages = {
  id: 83916,
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithPartialData: IDecoImages = {
  id: 36067,
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithFullData: IDecoImages = {
  id: 33239,
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithNewData: NewDecoImages = {
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
