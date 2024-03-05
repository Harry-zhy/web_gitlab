import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mock-caterer-entity.test-samples';

import { MockCatererEntityFormService } from './mock-caterer-entity-form.service';

describe('MockCatererEntity Form Service', () => {
  let service: MockCatererEntityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockCatererEntityFormService);
  });

  describe('Service methods', () => {
    describe('createMockCatererEntityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMockCatererEntityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            cuisine: expect.any(Object),
            rating: expect.any(Object),
            description: expect.any(Object),
            quantity: expect.any(Object),
            contact: expect.any(Object),
          })
        );
      });

      it('passing IMockCatererEntity should create a new form with FormGroup', () => {
        const formGroup = service.createMockCatererEntityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            cuisine: expect.any(Object),
            rating: expect.any(Object),
            description: expect.any(Object),
            quantity: expect.any(Object),
            contact: expect.any(Object),
          })
        );
      });
    });

    describe('getMockCatererEntity', () => {
      it('should return NewMockCatererEntity for default MockCatererEntity initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMockCatererEntityFormGroup(sampleWithNewData);

        const mockCatererEntity = service.getMockCatererEntity(formGroup) as any;

        expect(mockCatererEntity).toMatchObject(sampleWithNewData);
      });

      it('should return NewMockCatererEntity for empty MockCatererEntity initial value', () => {
        const formGroup = service.createMockCatererEntityFormGroup();

        const mockCatererEntity = service.getMockCatererEntity(formGroup) as any;

        expect(mockCatererEntity).toMatchObject({});
      });

      it('should return IMockCatererEntity', () => {
        const formGroup = service.createMockCatererEntityFormGroup(sampleWithRequiredData);

        const mockCatererEntity = service.getMockCatererEntity(formGroup) as any;

        expect(mockCatererEntity).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMockCatererEntity should not enable id FormControl', () => {
        const formGroup = service.createMockCatererEntityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMockCatererEntity should disable id FormControl', () => {
        const formGroup = service.createMockCatererEntityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
