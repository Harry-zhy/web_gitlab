import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mock-venue-entity.test-samples';

import { MockVenueEntityFormService } from './mock-venue-entity-form.service';

describe('MockVenueEntity Form Service', () => {
  let service: MockVenueEntityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockVenueEntityFormService);
  });

  describe('Service methods', () => {
    describe('createMockVenueEntityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMockVenueEntityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            companyName: expect.any(Object),
            location: expect.any(Object),
            rating: expect.any(Object),
            description: expect.any(Object),
            contact: expect.any(Object),
          })
        );
      });

      it('passing IMockVenueEntity should create a new form with FormGroup', () => {
        const formGroup = service.createMockVenueEntityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            companyName: expect.any(Object),
            location: expect.any(Object),
            rating: expect.any(Object),
            description: expect.any(Object),
            contact: expect.any(Object),
          })
        );
      });
    });

    describe('getMockVenueEntity', () => {
      it('should return NewMockVenueEntity for default MockVenueEntity initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMockVenueEntityFormGroup(sampleWithNewData);

        const mockVenueEntity = service.getMockVenueEntity(formGroup) as any;

        expect(mockVenueEntity).toMatchObject(sampleWithNewData);
      });

      it('should return NewMockVenueEntity for empty MockVenueEntity initial value', () => {
        const formGroup = service.createMockVenueEntityFormGroup();

        const mockVenueEntity = service.getMockVenueEntity(formGroup) as any;

        expect(mockVenueEntity).toMatchObject({});
      });

      it('should return IMockVenueEntity', () => {
        const formGroup = service.createMockVenueEntityFormGroup(sampleWithRequiredData);

        const mockVenueEntity = service.getMockVenueEntity(formGroup) as any;

        expect(mockVenueEntity).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMockVenueEntity should not enable id FormControl', () => {
        const formGroup = service.createMockVenueEntityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMockVenueEntity should disable id FormControl', () => {
        const formGroup = service.createMockVenueEntityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
