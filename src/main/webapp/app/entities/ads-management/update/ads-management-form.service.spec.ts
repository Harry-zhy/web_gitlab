import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ads-management.test-samples';

import { AdsManagementFormService } from './ads-management-form.service';

describe('AdsManagement Form Service', () => {
  let service: AdsManagementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsManagementFormService);
  });

  describe('Service methods', () => {
    describe('createAdsManagementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAdsManagementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            age: expect.any(Object),
            gender: expect.any(Object),
            preference: expect.any(Object),
            location: expect.any(Object),
            supplier: expect.any(Object),
          })
        );
      });

      it('passing IAdsManagement should create a new form with FormGroup', () => {
        const formGroup = service.createAdsManagementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            age: expect.any(Object),
            gender: expect.any(Object),
            preference: expect.any(Object),
            location: expect.any(Object),
            supplier: expect.any(Object),
          })
        );
      });
    });

    describe('getAdsManagement', () => {
      it('should return NewAdsManagement for default AdsManagement initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAdsManagementFormGroup(sampleWithNewData);

        const adsManagement = service.getAdsManagement(formGroup) as any;

        expect(adsManagement).toMatchObject(sampleWithNewData);
      });

      it('should return NewAdsManagement for empty AdsManagement initial value', () => {
        const formGroup = service.createAdsManagementFormGroup();

        const adsManagement = service.getAdsManagement(formGroup) as any;

        expect(adsManagement).toMatchObject({});
      });

      it('should return IAdsManagement', () => {
        const formGroup = service.createAdsManagementFormGroup(sampleWithRequiredData);

        const adsManagement = service.getAdsManagement(formGroup) as any;

        expect(adsManagement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAdsManagement should not enable id FormControl', () => {
        const formGroup = service.createAdsManagementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAdsManagement should disable id FormControl', () => {
        const formGroup = service.createAdsManagementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
