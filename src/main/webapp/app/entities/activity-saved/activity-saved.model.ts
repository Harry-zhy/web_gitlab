import dayjs from 'dayjs/esm';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { IBookedActivity } from 'app/entities/booked-activity/booked-activity.model';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';

export interface IActivitySaved {
  id: number;
  name?: string | null;
  date?: dayjs.Dayjs | null;
  company?: string | null;
  eventItinerary?: Pick<IEventItinerary, 'id'> | null;
  bookedActivities?: Pick<IBookedActivity, 'id'>[] | null;
  activitySelves?: Pick<IActivitySelf, 'id'>[] | null;
}

export type NewActivitySaved = Omit<IActivitySaved, 'id'> & { id: null };
