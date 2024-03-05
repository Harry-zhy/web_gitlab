import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../itinerary-activity.test-samples';

import { ItineraryActivityFormService } from './itinerary-activity-form.service';

describe('ItineraryActivity Form Service', () => {
  let service: ItineraryActivityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItineraryActivityFormService);
  });

  describe('Service methods', () => {
    describe('createItineraryActivityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItineraryActivityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            activityName: expect.any(Object),
            activityCost: expect.any(Object),
            activityHost: expect.any(Object),
            activityTime: expect.any(Object),
          })
        );
      });

      it('passing IItineraryActivity should create a new form with FormGroup', () => {
        const formGroup = service.createItineraryActivityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            activityName: expect.any(Object),
            activityCost: expect.any(Object),
            activityHost: expect.any(Object),
            activityTime: expect.any(Object),
          })
        );
      });
    });

    describe('getItineraryActivity', () => {
      it('should return NewItineraryActivity for default ItineraryActivity initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItineraryActivityFormGroup(sampleWithNewData);

        const itineraryActivity = service.getItineraryActivity(formGroup) as any;

        expect(itineraryActivity).toMatchObject(sampleWithNewData);
      });

      it('should return NewItineraryActivity for empty ItineraryActivity initial value', () => {
        const formGroup = service.createItineraryActivityFormGroup();

        const itineraryActivity = service.getItineraryActivity(formGroup) as any;

        expect(itineraryActivity).toMatchObject({});
      });

      it('should return IItineraryActivity', () => {
        const formGroup = service.createItineraryActivityFormGroup(sampleWithRequiredData);

        const itineraryActivity = service.getItineraryActivity(formGroup) as any;

        expect(itineraryActivity).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItineraryActivity should not enable id FormControl', () => {
        const formGroup = service.createItineraryActivityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItineraryActivity should disable id FormControl', () => {
        const formGroup = service.createItineraryActivityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
