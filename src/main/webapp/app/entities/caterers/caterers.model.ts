import { IBookedCaterer } from 'app/entities/booked-caterer/booked-caterer.model';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { IDietaryRequirements } from 'app/entities/dietary-requirements/dietary-requirements.model';
import { ICuisine } from 'app/entities/cuisine/cuisine.model';
import { IEvent } from 'app/entities/event/event.model';

export interface ICaterers {
  id: number;
  name?: string | null;
  picture?: string | null;
  pictureContentType?: string | null;
  pricePerPerson?: number | null;
  guestLimit?: number | null;
  bookedCaterer?: Pick<IBookedCaterer, 'id'> | null;
  eventItinerary?: Pick<IEventItinerary, 'id'> | null;
  supplier?: Pick<ISupplier, 'id'> | null;
  dietaryRequirements?: Pick<IDietaryRequirements, 'id'>[] | null;
  cuisines?: Pick<ICuisine, 'id'>[] | null;
  event?: Pick<IEvent, 'id'> | null;
}

export type NewCaterers = Omit<ICaterers, 'id'> & { id: null };
