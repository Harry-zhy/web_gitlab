import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../activity-contact-details.test-samples';

import { ActivityContactDetailsFormService } from './activity-contact-details-form.service';

describe('ActivityContactDetails Form Service', () => {
  let service: ActivityContactDetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityContactDetailsFormService);
  });

  describe('Service methods', () => {
    describe('createActivityContactDetailsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActivityContactDetailsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            website: expect.any(Object),
            twitter: expect.any(Object),
            instagram: expect.any(Object),
            facebook: expect.any(Object),
            tiktok: expect.any(Object),
            phoneNumber: expect.any(Object),
            activityCompany: expect.any(Object),
          })
        );
      });

      it('passing IActivityContactDetails should create a new form with FormGroup', () => {
        const formGroup = service.createActivityContactDetailsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            website: expect.any(Object),
            twitter: expect.any(Object),
            instagram: expect.any(Object),
            facebook: expect.any(Object),
            tiktok: expect.any(Object),
            phoneNumber: expect.any(Object),
            activityCompany: expect.any(Object),
          })
        );
      });
    });

    describe('getActivityContactDetails', () => {
      it('should return NewActivityContactDetails for default ActivityContactDetails initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActivityContactDetailsFormGroup(sampleWithNewData);

        const activityContactDetails = service.getActivityContactDetails(formGroup) as any;

        expect(activityContactDetails).toMatchObject(sampleWithNewData);
      });

      it('should return NewActivityContactDetails for empty ActivityContactDetails initial value', () => {
        const formGroup = service.createActivityContactDetailsFormGroup();

        const activityContactDetails = service.getActivityContactDetails(formGroup) as any;

        expect(activityContactDetails).toMatchObject({});
      });

      it('should return IActivityContactDetails', () => {
        const formGroup = service.createActivityContactDetailsFormGroup(sampleWithRequiredData);

        const activityContactDetails = service.getActivityContactDetails(formGroup) as any;

        expect(activityContactDetails).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActivityContactDetails should not enable id FormControl', () => {
        const formGroup = service.createActivityContactDetailsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActivityContactDetails should disable id FormControl', () => {
        const formGroup = service.createActivityContactDetailsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
