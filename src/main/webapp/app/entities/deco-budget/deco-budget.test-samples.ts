import { IDecoBudget, NewDecoBudget } from './deco-budget.model';

export const sampleWithRequiredData: IDecoBudget = {
  id: 46700,
};

export const sampleWithPartialData: IDecoBudget = {
  id: 45663,
};

export const sampleWithFullData: IDecoBudget = {
  id: 69719,
  money: 44690,
};

export const sampleWithNewData: NewDecoBudget = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
