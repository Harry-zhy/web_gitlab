import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IItineraryActivity, NewItineraryActivity } from '../itinerary-activity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItineraryActivity for edit and NewItineraryActivityFormGroupInput for create.
 */
type ItineraryActivityFormGroupInput = IItineraryActivity | PartialWithRequiredKeyOf<NewItineraryActivity>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IItineraryActivity | NewItineraryActivity> = Omit<T, 'activityTime'> & {
  activityTime?: string | null;
};

type ItineraryActivityFormRawValue = FormValueOf<IItineraryActivity>;

type NewItineraryActivityFormRawValue = FormValueOf<NewItineraryActivity>;

type ItineraryActivityFormDefaults = Pick<NewItineraryActivity, 'id' | 'activityTime'>;

type ItineraryActivityFormGroupContent = {
  id: FormControl<ItineraryActivityFormRawValue['id'] | NewItineraryActivity['id']>;
  activityName: FormControl<ItineraryActivityFormRawValue['activityName']>;
  activityCost: FormControl<ItineraryActivityFormRawValue['activityCost']>;
  activityHost: FormControl<ItineraryActivityFormRawValue['activityHost']>;
  activityTime: FormControl<ItineraryActivityFormRawValue['activityTime']>;
};

export type ItineraryActivityFormGroup = FormGroup<ItineraryActivityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItineraryActivityFormService {
  createItineraryActivityFormGroup(itineraryActivity: ItineraryActivityFormGroupInput = { id: null }): ItineraryActivityFormGroup {
    const itineraryActivityRawValue = this.convertItineraryActivityToItineraryActivityRawValue({
      ...this.getFormDefaults(),
      ...itineraryActivity,
    });
    return new FormGroup<ItineraryActivityFormGroupContent>({
      id: new FormControl(
        { value: itineraryActivityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      activityName: new FormControl(itineraryActivityRawValue.activityName),
      activityCost: new FormControl(itineraryActivityRawValue.activityCost),
      activityHost: new FormControl(itineraryActivityRawValue.activityHost),
      activityTime: new FormControl(itineraryActivityRawValue.activityTime),
    });
  }

  getItineraryActivity(form: ItineraryActivityFormGroup): IItineraryActivity | NewItineraryActivity {
    return this.convertItineraryActivityRawValueToItineraryActivity(
      form.getRawValue() as ItineraryActivityFormRawValue | NewItineraryActivityFormRawValue
    );
  }

  resetForm(form: ItineraryActivityFormGroup, itineraryActivity: ItineraryActivityFormGroupInput): void {
    const itineraryActivityRawValue = this.convertItineraryActivityToItineraryActivityRawValue({
      ...this.getFormDefaults(),
      ...itineraryActivity,
    });
    form.reset(
      {
        ...itineraryActivityRawValue,
        id: { value: itineraryActivityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItineraryActivityFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      activityTime: currentTime,
    };
  }

  private convertItineraryActivityRawValueToItineraryActivity(
    rawItineraryActivity: ItineraryActivityFormRawValue | NewItineraryActivityFormRawValue
  ): IItineraryActivity | NewItineraryActivity {
    return {
      ...rawItineraryActivity,
      activityTime: dayjs(rawItineraryActivity.activityTime, DATE_TIME_FORMAT),
    };
  }

  private convertItineraryActivityToItineraryActivityRawValue(
    itineraryActivity: IItineraryActivity | (Partial<NewItineraryActivity> & ItineraryActivityFormDefaults)
  ): ItineraryActivityFormRawValue | PartialWithRequiredKeyOf<NewItineraryActivityFormRawValue> {
    return {
      ...itineraryActivity,
      activityTime: itineraryActivity.activityTime ? itineraryActivity.activityTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
