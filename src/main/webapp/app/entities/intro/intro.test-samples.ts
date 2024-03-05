import { IIntro, NewIntro } from './intro.model';

export const sampleWithRequiredData: IIntro = {
  id: 30242,
  title: 'copying',
  salutation: 'aggregate Concrete',
  body: 'Netherlands CSS',
};

export const sampleWithPartialData: IIntro = {
  id: 70886,
  title: 'Tugrik',
  salutation: 'transmitter navigate',
  body: 'fuchsia',
};

export const sampleWithFullData: IIntro = {
  id: 15232,
  title: 'calculating Wooden Loan',
  salutation: 'Home quantify Vatu',
  body: 'Personal Car',
};

export const sampleWithNewData: NewIntro = {
  title: 'Fantastic monitor',
  salutation: 'orchestrate',
  body: 'Directives Planner',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
