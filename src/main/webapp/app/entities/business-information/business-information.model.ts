import { ISupplier } from 'app/entities/supplier/supplier.model';

export interface IBusinessInformation {
  id: number;
  information?: string | null;
  businessHours?: string | null;
  specialServicesAvailable?: string | null;
  supplier?: Pick<ISupplier, 'id'> | null;
}

export type NewBusinessInformation = Omit<IBusinessInformation, 'id'> & { id: null };
