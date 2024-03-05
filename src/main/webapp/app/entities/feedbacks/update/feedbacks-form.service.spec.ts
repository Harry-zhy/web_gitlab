import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../feedbacks.test-samples';

import { FeedbacksFormService } from './feedbacks-form.service';

describe('Feedbacks Form Service', () => {
  let service: FeedbacksFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbacksFormService);
  });

  describe('Service methods', () => {
    describe('createFeedbacksFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFeedbacksFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            userName: expect.any(Object),
            rating: expect.any(Object),
            supplier: expect.any(Object),
          })
        );
      });

      it('passing IFeedbacks should create a new form with FormGroup', () => {
        const formGroup = service.createFeedbacksFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            userName: expect.any(Object),
            rating: expect.any(Object),
            supplier: expect.any(Object),
          })
        );
      });
    });

    describe('getFeedbacks', () => {
      it('should return NewFeedbacks for default Feedbacks initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFeedbacksFormGroup(sampleWithNewData);

        const feedbacks = service.getFeedbacks(formGroup) as any;

        expect(feedbacks).toMatchObject(sampleWithNewData);
      });

      it('should return NewFeedbacks for empty Feedbacks initial value', () => {
        const formGroup = service.createFeedbacksFormGroup();

        const feedbacks = service.getFeedbacks(formGroup) as any;

        expect(feedbacks).toMatchObject({});
      });

      it('should return IFeedbacks', () => {
        const formGroup = service.createFeedbacksFormGroup(sampleWithRequiredData);

        const feedbacks = service.getFeedbacks(formGroup) as any;

        expect(feedbacks).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFeedbacks should not enable id FormControl', () => {
        const formGroup = service.createFeedbacksFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFeedbacks should disable id FormControl', () => {
        const formGroup = service.createFeedbacksFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
