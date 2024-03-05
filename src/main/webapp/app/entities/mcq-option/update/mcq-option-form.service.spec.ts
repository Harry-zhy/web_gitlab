import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mcq-option.test-samples';

import { MCQOptionFormService } from './mcq-option-form.service';

describe('MCQOption Form Service', () => {
  let service: MCQOptionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MCQOptionFormService);
  });

  describe('Service methods', () => {
    describe('createMCQOptionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMCQOptionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            value: expect.any(Object),
            question: expect.any(Object),
          })
        );
      });

      it('passing IMCQOption should create a new form with FormGroup', () => {
        const formGroup = service.createMCQOptionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            value: expect.any(Object),
            question: expect.any(Object),
          })
        );
      });
    });

    describe('getMCQOption', () => {
      it('should return NewMCQOption for default MCQOption initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMCQOptionFormGroup(sampleWithNewData);

        const mCQOption = service.getMCQOption(formGroup) as any;

        expect(mCQOption).toMatchObject(sampleWithNewData);
      });

      it('should return NewMCQOption for empty MCQOption initial value', () => {
        const formGroup = service.createMCQOptionFormGroup();

        const mCQOption = service.getMCQOption(formGroup) as any;

        expect(mCQOption).toMatchObject({});
      });

      it('should return IMCQOption', () => {
        const formGroup = service.createMCQOptionFormGroup(sampleWithRequiredData);

        const mCQOption = service.getMCQOption(formGroup) as any;

        expect(mCQOption).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMCQOption should not enable id FormControl', () => {
        const formGroup = service.createMCQOptionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMCQOption should disable id FormControl', () => {
        const formGroup = service.createMCQOptionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
