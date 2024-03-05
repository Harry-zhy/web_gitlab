import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../intro.test-samples';

import { IntroFormService } from './intro-form.service';

describe('Intro Form Service', () => {
  let service: IntroFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntroFormService);
  });

  describe('Service methods', () => {
    describe('createIntroFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createIntroFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            salutation: expect.any(Object),
            body: expect.any(Object),
          })
        );
      });

      it('passing IIntro should create a new form with FormGroup', () => {
        const formGroup = service.createIntroFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            salutation: expect.any(Object),
            body: expect.any(Object),
          })
        );
      });
    });

    describe('getIntro', () => {
      it('should return NewIntro for default Intro initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createIntroFormGroup(sampleWithNewData);

        const intro = service.getIntro(formGroup) as any;

        expect(intro).toMatchObject(sampleWithNewData);
      });

      it('should return NewIntro for empty Intro initial value', () => {
        const formGroup = service.createIntroFormGroup();

        const intro = service.getIntro(formGroup) as any;

        expect(intro).toMatchObject({});
      });

      it('should return IIntro', () => {
        const formGroup = service.createIntroFormGroup(sampleWithRequiredData);

        const intro = service.getIntro(formGroup) as any;

        expect(intro).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IIntro should not enable id FormControl', () => {
        const formGroup = service.createIntroFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewIntro should disable id FormControl', () => {
        const formGroup = service.createIntroFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
