import { IItineraryGuest, NewItineraryGuest } from './itinerary-guest.model';

export const sampleWithRequiredData: IItineraryGuest = {
  id: 1064,
};

export const sampleWithPartialData: IItineraryGuest = {
  id: 9832,
  name: 'Product Soft',
  email: 'Meagan_Goodwin61@hotmail.com',
  rsvpStatus: false,
};

export const sampleWithFullData: IItineraryGuest = {
  id: 50728,
  name: 'Engineer South',
  email: 'Blake33@hotmail.com',
  rsvpStatus: false,
};

export const sampleWithNewData: NewItineraryGuest = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
