import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../deco-company.test-samples';

import { DecoCompanyFormService } from './deco-company-form.service';

describe('DecoCompany Form Service', () => {
  let service: DecoCompanyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecoCompanyFormService);
  });

  describe('Service methods', () => {
    describe('createDecoCompanyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDecoCompanyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            about: expect.any(Object),
            rating: expect.any(Object),
            decoContactDetails: expect.any(Object),
            supplier: expect.any(Object),
            decoSavedCompanies: expect.any(Object),
            decoBudgets: expect.any(Object),
          })
        );
      });

      it('passing IDecoCompany should create a new form with FormGroup', () => {
        const formGroup = service.createDecoCompanyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            about: expect.any(Object),
            rating: expect.any(Object),
            decoContactDetails: expect.any(Object),
            supplier: expect.any(Object),
            decoSavedCompanies: expect.any(Object),
            decoBudgets: expect.any(Object),
          })
        );
      });
    });

    describe('getDecoCompany', () => {
      it('should return NewDecoCompany for default DecoCompany initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDecoCompanyFormGroup(sampleWithNewData);

        const decoCompany = service.getDecoCompany(formGroup) as any;

        expect(decoCompany).toMatchObject(sampleWithNewData);
      });

      it('should return NewDecoCompany for empty DecoCompany initial value', () => {
        const formGroup = service.createDecoCompanyFormGroup();

        const decoCompany = service.getDecoCompany(formGroup) as any;

        expect(decoCompany).toMatchObject({});
      });

      it('should return IDecoCompany', () => {
        const formGroup = service.createDecoCompanyFormGroup(sampleWithRequiredData);

        const decoCompany = service.getDecoCompany(formGroup) as any;

        expect(decoCompany).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDecoCompany should not enable id FormControl', () => {
        const formGroup = service.createDecoCompanyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDecoCompany should disable id FormControl', () => {
        const formGroup = service.createDecoCompanyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
