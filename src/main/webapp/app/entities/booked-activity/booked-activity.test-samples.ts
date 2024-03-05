import { IBookedActivity, NewBookedActivity } from './booked-activity.model';

export const sampleWithRequiredData: IBookedActivity = {
  id: 7619,
  name: 'programming Auto',
};

export const sampleWithPartialData: IBookedActivity = {
  id: 92317,
  name: 'indigo Coordinator calculating',
};

export const sampleWithFullData: IBookedActivity = {
  id: 44839,
  name: 'synthesizing teal technologies',
};

export const sampleWithNewData: NewBookedActivity = {
  name: 'microchip cyan Wooden',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
