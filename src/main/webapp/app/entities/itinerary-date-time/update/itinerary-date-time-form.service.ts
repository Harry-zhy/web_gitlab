import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IItineraryDateTime, NewItineraryDateTime } from '../itinerary-date-time.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItineraryDateTime for edit and NewItineraryDateTimeFormGroupInput for create.
 */
type ItineraryDateTimeFormGroupInput = IItineraryDateTime | PartialWithRequiredKeyOf<NewItineraryDateTime>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IItineraryDateTime | NewItineraryDateTime> = Omit<T, 'date' | 'startTime' | 'endTime'> & {
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

type ItineraryDateTimeFormRawValue = FormValueOf<IItineraryDateTime>;

type NewItineraryDateTimeFormRawValue = FormValueOf<NewItineraryDateTime>;

type ItineraryDateTimeFormDefaults = Pick<NewItineraryDateTime, 'id' | 'date' | 'startTime' | 'endTime'>;

type ItineraryDateTimeFormGroupContent = {
  id: FormControl<ItineraryDateTimeFormRawValue['id'] | NewItineraryDateTime['id']>;
  date: FormControl<ItineraryDateTimeFormRawValue['date']>;
  startTime: FormControl<ItineraryDateTimeFormRawValue['startTime']>;
  endTime: FormControl<ItineraryDateTimeFormRawValue['endTime']>;
};

export type ItineraryDateTimeFormGroup = FormGroup<ItineraryDateTimeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItineraryDateTimeFormService {
  createItineraryDateTimeFormGroup(itineraryDateTime: ItineraryDateTimeFormGroupInput = { id: null }): ItineraryDateTimeFormGroup {
    const itineraryDateTimeRawValue = this.convertItineraryDateTimeToItineraryDateTimeRawValue({
      ...this.getFormDefaults(),
      ...itineraryDateTime,
    });
    return new FormGroup<ItineraryDateTimeFormGroupContent>({
      id: new FormControl(
        { value: itineraryDateTimeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(itineraryDateTimeRawValue.date),
      startTime: new FormControl(itineraryDateTimeRawValue.startTime),
      endTime: new FormControl(itineraryDateTimeRawValue.endTime),
    });
  }

  getItineraryDateTime(form: ItineraryDateTimeFormGroup): IItineraryDateTime | NewItineraryDateTime {
    return this.convertItineraryDateTimeRawValueToItineraryDateTime(
      form.getRawValue() as ItineraryDateTimeFormRawValue | NewItineraryDateTimeFormRawValue
    );
  }

  resetForm(form: ItineraryDateTimeFormGroup, itineraryDateTime: ItineraryDateTimeFormGroupInput): void {
    const itineraryDateTimeRawValue = this.convertItineraryDateTimeToItineraryDateTimeRawValue({
      ...this.getFormDefaults(),
      ...itineraryDateTime,
    });
    form.reset(
      {
        ...itineraryDateTimeRawValue,
        id: { value: itineraryDateTimeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItineraryDateTimeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
      startTime: currentTime,
      endTime: currentTime,
    };
  }

  private convertItineraryDateTimeRawValueToItineraryDateTime(
    rawItineraryDateTime: ItineraryDateTimeFormRawValue | NewItineraryDateTimeFormRawValue
  ): IItineraryDateTime | NewItineraryDateTime {
    return {
      ...rawItineraryDateTime,
      date: dayjs(rawItineraryDateTime.date, DATE_TIME_FORMAT),
      startTime: dayjs(rawItineraryDateTime.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawItineraryDateTime.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertItineraryDateTimeToItineraryDateTimeRawValue(
    itineraryDateTime: IItineraryDateTime | (Partial<NewItineraryDateTime> & ItineraryDateTimeFormDefaults)
  ): ItineraryDateTimeFormRawValue | PartialWithRequiredKeyOf<NewItineraryDateTimeFormRawValue> {
    return {
      ...itineraryDateTime,
      date: itineraryDateTime.date ? itineraryDateTime.date.format(DATE_TIME_FORMAT) : undefined,
      startTime: itineraryDateTime.startTime ? itineraryDateTime.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: itineraryDateTime.endTime ? itineraryDateTime.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
