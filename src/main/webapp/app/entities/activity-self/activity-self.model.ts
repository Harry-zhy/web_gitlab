import { IActivitySaved } from 'app/entities/activity-saved/activity-saved.model';
import { IEvent } from 'app/entities/event/event.model';

export interface IActivitySelf {
  id: number;
  name?: string | null;
  description?: string | null;
  activitySaveds?: Pick<IActivitySaved, 'id'>[] | null;
  event?: Pick<IEvent, 'id'> | null;
}

export type NewActivitySelf = Omit<IActivitySelf, 'id'> & { id: null };
