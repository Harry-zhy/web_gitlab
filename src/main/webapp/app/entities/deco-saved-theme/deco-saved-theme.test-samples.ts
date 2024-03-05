import { IDecoSavedTheme, NewDecoSavedTheme } from './deco-saved-theme.model';

export const sampleWithRequiredData: IDecoSavedTheme = {
  id: 19353,
};

export const sampleWithPartialData: IDecoSavedTheme = {
  id: 25204,
  name: 'XML Public-key',
};

export const sampleWithFullData: IDecoSavedTheme = {
  id: 32668,
  name: 'FTP Account',
};

export const sampleWithNewData: NewDecoSavedTheme = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
