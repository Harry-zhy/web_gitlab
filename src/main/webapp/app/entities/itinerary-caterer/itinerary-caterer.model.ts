import dayjs from 'dayjs/esm';

export interface IItineraryCaterer {
  id: number;
  catererName?: string | null;
  catererCost?: number | null;
  catererHost?: string | null;
  catererTime?: dayjs.Dayjs | null;
}

export type NewItineraryCaterer = Omit<IItineraryCaterer, 'id'> & { id: null };
