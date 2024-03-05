import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../event-itinerary.test-samples';

import { EventItineraryFormService } from './event-itinerary-form.service';

describe('EventItinerary Form Service', () => {
  let service: EventItineraryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventItineraryFormService);
  });

  describe('Service methods', () => {
    describe('createEventItineraryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEventItineraryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numberOfGuests: expect.any(Object),
            eventDate: expect.any(Object),
            itineraryGuests: expect.any(Object),
          })
        );
      });

      it('passing IEventItinerary should create a new form with FormGroup', () => {
        const formGroup = service.createEventItineraryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numberOfGuests: expect.any(Object),
            eventDate: expect.any(Object),
            itineraryGuests: expect.any(Object),
          })
        );
      });
    });

    describe('getEventItinerary', () => {
      it('should return NewEventItinerary for default EventItinerary initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEventItineraryFormGroup(sampleWithNewData);

        const eventItinerary = service.getEventItinerary(formGroup) as any;

        expect(eventItinerary).toMatchObject(sampleWithNewData);
      });

      it('should return NewEventItinerary for empty EventItinerary initial value', () => {
        const formGroup = service.createEventItineraryFormGroup();

        const eventItinerary = service.getEventItinerary(formGroup) as any;

        expect(eventItinerary).toMatchObject({});
      });

      it('should return IEventItinerary', () => {
        const formGroup = service.createEventItineraryFormGroup(sampleWithRequiredData);

        const eventItinerary = service.getEventItinerary(formGroup) as any;

        expect(eventItinerary).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEventItinerary should not enable id FormControl', () => {
        const formGroup = service.createEventItineraryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEventItinerary should disable id FormControl', () => {
        const formGroup = service.createEventItineraryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
