import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../activity-company.test-samples';

import { ActivityCompanyFormService } from './activity-company-form.service';

describe('ActivityCompany Form Service', () => {
  let service: ActivityCompanyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityCompanyFormService);
  });

  describe('Service methods', () => {
    describe('createActivityCompanyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActivityCompanyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            about: expect.any(Object),
            supplier: expect.any(Object),
            bookedActivity: expect.any(Object),
          })
        );
      });

      it('passing IActivityCompany should create a new form with FormGroup', () => {
        const formGroup = service.createActivityCompanyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            about: expect.any(Object),
            supplier: expect.any(Object),
            bookedActivity: expect.any(Object),
          })
        );
      });
    });

    describe('getActivityCompany', () => {
      it('should return NewActivityCompany for default ActivityCompany initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActivityCompanyFormGroup(sampleWithNewData);

        const activityCompany = service.getActivityCompany(formGroup) as any;

        expect(activityCompany).toMatchObject(sampleWithNewData);
      });

      it('should return NewActivityCompany for empty ActivityCompany initial value', () => {
        const formGroup = service.createActivityCompanyFormGroup();

        const activityCompany = service.getActivityCompany(formGroup) as any;

        expect(activityCompany).toMatchObject({});
      });

      it('should return IActivityCompany', () => {
        const formGroup = service.createActivityCompanyFormGroup(sampleWithRequiredData);

        const activityCompany = service.getActivityCompany(formGroup) as any;

        expect(activityCompany).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActivityCompany should not enable id FormControl', () => {
        const formGroup = service.createActivityCompanyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActivityCompany should disable id FormControl', () => {
        const formGroup = service.createActivityCompanyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
