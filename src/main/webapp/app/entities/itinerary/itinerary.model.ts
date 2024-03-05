import dayjs from 'dayjs/esm';

export interface IItinerary {
  id: number;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  location?: string | null;
}

export type NewItinerary = Omit<IItinerary, 'id'> & { id: null };
