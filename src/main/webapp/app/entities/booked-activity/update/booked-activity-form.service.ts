import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBookedActivity, NewBookedActivity } from '../booked-activity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBookedActivity for edit and NewBookedActivityFormGroupInput for create.
 */
type BookedActivityFormGroupInput = IBookedActivity | PartialWithRequiredKeyOf<NewBookedActivity>;

type BookedActivityFormDefaults = Pick<NewBookedActivity, 'id' | 'activitySaveds'>;

type BookedActivityFormGroupContent = {
  id: FormControl<IBookedActivity['id'] | NewBookedActivity['id']>;
  name: FormControl<IBookedActivity['name']>;
  activitySaveds: FormControl<IBookedActivity['activitySaveds']>;
};

export type BookedActivityFormGroup = FormGroup<BookedActivityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BookedActivityFormService {
  createBookedActivityFormGroup(bookedActivity: BookedActivityFormGroupInput = { id: null }): BookedActivityFormGroup {
    const bookedActivityRawValue = {
      ...this.getFormDefaults(),
      ...bookedActivity,
    };
    return new FormGroup<BookedActivityFormGroupContent>({
      id: new FormControl(
        { value: bookedActivityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(bookedActivityRawValue.name, {
        validators: [Validators.required],
      }),
      activitySaveds: new FormControl(bookedActivityRawValue.activitySaveds ?? []),
    });
  }

  getBookedActivity(form: BookedActivityFormGroup): IBookedActivity | NewBookedActivity {
    return form.getRawValue() as IBookedActivity | NewBookedActivity;
  }

  resetForm(form: BookedActivityFormGroup, bookedActivity: BookedActivityFormGroupInput): void {
    const bookedActivityRawValue = { ...this.getFormDefaults(), ...bookedActivity };
    form.reset(
      {
        ...bookedActivityRawValue,
        id: { value: bookedActivityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BookedActivityFormDefaults {
    return {
      id: null,
      activitySaveds: [],
    };
  }
}
