import dayjs from 'dayjs/esm';

export interface IItineraryDateTime {
  id: number;
  date?: dayjs.Dayjs | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
}

export type NewItineraryDateTime = Omit<IItineraryDateTime, 'id'> & { id: null };
