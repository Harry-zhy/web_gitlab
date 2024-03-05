import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActivitySelf, NewActivitySelf } from '../activity-self.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActivitySelf for edit and NewActivitySelfFormGroupInput for create.
 */
type ActivitySelfFormGroupInput = IActivitySelf | PartialWithRequiredKeyOf<NewActivitySelf>;

type ActivitySelfFormDefaults = Pick<NewActivitySelf, 'id' | 'activitySaveds'>;

type ActivitySelfFormGroupContent = {
  id: FormControl<IActivitySelf['id'] | NewActivitySelf['id']>;
  name: FormControl<IActivitySelf['name']>;
  description: FormControl<IActivitySelf['description']>;
  activitySaveds: FormControl<IActivitySelf['activitySaveds']>;
  event: FormControl<IActivitySelf['event']>;
};

export type ActivitySelfFormGroup = FormGroup<ActivitySelfFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActivitySelfFormService {
  createActivitySelfFormGroup(activitySelf: ActivitySelfFormGroupInput = { id: null }): ActivitySelfFormGroup {
    const activitySelfRawValue = {
      ...this.getFormDefaults(),
      ...activitySelf,
    };
    return new FormGroup<ActivitySelfFormGroupContent>({
      id: new FormControl(
        { value: activitySelfRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(activitySelfRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(activitySelfRawValue.description),
      activitySaveds: new FormControl(activitySelfRawValue.activitySaveds ?? []),
      event: new FormControl(activitySelfRawValue.event),
    });
  }

  getActivitySelf(form: ActivitySelfFormGroup): IActivitySelf | NewActivitySelf {
    return form.getRawValue() as IActivitySelf | NewActivitySelf;
  }

  resetForm(form: ActivitySelfFormGroup, activitySelf: ActivitySelfFormGroupInput): void {
    const activitySelfRawValue = { ...this.getFormDefaults(), ...activitySelf };
    form.reset(
      {
        ...activitySelfRawValue,
        id: { value: activitySelfRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActivitySelfFormDefaults {
    return {
      id: null,
      activitySaveds: [],
    };
  }
}
