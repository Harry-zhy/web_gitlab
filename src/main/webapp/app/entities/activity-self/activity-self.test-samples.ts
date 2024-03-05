import { IActivitySelf, NewActivitySelf } from './activity-self.model';

export const sampleWithRequiredData: IActivitySelf = {
  id: 96689,
  name: 'needs-based Paradigm Avon',
};

export const sampleWithPartialData: IActivitySelf = {
  id: 69304,
  name: 'Granite program Pants',
  description: 'mobile port deposit',
};

export const sampleWithFullData: IActivitySelf = {
  id: 28609,
  name: 'Buckinghamshire ROI',
  description: 'Gorgeous system',
};

export const sampleWithNewData: NewActivitySelf = {
  name: 'network Intranet',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
