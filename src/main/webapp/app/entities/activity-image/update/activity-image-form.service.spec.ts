import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../activity-image.test-samples';

import { ActivityImageFormService } from './activity-image-form.service';

describe('ActivityImage Form Service', () => {
  let service: ActivityImageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityImageFormService);
  });

  describe('Service methods', () => {
    describe('createActivityImageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActivityImageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            picture: expect.any(Object),
            activityCompany: expect.any(Object),
            activitySelf: expect.any(Object),
          })
        );
      });

      it('passing IActivityImage should create a new form with FormGroup', () => {
        const formGroup = service.createActivityImageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            picture: expect.any(Object),
            activityCompany: expect.any(Object),
            activitySelf: expect.any(Object),
          })
        );
      });
    });

    describe('getActivityImage', () => {
      it('should return NewActivityImage for default ActivityImage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActivityImageFormGroup(sampleWithNewData);

        const activityImage = service.getActivityImage(formGroup) as any;

        expect(activityImage).toMatchObject(sampleWithNewData);
      });

      it('should return NewActivityImage for empty ActivityImage initial value', () => {
        const formGroup = service.createActivityImageFormGroup();

        const activityImage = service.getActivityImage(formGroup) as any;

        expect(activityImage).toMatchObject({});
      });

      it('should return IActivityImage', () => {
        const formGroup = service.createActivityImageFormGroup(sampleWithRequiredData);

        const activityImage = service.getActivityImage(formGroup) as any;

        expect(activityImage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActivityImage should not enable id FormControl', () => {
        const formGroup = service.createActivityImageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActivityImage should disable id FormControl', () => {
        const formGroup = service.createActivityImageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
