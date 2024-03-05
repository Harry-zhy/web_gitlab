import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../business-information.test-samples';

import { BusinessInformationFormService } from './business-information-form.service';

describe('BusinessInformation Form Service', () => {
  let service: BusinessInformationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessInformationFormService);
  });

  describe('Service methods', () => {
    describe('createBusinessInformationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBusinessInformationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            information: expect.any(Object),
            businessHours: expect.any(Object),
            specialServicesAvailable: expect.any(Object),
            supplier: expect.any(Object),
          })
        );
      });

      it('passing IBusinessInformation should create a new form with FormGroup', () => {
        const formGroup = service.createBusinessInformationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            information: expect.any(Object),
            businessHours: expect.any(Object),
            specialServicesAvailable: expect.any(Object),
            supplier: expect.any(Object),
          })
        );
      });
    });

    describe('getBusinessInformation', () => {
      it('should return NewBusinessInformation for default BusinessInformation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBusinessInformationFormGroup(sampleWithNewData);

        const businessInformation = service.getBusinessInformation(formGroup) as any;

        expect(businessInformation).toMatchObject(sampleWithNewData);
      });

      it('should return NewBusinessInformation for empty BusinessInformation initial value', () => {
        const formGroup = service.createBusinessInformationFormGroup();

        const businessInformation = service.getBusinessInformation(formGroup) as any;

        expect(businessInformation).toMatchObject({});
      });

      it('should return IBusinessInformation', () => {
        const formGroup = service.createBusinessInformationFormGroup(sampleWithRequiredData);

        const businessInformation = service.getBusinessInformation(formGroup) as any;

        expect(businessInformation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBusinessInformation should not enable id FormControl', () => {
        const formGroup = service.createBusinessInformationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBusinessInformation should disable id FormControl', () => {
        const formGroup = service.createBusinessInformationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
