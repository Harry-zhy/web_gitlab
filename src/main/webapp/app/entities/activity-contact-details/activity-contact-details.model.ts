import { IActivityCompany } from 'app/entities/activity-company/activity-company.model';

export interface IActivityContactDetails {
  id: number;
  website?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  phoneNumber?: string | null;
  activityCompany?: Pick<IActivityCompany, 'id'> | null;
}

export type NewActivityContactDetails = Omit<IActivityContactDetails, 'id'> & { id: null };
