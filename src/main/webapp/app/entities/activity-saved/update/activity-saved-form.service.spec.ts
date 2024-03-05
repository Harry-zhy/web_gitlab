import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../activity-saved.test-samples';

import { ActivitySavedFormService } from './activity-saved-form.service';

describe('ActivitySaved Form Service', () => {
  let service: ActivitySavedFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitySavedFormService);
  });

  describe('Service methods', () => {
    describe('createActivitySavedFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActivitySavedFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            date: expect.any(Object),
            company: expect.any(Object),
            eventItinerary: expect.any(Object),
            bookedActivities: expect.any(Object),
            activitySelves: expect.any(Object),
          })
        );
      });

      it('passing IActivitySaved should create a new form with FormGroup', () => {
        const formGroup = service.createActivitySavedFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            date: expect.any(Object),
            company: expect.any(Object),
            eventItinerary: expect.any(Object),
            bookedActivities: expect.any(Object),
            activitySelves: expect.any(Object),
          })
        );
      });
    });

    describe('getActivitySaved', () => {
      it('should return NewActivitySaved for default ActivitySaved initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActivitySavedFormGroup(sampleWithNewData);

        const activitySaved = service.getActivitySaved(formGroup) as any;

        expect(activitySaved).toMatchObject(sampleWithNewData);
      });

      it('should return NewActivitySaved for empty ActivitySaved initial value', () => {
        const formGroup = service.createActivitySavedFormGroup();

        const activitySaved = service.getActivitySaved(formGroup) as any;

        expect(activitySaved).toMatchObject({});
      });

      it('should return IActivitySaved', () => {
        const formGroup = service.createActivitySavedFormGroup(sampleWithRequiredData);

        const activitySaved = service.getActivitySaved(formGroup) as any;

        expect(activitySaved).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActivitySaved should not enable id FormControl', () => {
        const formGroup = service.createActivitySavedFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActivitySaved should disable id FormControl', () => {
        const formGroup = service.createActivitySavedFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
