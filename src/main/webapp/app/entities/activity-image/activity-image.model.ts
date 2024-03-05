import { IActivityCompany } from 'app/entities/activity-company/activity-company.model';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';

export interface IActivityImage {
  id: number;
  picture?: string | null;
  pictureContentType?: string | null;
  activityCompany?: Pick<IActivityCompany, 'id'> | null;
  activitySelf?: Pick<IActivitySelf, 'id'> | null;
}

export type NewActivityImage = Omit<IActivityImage, 'id'> & { id: null };
