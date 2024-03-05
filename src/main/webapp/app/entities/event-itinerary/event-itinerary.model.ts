import { IItineraryDateTime } from 'app/entities/itinerary-date-time/itinerary-date-time.model';
import { IItineraryGuest } from 'app/entities/itinerary-guest/itinerary-guest.model';

export interface IEventItinerary {
  id: number;
  numberOfGuests?: number | null;
  eventDate?: Pick<IItineraryDateTime, 'id'> | null;
  itineraryGuests?: Pick<IItineraryGuest, 'id'>[] | null;
}

export type NewEventItinerary = Omit<IEventItinerary, 'id'> & { id: null };
