import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../deco-images.test-samples';

import { DecoImagesFormService } from './deco-images-form.service';

describe('DecoImages Form Service', () => {
  let service: DecoImagesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecoImagesFormService);
  });

  describe('Service methods', () => {
    describe('createDecoImagesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDecoImagesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            picture: expect.any(Object),
            decoThemes: expect.any(Object),
            decoCompany: expect.any(Object),
          })
        );
      });

      it('passing IDecoImages should create a new form with FormGroup', () => {
        const formGroup = service.createDecoImagesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            picture: expect.any(Object),
            decoThemes: expect.any(Object),
            decoCompany: expect.any(Object),
          })
        );
      });
    });

    describe('getDecoImages', () => {
      it('should return NewDecoImages for default DecoImages initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDecoImagesFormGroup(sampleWithNewData);

        const decoImages = service.getDecoImages(formGroup) as any;

        expect(decoImages).toMatchObject(sampleWithNewData);
      });

      it('should return NewDecoImages for empty DecoImages initial value', () => {
        const formGroup = service.createDecoImagesFormGroup();

        const decoImages = service.getDecoImages(formGroup) as any;

        expect(decoImages).toMatchObject({});
      });

      it('should return IDecoImages', () => {
        const formGroup = service.createDecoImagesFormGroup(sampleWithRequiredData);

        const decoImages = service.getDecoImages(formGroup) as any;

        expect(decoImages).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDecoImages should not enable id FormControl', () => {
        const formGroup = service.createDecoImagesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDecoImages should disable id FormControl', () => {
        const formGroup = service.createDecoImagesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
