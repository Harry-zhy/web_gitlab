import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../dietary-requirements.test-samples';

import { DietaryRequirementsFormService } from './dietary-requirements-form.service';

describe('DietaryRequirements Form Service', () => {
  let service: DietaryRequirementsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DietaryRequirementsFormService);
  });

  describe('Service methods', () => {
    describe('createDietaryRequirementsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDietaryRequirementsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            option: expect.any(Object),
            caterers: expect.any(Object),
          })
        );
      });

      it('passing IDietaryRequirements should create a new form with FormGroup', () => {
        const formGroup = service.createDietaryRequirementsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            option: expect.any(Object),
            caterers: expect.any(Object),
          })
        );
      });
    });

    describe('getDietaryRequirements', () => {
      it('should return NewDietaryRequirements for default DietaryRequirements initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDietaryRequirementsFormGroup(sampleWithNewData);

        const dietaryRequirements = service.getDietaryRequirements(formGroup) as any;

        expect(dietaryRequirements).toMatchObject(sampleWithNewData);
      });

      it('should return NewDietaryRequirements for empty DietaryRequirements initial value', () => {
        const formGroup = service.createDietaryRequirementsFormGroup();

        const dietaryRequirements = service.getDietaryRequirements(formGroup) as any;

        expect(dietaryRequirements).toMatchObject({});
      });

      it('should return IDietaryRequirements', () => {
        const formGroup = service.createDietaryRequirementsFormGroup(sampleWithRequiredData);

        const dietaryRequirements = service.getDietaryRequirements(formGroup) as any;

        expect(dietaryRequirements).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDietaryRequirements should not enable id FormControl', () => {
        const formGroup = service.createDietaryRequirementsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDietaryRequirements should disable id FormControl', () => {
        const formGroup = service.createDietaryRequirementsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
