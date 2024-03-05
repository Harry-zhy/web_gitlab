import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../itinerary.test-samples';

import { ItineraryFormService } from './itinerary-form.service';

describe('Itinerary Form Service', () => {
  let service: ItineraryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItineraryFormService);
  });

  describe('Service methods', () => {
    describe('createItineraryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItineraryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            location: expect.any(Object),
          })
        );
      });

      it('passing IItinerary should create a new form with FormGroup', () => {
        const formGroup = service.createItineraryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            location: expect.any(Object),
          })
        );
      });
    });

    describe('getItinerary', () => {
      it('should return NewItinerary for default Itinerary initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItineraryFormGroup(sampleWithNewData);

        const itinerary = service.getItinerary(formGroup) as any;

        expect(itinerary).toMatchObject(sampleWithNewData);
      });

      it('should return NewItinerary for empty Itinerary initial value', () => {
        const formGroup = service.createItineraryFormGroup();

        const itinerary = service.getItinerary(formGroup) as any;

        expect(itinerary).toMatchObject({});
      });

      it('should return IItinerary', () => {
        const formGroup = service.createItineraryFormGroup(sampleWithRequiredData);

        const itinerary = service.getItinerary(formGroup) as any;

        expect(itinerary).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItinerary should not enable id FormControl', () => {
        const formGroup = service.createItineraryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItinerary should disable id FormControl', () => {
        const formGroup = service.createItineraryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
