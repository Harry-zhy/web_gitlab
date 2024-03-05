import { IActivitySaved } from 'app/entities/activity-saved/activity-saved.model';

export interface IBookedActivity {
  id: number;
  name?: string | null;
  activitySaveds?: Pick<IActivitySaved, 'id'>[] | null;
}

export type NewBookedActivity = Omit<IBookedActivity, 'id'> & { id: null };
