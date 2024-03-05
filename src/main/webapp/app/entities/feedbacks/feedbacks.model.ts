import dayjs from 'dayjs/esm';
import { IRating } from 'app/entities/rating/rating.model';
import { ISupplier } from 'app/entities/supplier/supplier.model';

export interface IFeedbacks {
  id: number;
  date?: dayjs.Dayjs | null;
  userName?: string | null;
  rating?: Pick<IRating, 'id'> | null;
  supplier?: Pick<ISupplier, 'id'> | null;
}

export type NewFeedbacks = Omit<IFeedbacks, 'id'> & { id: null };
