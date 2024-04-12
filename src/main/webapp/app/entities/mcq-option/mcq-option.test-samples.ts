import { IMCQOption, NewMCQOption } from './mcq-option.model';

export const sampleWithRequiredData: IMCQOption = {
  id: 88200,
  option: 'Rustic',
};

export const sampleWithPartialData: IMCQOption = {
  id: 73066,
  option: 'Borders lavender next-generation',
};

export const sampleWithFullData: IMCQOption = {
  id: 83554,
  option: 'best-of-breed Corporate',
};

export const sampleWithNewData: NewMCQOption = {
  option: 'enable',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
