import { IDecoContactDetails } from 'app/entities/deco-contact-details/deco-contact-details.model';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { IDecoSavedCompany } from 'app/entities/deco-saved-company/deco-saved-company.model';
import { IDecoBudget } from 'app/entities/deco-budget/deco-budget.model';

export interface IDecoCompany {
  id: number;
  name?: string | null;
  about?: string | null;
  rating?: number | null;
  decoContactDetails?: Pick<IDecoContactDetails, 'id'> | null;
  supplier?: Pick<ISupplier, 'id'> | null;
  decoSavedCompanies?: Pick<IDecoSavedCompany, 'id'>[] | null;
  decoBudgets?: Pick<IDecoBudget, 'id'>[] | null;
}

export type NewDecoCompany = Omit<IDecoCompany, 'id'> & { id: null };
