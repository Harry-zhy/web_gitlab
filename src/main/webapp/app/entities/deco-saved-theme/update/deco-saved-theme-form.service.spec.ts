import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../deco-saved-theme.test-samples';

import { DecoSavedThemeFormService } from './deco-saved-theme-form.service';

describe('DecoSavedTheme Form Service', () => {
  let service: DecoSavedThemeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecoSavedThemeFormService);
  });

  describe('Service methods', () => {
    describe('createDecoSavedThemeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDecoSavedThemeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            decoThemes: expect.any(Object),
          })
        );
      });

      it('passing IDecoSavedTheme should create a new form with FormGroup', () => {
        const formGroup = service.createDecoSavedThemeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            decoThemes: expect.any(Object),
          })
        );
      });
    });

    describe('getDecoSavedTheme', () => {
      it('should return NewDecoSavedTheme for default DecoSavedTheme initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDecoSavedThemeFormGroup(sampleWithNewData);

        const decoSavedTheme = service.getDecoSavedTheme(formGroup) as any;

        expect(decoSavedTheme).toMatchObject(sampleWithNewData);
      });

      it('should return NewDecoSavedTheme for empty DecoSavedTheme initial value', () => {
        const formGroup = service.createDecoSavedThemeFormGroup();

        const decoSavedTheme = service.getDecoSavedTheme(formGroup) as any;

        expect(decoSavedTheme).toMatchObject({});
      });

      it('should return IDecoSavedTheme', () => {
        const formGroup = service.createDecoSavedThemeFormGroup(sampleWithRequiredData);

        const decoSavedTheme = service.getDecoSavedTheme(formGroup) as any;

        expect(decoSavedTheme).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDecoSavedTheme should not enable id FormControl', () => {
        const formGroup = service.createDecoSavedThemeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDecoSavedTheme should disable id FormControl', () => {
        const formGroup = service.createDecoSavedThemeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
