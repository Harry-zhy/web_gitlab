import { IActivityIdea, NewActivityIdea } from './activity-idea.model';

export const sampleWithRequiredData: IActivityIdea = {
  id: 83557,
  description: 'Rubber success',
};

export const sampleWithPartialData: IActivityIdea = {
  id: 42967,
  description: 'target',
};

export const sampleWithFullData: IActivityIdea = {
  id: 14593,
  description: 'Sleek',
  link: 'lavender Avon',
};

export const sampleWithNewData: NewActivityIdea = {
  description: 'syndicate deposit',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
