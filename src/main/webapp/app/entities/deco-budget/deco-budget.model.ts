import { IDecoCompany } from 'app/entities/deco-company/deco-company.model';

export interface IDecoBudget {
  id: number;
  money?: number | null;
  decoCompanies?: Pick<IDecoCompany, 'id'>[] | null;
}

export type NewDecoBudget = Omit<IDecoBudget, 'id'> & { id: null };
