import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../activity-idea.test-samples';

import { ActivityIdeaFormService } from './activity-idea-form.service';

describe('ActivityIdea Form Service', () => {
  let service: ActivityIdeaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityIdeaFormService);
  });

  describe('Service methods', () => {
    describe('createActivityIdeaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActivityIdeaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            link: expect.any(Object),
            activitySelf: expect.any(Object),
          })
        );
      });

      it('passing IActivityIdea should create a new form with FormGroup', () => {
        const formGroup = service.createActivityIdeaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            link: expect.any(Object),
            activitySelf: expect.any(Object),
          })
        );
      });
    });

    describe('getActivityIdea', () => {
      it('should return NewActivityIdea for default ActivityIdea initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActivityIdeaFormGroup(sampleWithNewData);

        const activityIdea = service.getActivityIdea(formGroup) as any;

        expect(activityIdea).toMatchObject(sampleWithNewData);
      });

      it('should return NewActivityIdea for empty ActivityIdea initial value', () => {
        const formGroup = service.createActivityIdeaFormGroup();

        const activityIdea = service.getActivityIdea(formGroup) as any;

        expect(activityIdea).toMatchObject({});
      });

      it('should return IActivityIdea', () => {
        const formGroup = service.createActivityIdeaFormGroup(sampleWithRequiredData);

        const activityIdea = service.getActivityIdea(formGroup) as any;

        expect(activityIdea).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActivityIdea should not enable id FormControl', () => {
        const formGroup = service.createActivityIdeaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActivityIdea should disable id FormControl', () => {
        const formGroup = service.createActivityIdeaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
