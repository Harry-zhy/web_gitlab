import dayjs from 'dayjs/esm';

export interface IItineraryActivity {
  id: number;
  activityName?: string | null;
  activityCost?: number | null;
  activityHost?: string | null;
  activityTime?: dayjs.Dayjs | null;
}

export type NewItineraryActivity = Omit<IItineraryActivity, 'id'> & { id: null };
