import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../activity-self.test-samples';

import { ActivitySelfFormService } from './activity-self-form.service';

describe('ActivitySelf Form Service', () => {
  let service: ActivitySelfFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitySelfFormService);
  });

  describe('Service methods', () => {
    describe('createActivitySelfFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActivitySelfFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            activitySaveds: expect.any(Object),
            event: expect.any(Object),
          })
        );
      });

      it('passing IActivitySelf should create a new form with FormGroup', () => {
        const formGroup = service.createActivitySelfFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            activitySaveds: expect.any(Object),
            event: expect.any(Object),
          })
        );
      });
    });

    describe('getActivitySelf', () => {
      it('should return NewActivitySelf for default ActivitySelf initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActivitySelfFormGroup(sampleWithNewData);

        const activitySelf = service.getActivitySelf(formGroup) as any;

        expect(activitySelf).toMatchObject(sampleWithNewData);
      });

      it('should return NewActivitySelf for empty ActivitySelf initial value', () => {
        const formGroup = service.createActivitySelfFormGroup();

        const activitySelf = service.getActivitySelf(formGroup) as any;

        expect(activitySelf).toMatchObject({});
      });

      it('should return IActivitySelf', () => {
        const formGroup = service.createActivitySelfFormGroup(sampleWithRequiredData);

        const activitySelf = service.getActivitySelf(formGroup) as any;

        expect(activitySelf).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActivitySelf should not enable id FormControl', () => {
        const formGroup = service.createActivitySelfFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActivitySelf should disable id FormControl', () => {
        const formGroup = service.createActivitySelfFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
