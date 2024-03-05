import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../deco-contact-details.test-samples';

import { DecoContactDetailsFormService } from './deco-contact-details-form.service';

describe('DecoContactDetails Form Service', () => {
  let service: DecoContactDetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecoContactDetailsFormService);
  });

  describe('Service methods', () => {
    describe('createDecoContactDetailsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDecoContactDetailsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            website: expect.any(Object),
            phoneNumber: expect.any(Object),
            instagram: expect.any(Object),
            twitter: expect.any(Object),
            facebook: expect.any(Object),
            tiktok: expect.any(Object),
          })
        );
      });

      it('passing IDecoContactDetails should create a new form with FormGroup', () => {
        const formGroup = service.createDecoContactDetailsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            website: expect.any(Object),
            phoneNumber: expect.any(Object),
            instagram: expect.any(Object),
            twitter: expect.any(Object),
            facebook: expect.any(Object),
            tiktok: expect.any(Object),
          })
        );
      });
    });

    describe('getDecoContactDetails', () => {
      it('should return NewDecoContactDetails for default DecoContactDetails initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDecoContactDetailsFormGroup(sampleWithNewData);

        const decoContactDetails = service.getDecoContactDetails(formGroup) as any;

        expect(decoContactDetails).toMatchObject(sampleWithNewData);
      });

      it('should return NewDecoContactDetails for empty DecoContactDetails initial value', () => {
        const formGroup = service.createDecoContactDetailsFormGroup();

        const decoContactDetails = service.getDecoContactDetails(formGroup) as any;

        expect(decoContactDetails).toMatchObject({});
      });

      it('should return IDecoContactDetails', () => {
        const formGroup = service.createDecoContactDetailsFormGroup(sampleWithRequiredData);

        const decoContactDetails = service.getDecoContactDetails(formGroup) as any;

        expect(decoContactDetails).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDecoContactDetails should not enable id FormControl', () => {
        const formGroup = service.createDecoContactDetailsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDecoContactDetails should disable id FormControl', () => {
        const formGroup = service.createDecoContactDetailsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
