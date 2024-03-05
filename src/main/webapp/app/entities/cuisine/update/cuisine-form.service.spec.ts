import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../cuisine.test-samples';

import { CuisineFormService } from './cuisine-form.service';

describe('Cuisine Form Service', () => {
  let service: CuisineFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuisineFormService);
  });

  describe('Service methods', () => {
    describe('createCuisineFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCuisineFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            region: expect.any(Object),
            caterers: expect.any(Object),
          })
        );
      });

      it('passing ICuisine should create a new form with FormGroup', () => {
        const formGroup = service.createCuisineFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            region: expect.any(Object),
            caterers: expect.any(Object),
          })
        );
      });
    });

    describe('getCuisine', () => {
      it('should return NewCuisine for default Cuisine initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCuisineFormGroup(sampleWithNewData);

        const cuisine = service.getCuisine(formGroup) as any;

        expect(cuisine).toMatchObject(sampleWithNewData);
      });

      it('should return NewCuisine for empty Cuisine initial value', () => {
        const formGroup = service.createCuisineFormGroup();

        const cuisine = service.getCuisine(formGroup) as any;

        expect(cuisine).toMatchObject({});
      });

      it('should return ICuisine', () => {
        const formGroup = service.createCuisineFormGroup(sampleWithRequiredData);

        const cuisine = service.getCuisine(formGroup) as any;

        expect(cuisine).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICuisine should not enable id FormControl', () => {
        const formGroup = service.createCuisineFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCuisine should disable id FormControl', () => {
        const formGroup = service.createCuisineFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
