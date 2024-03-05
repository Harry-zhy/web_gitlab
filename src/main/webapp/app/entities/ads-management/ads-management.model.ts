import { ISupplier } from 'app/entities/supplier/supplier.model';

export interface IAdsManagement {
  id: number;
  age?: number | null;
  gender?: string | null;
  preference?: string | null;
  location?: string | null;
  supplier?: Pick<ISupplier, 'id'> | null;
}

export type NewAdsManagement = Omit<IAdsManagement, 'id'> & { id: null };
