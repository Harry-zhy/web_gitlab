import { IDecoCompany } from 'app/entities/deco-company/deco-company.model';

export interface IDecoSavedCompany {
  id: number;
  name?: string | null;
  decoCompanies?: Pick<IDecoCompany, 'id'>[] | null;
}

export type NewDecoSavedCompany = Omit<IDecoSavedCompany, 'id'> & { id: null };
