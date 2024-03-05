import dayjs from 'dayjs/esm';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { ISupplier } from 'app/entities/supplier/supplier.model';

export interface IVenueInformation {
  id: number;
  name?: string | null;
  price?: number | null;
  capacity?: number | null;
  location?: string | null;
  openingTimeFrom?: dayjs.Dayjs | null;
  openingTimeUntil?: dayjs.Dayjs | null;
  picture?: string | null;
  pictureContentType?: string | null;
  eventItinerary?: Pick<IEventItinerary, 'id'> | null;
  supplier?: Pick<ISupplier, 'id'> | null;
}

export type NewVenueInformation = Omit<IVenueInformation, 'id'> & { id: null };
