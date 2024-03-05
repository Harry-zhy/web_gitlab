import dayjs from 'dayjs/esm';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { NotificationStatus } from 'app/entities/enumerations/notification-status.model';

export interface INotification {
  id: number;
  receivedDate?: dayjs.Dayjs | null;
  status?: NotificationStatus | null;
  supplier?: Pick<ISupplier, 'id'> | null;
}

export type NewNotification = Omit<INotification, 'id'> & { id: null };
