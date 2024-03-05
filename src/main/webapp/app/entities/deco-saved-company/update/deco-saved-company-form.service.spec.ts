import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../deco-saved-company.test-samples';

import { DecoSavedCompanyFormService } from './deco-saved-company-form.service';

describe('DecoSavedCompany Form Service', () => {
  let service: DecoSavedCompanyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecoSavedCompanyFormService);
  });

  describe('Service methods', () => {
    describe('createDecoSavedCompanyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDecoSavedCompanyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            decoCompanies: expect.any(Object),
          })
        );
      });

      it('passing IDecoSavedCompany should create a new form with FormGroup', () => {
        const formGroup = service.createDecoSavedCompanyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            decoCompanies: expect.any(Object),
          })
        );
      });
    });

    describe('getDecoSavedCompany', () => {
      it('should return NewDecoSavedCompany for default DecoSavedCompany initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDecoSavedCompanyFormGroup(sampleWithNewData);

        const decoSavedCompany = service.getDecoSavedCompany(formGroup) as any;

        expect(decoSavedCompany).toMatchObject(sampleWithNewData);
      });

      it('should return NewDecoSavedCompany for empty DecoSavedCompany initial value', () => {
        const formGroup = service.createDecoSavedCompanyFormGroup();

        const decoSavedCompany = service.getDecoSavedCompany(formGroup) as any;

        expect(decoSavedCompany).toMatchObject({});
      });

      it('should return IDecoSavedCompany', () => {
        const formGroup = service.createDecoSavedCompanyFormGroup(sampleWithRequiredData);

        const decoSavedCompany = service.getDecoSavedCompany(formGroup) as any;

        expect(decoSavedCompany).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDecoSavedCompany should not enable id FormControl', () => {
        const formGroup = service.createDecoSavedCompanyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDecoSavedCompany should disable id FormControl', () => {
        const formGroup = service.createDecoSavedCompanyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
