import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActivityIdea, NewActivityIdea } from '../activity-idea.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActivityIdea for edit and NewActivityIdeaFormGroupInput for create.
 */
type ActivityIdeaFormGroupInput = IActivityIdea | PartialWithRequiredKeyOf<NewActivityIdea>;

type ActivityIdeaFormDefaults = Pick<NewActivityIdea, 'id'>;

type ActivityIdeaFormGroupContent = {
  id: FormControl<IActivityIdea['id'] | NewActivityIdea['id']>;
  description: FormControl<IActivityIdea['description']>;
  link: FormControl<IActivityIdea['link']>;
  activitySelf: FormControl<IActivityIdea['activitySelf']>;
};

export type ActivityIdeaFormGroup = FormGroup<ActivityIdeaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActivityIdeaFormService {
  createActivityIdeaFormGroup(activityIdea: ActivityIdeaFormGroupInput = { id: null }): ActivityIdeaFormGroup {
    const activityIdeaRawValue = {
      ...this.getFormDefaults(),
      ...activityIdea,
    };
    return new FormGroup<ActivityIdeaFormGroupContent>({
      id: new FormControl(
        { value: activityIdeaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(activityIdeaRawValue.description, {
        validators: [Validators.required],
      }),
      link: new FormControl(activityIdeaRawValue.link),
      activitySelf: new FormControl(activityIdeaRawValue.activitySelf),
    });
  }

  getActivityIdea(form: ActivityIdeaFormGroup): IActivityIdea | NewActivityIdea {
    return form.getRawValue() as IActivityIdea | NewActivityIdea;
  }

  resetForm(form: ActivityIdeaFormGroup, activityIdea: ActivityIdeaFormGroupInput): void {
    const activityIdeaRawValue = { ...this.getFormDefaults(), ...activityIdea };
    form.reset(
      {
        ...activityIdeaRawValue,
        id: { value: activityIdeaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActivityIdeaFormDefaults {
    return {
      id: null,
    };
  }
}
