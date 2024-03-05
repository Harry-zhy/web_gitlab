import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../itinerary-guest.test-samples';

import { ItineraryGuestFormService } from './itinerary-guest-form.service';

describe('ItineraryGuest Form Service', () => {
  let service: ItineraryGuestFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItineraryGuestFormService);
  });

  describe('Service methods', () => {
    describe('createItineraryGuestFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItineraryGuestFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            email: expect.any(Object),
            rsvpStatus: expect.any(Object),
            eventItineraries: expect.any(Object),
          })
        );
      });

      it('passing IItineraryGuest should create a new form with FormGroup', () => {
        const formGroup = service.createItineraryGuestFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            email: expect.any(Object),
            rsvpStatus: expect.any(Object),
            eventItineraries: expect.any(Object),
          })
        );
      });
    });

    describe('getItineraryGuest', () => {
      it('should return NewItineraryGuest for default ItineraryGuest initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItineraryGuestFormGroup(sampleWithNewData);

        const itineraryGuest = service.getItineraryGuest(formGroup) as any;

        expect(itineraryGuest).toMatchObject(sampleWithNewData);
      });

      it('should return NewItineraryGuest for empty ItineraryGuest initial value', () => {
        const formGroup = service.createItineraryGuestFormGroup();

        const itineraryGuest = service.getItineraryGuest(formGroup) as any;

        expect(itineraryGuest).toMatchObject({});
      });

      it('should return IItineraryGuest', () => {
        const formGroup = service.createItineraryGuestFormGroup(sampleWithRequiredData);

        const itineraryGuest = service.getItineraryGuest(formGroup) as any;

        expect(itineraryGuest).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItineraryGuest should not enable id FormControl', () => {
        const formGroup = service.createItineraryGuestFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItineraryGuest should disable id FormControl', () => {
        const formGroup = service.createItineraryGuestFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
