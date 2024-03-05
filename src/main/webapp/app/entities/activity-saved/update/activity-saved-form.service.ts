import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IActivitySaved, NewActivitySaved } from '../activity-saved.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActivitySaved for edit and NewActivitySavedFormGroupInput for create.
 */
type ActivitySavedFormGroupInput = IActivitySaved | PartialWithRequiredKeyOf<NewActivitySaved>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IActivitySaved | NewActivitySaved> = Omit<T, 'date'> & {
  date?: string | null;
};

type ActivitySavedFormRawValue = FormValueOf<IActivitySaved>;

type NewActivitySavedFormRawValue = FormValueOf<NewActivitySaved>;

type ActivitySavedFormDefaults = Pick<NewActivitySaved, 'id' | 'date' | 'bookedActivities' | 'activitySelves'>;

type ActivitySavedFormGroupContent = {
  id: FormControl<ActivitySavedFormRawValue['id'] | NewActivitySaved['id']>;
  name: FormControl<ActivitySavedFormRawValue['name']>;
  date: FormControl<ActivitySavedFormRawValue['date']>;
  company: FormControl<ActivitySavedFormRawValue['company']>;
  eventItinerary: FormControl<ActivitySavedFormRawValue['eventItinerary']>;
  bookedActivities: FormControl<ActivitySavedFormRawValue['bookedActivities']>;
  activitySelves: FormControl<ActivitySavedFormRawValue['activitySelves']>;
};

export type ActivitySavedFormGroup = FormGroup<ActivitySavedFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActivitySavedFormService {
  createActivitySavedFormGroup(activitySaved: ActivitySavedFormGroupInput = { id: null }): ActivitySavedFormGroup {
    const activitySavedRawValue = this.convertActivitySavedToActivitySavedRawValue({
      ...this.getFormDefaults(),
      ...activitySaved,
    });
    return new FormGroup<ActivitySavedFormGroupContent>({
      id: new FormControl(
        { value: activitySavedRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(activitySavedRawValue.name, {
        validators: [Validators.required],
      }),
      date: new FormControl(activitySavedRawValue.date, {
        validators: [Validators.required],
      }),
      company: new FormControl(activitySavedRawValue.company),
      eventItinerary: new FormControl(activitySavedRawValue.eventItinerary),
      bookedActivities: new FormControl(activitySavedRawValue.bookedActivities ?? []),
      activitySelves: new FormControl(activitySavedRawValue.activitySelves ?? []),
    });
  }

  getActivitySaved(form: ActivitySavedFormGroup): IActivitySaved | NewActivitySaved {
    return this.convertActivitySavedRawValueToActivitySaved(form.getRawValue() as ActivitySavedFormRawValue | NewActivitySavedFormRawValue);
  }

  resetForm(form: ActivitySavedFormGroup, activitySaved: ActivitySavedFormGroupInput): void {
    const activitySavedRawValue = this.convertActivitySavedToActivitySavedRawValue({ ...this.getFormDefaults(), ...activitySaved });
    form.reset(
      {
        ...activitySavedRawValue,
        id: { value: activitySavedRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActivitySavedFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
      bookedActivities: [],
      activitySelves: [],
    };
  }

  private convertActivitySavedRawValueToActivitySaved(
    rawActivitySaved: ActivitySavedFormRawValue | NewActivitySavedFormRawValue
  ): IActivitySaved | NewActivitySaved {
    return {
      ...rawActivitySaved,
      date: dayjs(rawActivitySaved.date, DATE_TIME_FORMAT),
    };
  }

  private convertActivitySavedToActivitySavedRawValue(
    activitySaved: IActivitySaved | (Partial<NewActivitySaved> & ActivitySavedFormDefaults)
  ): ActivitySavedFormRawValue | PartialWithRequiredKeyOf<NewActivitySavedFormRawValue> {
    return {
      ...activitySaved,
      date: activitySaved.date ? activitySaved.date.format(DATE_TIME_FORMAT) : undefined,
      bookedActivities: activitySaved.bookedActivities ?? [],
      activitySelves: activitySaved.activitySelves ?? [],
    };
  }
}
