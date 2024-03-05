import { IDecoThemes, NewDecoThemes } from './deco-themes.model';

export const sampleWithRequiredData: IDecoThemes = {
  id: 32641,
};

export const sampleWithPartialData: IDecoThemes = {
  id: 99631,
};

export const sampleWithFullData: IDecoThemes = {
  id: 6338,
  description: 'Loan',
  name: 'systemic Global Brand',
};

export const sampleWithNewData: NewDecoThemes = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
