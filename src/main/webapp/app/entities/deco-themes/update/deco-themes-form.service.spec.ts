import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../deco-themes.test-samples';

import { DecoThemesFormService } from './deco-themes-form.service';

describe('DecoThemes Form Service', () => {
  let service: DecoThemesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecoThemesFormService);
  });

  describe('Service methods', () => {
    describe('createDecoThemesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDecoThemesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            name: expect.any(Object),
            decoSavedThemes: expect.any(Object),
          })
        );
      });

      it('passing IDecoThemes should create a new form with FormGroup', () => {
        const formGroup = service.createDecoThemesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            name: expect.any(Object),
            decoSavedThemes: expect.any(Object),
          })
        );
      });
    });

    describe('getDecoThemes', () => {
      it('should return NewDecoThemes for default DecoThemes initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDecoThemesFormGroup(sampleWithNewData);

        const decoThemes = service.getDecoThemes(formGroup) as any;

        expect(decoThemes).toMatchObject(sampleWithNewData);
      });

      it('should return NewDecoThemes for empty DecoThemes initial value', () => {
        const formGroup = service.createDecoThemesFormGroup();

        const decoThemes = service.getDecoThemes(formGroup) as any;

        expect(decoThemes).toMatchObject({});
      });

      it('should return IDecoThemes', () => {
        const formGroup = service.createDecoThemesFormGroup(sampleWithRequiredData);

        const decoThemes = service.getDecoThemes(formGroup) as any;

        expect(decoThemes).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDecoThemes should not enable id FormControl', () => {
        const formGroup = service.createDecoThemesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDecoThemes should disable id FormControl', () => {
        const formGroup = service.createDecoThemesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
