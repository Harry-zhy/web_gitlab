import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../itinerary-caterer.test-samples';

import { ItineraryCatererFormService } from './itinerary-caterer-form.service';

describe('ItineraryCaterer Form Service', () => {
  let service: ItineraryCatererFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItineraryCatererFormService);
  });

  describe('Service methods', () => {
    describe('createItineraryCatererFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItineraryCatererFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            catererName: expect.any(Object),
            catererCost: expect.any(Object),
            catererHost: expect.any(Object),
            catererTime: expect.any(Object),
          })
        );
      });

      it('passing IItineraryCaterer should create a new form with FormGroup', () => {
        const formGroup = service.createItineraryCatererFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            catererName: expect.any(Object),
            catererCost: expect.any(Object),
            catererHost: expect.any(Object),
            catererTime: expect.any(Object),
          })
        );
      });
    });

    describe('getItineraryCaterer', () => {
      it('should return NewItineraryCaterer for default ItineraryCaterer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItineraryCatererFormGroup(sampleWithNewData);

        const itineraryCaterer = service.getItineraryCaterer(formGroup) as any;

        expect(itineraryCaterer).toMatchObject(sampleWithNewData);
      });

      it('should return NewItineraryCaterer for empty ItineraryCaterer initial value', () => {
        const formGroup = service.createItineraryCatererFormGroup();

        const itineraryCaterer = service.getItineraryCaterer(formGroup) as any;

        expect(itineraryCaterer).toMatchObject({});
      });

      it('should return IItineraryCaterer', () => {
        const formGroup = service.createItineraryCatererFormGroup(sampleWithRequiredData);

        const itineraryCaterer = service.getItineraryCaterer(formGroup) as any;

        expect(itineraryCaterer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItineraryCaterer should not enable id FormControl', () => {
        const formGroup = service.createItineraryCatererFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItineraryCaterer should disable id FormControl', () => {
        const formGroup = service.createItineraryCatererFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
