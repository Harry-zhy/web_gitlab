import { IEventItinerary, NewEventItinerary } from './event-itinerary.model';

export const sampleWithRequiredData: IEventItinerary = {
  id: 44468,
};

export const sampleWithPartialData: IEventItinerary = {
  id: 80251,
  numberOfGuests: 24443,
};

export const sampleWithFullData: IEventItinerary = {
  id: 47604,
  numberOfGuests: 18672,
};

export const sampleWithNewData: NewEventItinerary = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
