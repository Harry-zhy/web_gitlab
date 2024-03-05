import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';

export interface IActivityIdea {
  id: number;
  description?: string | null;
  link?: string | null;
  activitySelf?: Pick<IActivitySelf, 'id'> | null;
}

export type NewActivityIdea = Omit<IActivityIdea, 'id'> & { id: null };
