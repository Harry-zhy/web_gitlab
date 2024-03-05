import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../caterers.test-samples';

import { CaterersFormService } from './caterers-form.service';

describe('Caterers Form Service', () => {
  let service: CaterersFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaterersFormService);
  });

  describe('Service methods', () => {
    describe('createCaterersFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCaterersFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            picture: expect.any(Object),
            pricePerPerson: expect.any(Object),
            guestLimit: expect.any(Object),
            bookedCaterer: expect.any(Object),
            eventItinerary: expect.any(Object),
            supplier: expect.any(Object),
            dietaryRequirements: expect.any(Object),
            cuisines: expect.any(Object),
            event: expect.any(Object),
          })
        );
      });

      it('passing ICaterers should create a new form with FormGroup', () => {
        const formGroup = service.createCaterersFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            picture: expect.any(Object),
            pricePerPerson: expect.any(Object),
            guestLimit: expect.any(Object),
            bookedCaterer: expect.any(Object),
            eventItinerary: expect.any(Object),
            supplier: expect.any(Object),
            dietaryRequirements: expect.any(Object),
            cuisines: expect.any(Object),
            event: expect.any(Object),
          })
        );
      });
    });

    describe('getCaterers', () => {
      it('should return NewCaterers for default Caterers initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCaterersFormGroup(sampleWithNewData);

        const caterers = service.getCaterers(formGroup) as any;

        expect(caterers).toMatchObject(sampleWithNewData);
      });

      it('should return NewCaterers for empty Caterers initial value', () => {
        const formGroup = service.createCaterersFormGroup();

        const caterers = service.getCaterers(formGroup) as any;

        expect(caterers).toMatchObject({});
      });

      it('should return ICaterers', () => {
        const formGroup = service.createCaterersFormGroup(sampleWithRequiredData);

        const caterers = service.getCaterers(formGroup) as any;

        expect(caterers).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICaterers should not enable id FormControl', () => {
        const formGroup = service.createCaterersFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCaterers should disable id FormControl', () => {
        const formGroup = service.createCaterersFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
