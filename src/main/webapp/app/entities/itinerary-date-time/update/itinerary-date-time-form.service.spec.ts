import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../itinerary-date-time.test-samples';

import { ItineraryDateTimeFormService } from './itinerary-date-time-form.service';

describe('ItineraryDateTime Form Service', () => {
  let service: ItineraryDateTimeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItineraryDateTimeFormService);
  });

  describe('Service methods', () => {
    describe('createItineraryDateTimeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItineraryDateTimeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
          })
        );
      });

      it('passing IItineraryDateTime should create a new form with FormGroup', () => {
        const formGroup = service.createItineraryDateTimeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
          })
        );
      });
    });

    describe('getItineraryDateTime', () => {
      it('should return NewItineraryDateTime for default ItineraryDateTime initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItineraryDateTimeFormGroup(sampleWithNewData);

        const itineraryDateTime = service.getItineraryDateTime(formGroup) as any;

        expect(itineraryDateTime).toMatchObject(sampleWithNewData);
      });

      it('should return NewItineraryDateTime for empty ItineraryDateTime initial value', () => {
        const formGroup = service.createItineraryDateTimeFormGroup();

        const itineraryDateTime = service.getItineraryDateTime(formGroup) as any;

        expect(itineraryDateTime).toMatchObject({});
      });

      it('should return IItineraryDateTime', () => {
        const formGroup = service.createItineraryDateTimeFormGroup(sampleWithRequiredData);

        const itineraryDateTime = service.getItineraryDateTime(formGroup) as any;

        expect(itineraryDateTime).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItineraryDateTime should not enable id FormControl', () => {
        const formGroup = service.createItineraryDateTimeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItineraryDateTime should disable id FormControl', () => {
        const formGroup = service.createItineraryDateTimeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
