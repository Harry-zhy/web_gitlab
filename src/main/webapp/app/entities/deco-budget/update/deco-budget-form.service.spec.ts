import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../deco-budget.test-samples';

import { DecoBudgetFormService } from './deco-budget-form.service';

describe('DecoBudget Form Service', () => {
  let service: DecoBudgetFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecoBudgetFormService);
  });

  describe('Service methods', () => {
    describe('createDecoBudgetFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDecoBudgetFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            money: expect.any(Object),
            decoCompanies: expect.any(Object),
          })
        );
      });

      it('passing IDecoBudget should create a new form with FormGroup', () => {
        const formGroup = service.createDecoBudgetFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            money: expect.any(Object),
            decoCompanies: expect.any(Object),
          })
        );
      });
    });

    describe('getDecoBudget', () => {
      it('should return NewDecoBudget for default DecoBudget initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDecoBudgetFormGroup(sampleWithNewData);

        const decoBudget = service.getDecoBudget(formGroup) as any;

        expect(decoBudget).toMatchObject(sampleWithNewData);
      });

      it('should return NewDecoBudget for empty DecoBudget initial value', () => {
        const formGroup = service.createDecoBudgetFormGroup();

        const decoBudget = service.getDecoBudget(formGroup) as any;

        expect(decoBudget).toMatchObject({});
      });

      it('should return IDecoBudget', () => {
        const formGroup = service.createDecoBudgetFormGroup(sampleWithRequiredData);

        const decoBudget = service.getDecoBudget(formGroup) as any;

        expect(decoBudget).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDecoBudget should not enable id FormControl', () => {
        const formGroup = service.createDecoBudgetFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDecoBudget should disable id FormControl', () => {
        const formGroup = service.createDecoBudgetFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
