import dayjs from 'dayjs/esm';
import { IMockVenueEntity } from 'app/entities/mock-venue-entity/mock-venue-entity.model';

export interface IEvent {
  id: number;
  date?: dayjs.Dayjs | null;
  spaces?: number | null;
  title?: string | null;
  venue?: Pick<IMockVenueEntity, 'id'> | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
