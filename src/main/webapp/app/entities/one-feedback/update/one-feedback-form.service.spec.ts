import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../one-feedback.test-samples';

import { OneFeedbackFormService } from './one-feedback-form.service';

describe('OneFeedback Form Service', () => {
  let service: OneFeedbackFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OneFeedbackFormService);
  });

  describe('Service methods', () => {
    describe('createOneFeedbackFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOneFeedbackFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            content: expect.any(Object),
            withMultiMedia: expect.any(Object),
            imagePath: expect.any(Object),
            videoPath: expect.any(Object),
            feedbacks: expect.any(Object),
          })
        );
      });

      it('passing IOneFeedback should create a new form with FormGroup', () => {
        const formGroup = service.createOneFeedbackFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            content: expect.any(Object),
            withMultiMedia: expect.any(Object),
            imagePath: expect.any(Object),
            videoPath: expect.any(Object),
            feedbacks: expect.any(Object),
          })
        );
      });
    });

    describe('getOneFeedback', () => {
      it('should return NewOneFeedback for default OneFeedback initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOneFeedbackFormGroup(sampleWithNewData);

        const oneFeedback = service.getOneFeedback(formGroup) as any;

        expect(oneFeedback).toMatchObject(sampleWithNewData);
      });

      it('should return NewOneFeedback for empty OneFeedback initial value', () => {
        const formGroup = service.createOneFeedbackFormGroup();

        const oneFeedback = service.getOneFeedback(formGroup) as any;

        expect(oneFeedback).toMatchObject({});
      });

      it('should return IOneFeedback', () => {
        const formGroup = service.createOneFeedbackFormGroup(sampleWithRequiredData);

        const oneFeedback = service.getOneFeedback(formGroup) as any;

        expect(oneFeedback).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOneFeedback should not enable id FormControl', () => {
        const formGroup = service.createOneFeedbackFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOneFeedback should disable id FormControl', () => {
        const formGroup = service.createOneFeedbackFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
