import { IOneFeedback, NewOneFeedback } from './one-feedback.model';

export const sampleWithRequiredData: IOneFeedback = {
  id: 12779,
  content: 'Iowa experiences',
  withMultiMedia: false,
};

export const sampleWithPartialData: IOneFeedback = {
  id: 81083,
  content: 'Table capacitor',
  withMultiMedia: false,
};

export const sampleWithFullData: IOneFeedback = {
  id: 36976,
  content: 'hack JBOD connecting',
  withMultiMedia: true,
  imagePath: 'Islands maroon',
  videoPath: 'Down-sized Toys plum',
};

export const sampleWithNewData: NewOneFeedback = {
  content: 'mission-critical National',
  withMultiMedia: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
