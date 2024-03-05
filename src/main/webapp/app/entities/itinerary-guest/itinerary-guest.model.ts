import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';

export interface IItineraryGuest {
  id: number;
  name?: string | null;
  email?: string | null;
  rsvpStatus?: boolean | null;
  eventItineraries?: Pick<IEventItinerary, 'id'>[] | null;
}

export type NewItineraryGuest = Omit<IItineraryGuest, 'id'> & { id: null };
