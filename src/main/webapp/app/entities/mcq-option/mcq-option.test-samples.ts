import { IMCQOption, NewMCQOption } from './mcq-option.model';

export const sampleWithRequiredData: IMCQOption = {
  id: 88200,
  value: 'Rustic',
};

export const sampleWithPartialData: IMCQOption = {
  id: 73066,
  value: 'Borders lavender next-generation',
};

export const sampleWithFullData: IMCQOption = {
  id: 83554,
  value: 'best-of-breed Corporate',
};

export const sampleWithNewData: NewMCQOption = {
  value: 'enable',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
