export interface IItineraryVenue {
  id: number;
  venueName?: string | null;
  venueCost?: number | null;
  venueHost?: string | null;
  venueAddress?: string | null;
}

export type NewItineraryVenue = Omit<IItineraryVenue, 'id'> & { id: null };
