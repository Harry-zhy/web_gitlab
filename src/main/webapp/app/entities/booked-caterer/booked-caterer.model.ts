import { IItinerary } from 'app/entities/itinerary/itinerary.model';

export interface IBookedCaterer {
  id: number;
  confirmationStatus?: boolean | null;
  itinerary?: Pick<IItinerary, 'id'> | null;
}

export type NewBookedCaterer = Omit<IBookedCaterer, 'id'> & { id: null };
