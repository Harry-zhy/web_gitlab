import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../booked-caterer.test-samples';

import { BookedCatererFormService } from './booked-caterer-form.service';

describe('BookedCaterer Form Service', () => {
  let service: BookedCatererFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookedCatererFormService);
  });

  describe('Service methods', () => {
    describe('createBookedCatererFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBookedCatererFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            confirmationStatus: expect.any(Object),
            itinerary: expect.any(Object),
          })
        );
      });

      it('passing IBookedCaterer should create a new form with FormGroup', () => {
        const formGroup = service.createBookedCatererFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            confirmationStatus: expect.any(Object),
            itinerary: expect.any(Object),
          })
        );
      });
    });

    describe('getBookedCaterer', () => {
      it('should return NewBookedCaterer for default BookedCaterer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBookedCatererFormGroup(sampleWithNewData);

        const bookedCaterer = service.getBookedCaterer(formGroup) as any;

        expect(bookedCaterer).toMatchObject(sampleWithNewData);
      });

      it('should return NewBookedCaterer for empty BookedCaterer initial value', () => {
        const formGroup = service.createBookedCatererFormGroup();

        const bookedCaterer = service.getBookedCaterer(formGroup) as any;

        expect(bookedCaterer).toMatchObject({});
      });

      it('should return IBookedCaterer', () => {
        const formGroup = service.createBookedCatererFormGroup(sampleWithRequiredData);

        const bookedCaterer = service.getBookedCaterer(formGroup) as any;

        expect(bookedCaterer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBookedCaterer should not enable id FormControl', () => {
        const formGroup = service.createBookedCatererFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBookedCaterer should disable id FormControl', () => {
        const formGroup = service.createBookedCatererFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
