import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../booked-activity.test-samples';

import { BookedActivityFormService } from './booked-activity-form.service';

describe('BookedActivity Form Service', () => {
  let service: BookedActivityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookedActivityFormService);
  });

  describe('Service methods', () => {
    describe('createBookedActivityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBookedActivityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            activitySaveds: expect.any(Object),
          })
        );
      });

      it('passing IBookedActivity should create a new form with FormGroup', () => {
        const formGroup = service.createBookedActivityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            activitySaveds: expect.any(Object),
          })
        );
      });
    });

    describe('getBookedActivity', () => {
      it('should return NewBookedActivity for default BookedActivity initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBookedActivityFormGroup(sampleWithNewData);

        const bookedActivity = service.getBookedActivity(formGroup) as any;

        expect(bookedActivity).toMatchObject(sampleWithNewData);
      });

      it('should return NewBookedActivity for empty BookedActivity initial value', () => {
        const formGroup = service.createBookedActivityFormGroup();

        const bookedActivity = service.getBookedActivity(formGroup) as any;

        expect(bookedActivity).toMatchObject({});
      });

      it('should return IBookedActivity', () => {
        const formGroup = service.createBookedActivityFormGroup(sampleWithRequiredData);

        const bookedActivity = service.getBookedActivity(formGroup) as any;

        expect(bookedActivity).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBookedActivity should not enable id FormControl', () => {
        const formGroup = service.createBookedActivityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBookedActivity should disable id FormControl', () => {
        const formGroup = service.createBookedActivityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
