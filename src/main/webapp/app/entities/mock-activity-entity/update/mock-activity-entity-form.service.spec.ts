import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mock-activity-entity.test-samples';

import { MockActivityEntityFormService } from './mock-activity-entity-form.service';

describe('MockActivityEntity Form Service', () => {
  let service: MockActivityEntityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockActivityEntityFormService);
  });

  describe('Service methods', () => {
    describe('createMockActivityEntityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMockActivityEntityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            companyName: expect.any(Object),
            rating: expect.any(Object),
            description: expect.any(Object),
            quantity: expect.any(Object),
            contact: expect.any(Object),
          })
        );
      });

      it('passing IMockActivityEntity should create a new form with FormGroup', () => {
        const formGroup = service.createMockActivityEntityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            companyName: expect.any(Object),
            rating: expect.any(Object),
            description: expect.any(Object),
            quantity: expect.any(Object),
            contact: expect.any(Object),
          })
        );
      });
    });

    describe('getMockActivityEntity', () => {
      it('should return NewMockActivityEntity for default MockActivityEntity initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMockActivityEntityFormGroup(sampleWithNewData);

        const mockActivityEntity = service.getMockActivityEntity(formGroup) as any;

        expect(mockActivityEntity).toMatchObject(sampleWithNewData);
      });

      it('should return NewMockActivityEntity for empty MockActivityEntity initial value', () => {
        const formGroup = service.createMockActivityEntityFormGroup();

        const mockActivityEntity = service.getMockActivityEntity(formGroup) as any;

        expect(mockActivityEntity).toMatchObject({});
      });

      it('should return IMockActivityEntity', () => {
        const formGroup = service.createMockActivityEntityFormGroup(sampleWithRequiredData);

        const mockActivityEntity = service.getMockActivityEntity(formGroup) as any;

        expect(mockActivityEntity).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMockActivityEntity should not enable id FormControl', () => {
        const formGroup = service.createMockActivityEntityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMockActivityEntity should disable id FormControl', () => {
        const formGroup = service.createMockActivityEntityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
