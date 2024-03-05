import { ISupplier } from 'app/entities/supplier/supplier.model';
import { IBookedActivity } from 'app/entities/booked-activity/booked-activity.model';

export interface IActivityCompany {
  id: number;
  name?: string | null;
  about?: string | null;
  supplier?: Pick<ISupplier, 'id'> | null;
  bookedActivity?: Pick<IBookedActivity, 'id'> | null;
}

export type NewActivityCompany = Omit<IActivityCompany, 'id'> & { id: null };
