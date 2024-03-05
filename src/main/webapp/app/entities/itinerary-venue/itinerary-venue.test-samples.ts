import { IItineraryVenue, NewItineraryVenue } from './itinerary-venue.model';

export const sampleWithRequiredData: IItineraryVenue = {
  id: 86273,
};

export const sampleWithPartialData: IItineraryVenue = {
  id: 47035,
  venueName: 'User-friendly Profound',
  venueCost: 70156,
  venueHost: 'capacitor',
};

export const sampleWithFullData: IItineraryVenue = {
  id: 37330,
  venueName: 'contingency Interactions',
  venueCost: 79196,
  venueHost: 'Customizable azure Berkshire',
  venueAddress: 'Cotton Handcrafted',
};

export const sampleWithNewData: NewItineraryVenue = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
