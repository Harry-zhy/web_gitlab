import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../itinerary-venue.test-samples';

import { ItineraryVenueFormService } from './itinerary-venue-form.service';

describe('ItineraryVenue Form Service', () => {
  let service: ItineraryVenueFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItineraryVenueFormService);
  });

  describe('Service methods', () => {
    describe('createItineraryVenueFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItineraryVenueFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            venueName: expect.any(Object),
            venueCost: expect.any(Object),
            venueHost: expect.any(Object),
            venueAddress: expect.any(Object),
          })
        );
      });

      it('passing IItineraryVenue should create a new form with FormGroup', () => {
        const formGroup = service.createItineraryVenueFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            venueName: expect.any(Object),
            venueCost: expect.any(Object),
            venueHost: expect.any(Object),
            venueAddress: expect.any(Object),
          })
        );
      });
    });

    describe('getItineraryVenue', () => {
      it('should return NewItineraryVenue for default ItineraryVenue initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItineraryVenueFormGroup(sampleWithNewData);

        const itineraryVenue = service.getItineraryVenue(formGroup) as any;

        expect(itineraryVenue).toMatchObject(sampleWithNewData);
      });

      it('should return NewItineraryVenue for empty ItineraryVenue initial value', () => {
        const formGroup = service.createItineraryVenueFormGroup();

        const itineraryVenue = service.getItineraryVenue(formGroup) as any;

        expect(itineraryVenue).toMatchObject({});
      });

      it('should return IItineraryVenue', () => {
        const formGroup = service.createItineraryVenueFormGroup(sampleWithRequiredData);

        const itineraryVenue = service.getItineraryVenue(formGroup) as any;

        expect(itineraryVenue).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItineraryVenue should not enable id FormControl', () => {
        const formGroup = service.createItineraryVenueFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItineraryVenue should disable id FormControl', () => {
        const formGroup = service.createItineraryVenueFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
