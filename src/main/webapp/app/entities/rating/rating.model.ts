import { ICaterers } from 'app/entities/caterers/caterers.model';
import { IActivityCompany } from 'app/entities/activity-company/activity-company.model';
import { IBookedActivity } from 'app/entities/booked-activity/booked-activity.model';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';

export interface IRating {
  id: number;
  value?: number | null;
  caterers?: Pick<ICaterers, 'id'> | null;
  activityCompany?: Pick<IActivityCompany, 'id'> | null;
  bookedActivity?: Pick<IBookedActivity, 'id'> | null;
  activitySelf?: Pick<IActivitySelf, 'id'> | null;
}

export type NewRating = Omit<IRating, 'id'> & { id: null };
