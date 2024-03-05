import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../venue-information.test-samples';

import { VenueInformationFormService } from './venue-information-form.service';

describe('VenueInformation Form Service', () => {
  let service: VenueInformationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenueInformationFormService);
  });

  describe('Service methods', () => {
    describe('createVenueInformationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVenueInformationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            price: expect.any(Object),
            capacity: expect.any(Object),
            location: expect.any(Object),
            openingTimeFrom: expect.any(Object),
            openingTimeUntil: expect.any(Object),
            picture: expect.any(Object),
            eventItinerary: expect.any(Object),
            supplier: expect.any(Object),
          })
        );
      });

      it('passing IVenueInformation should create a new form with FormGroup', () => {
        const formGroup = service.createVenueInformationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            price: expect.any(Object),
            capacity: expect.any(Object),
            location: expect.any(Object),
            openingTimeFrom: expect.any(Object),
            openingTimeUntil: expect.any(Object),
            picture: expect.any(Object),
            eventItinerary: expect.any(Object),
            supplier: expect.any(Object),
          })
        );
      });
    });

    describe('getVenueInformation', () => {
      it('should return NewVenueInformation for default VenueInformation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVenueInformationFormGroup(sampleWithNewData);

        const venueInformation = service.getVenueInformation(formGroup) as any;

        expect(venueInformation).toMatchObject(sampleWithNewData);
      });

      it('should return NewVenueInformation for empty VenueInformation initial value', () => {
        const formGroup = service.createVenueInformationFormGroup();

        const venueInformation = service.getVenueInformation(formGroup) as any;

        expect(venueInformation).toMatchObject({});
      });

      it('should return IVenueInformation', () => {
        const formGroup = service.createVenueInformationFormGroup(sampleWithRequiredData);

        const venueInformation = service.getVenueInformation(formGroup) as any;

        expect(venueInformation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVenueInformation should not enable id FormControl', () => {
        const formGroup = service.createVenueInformationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVenueInformation should disable id FormControl', () => {
        const formGroup = service.createVenueInformationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
