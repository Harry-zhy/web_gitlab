import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEvent, NewEvent } from '../event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvent for edit and NewEventFormGroupInput for create.
 */
type EventFormGroupInput = IEvent | PartialWithRequiredKeyOf<NewEvent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEvent | NewEvent> = Omit<T, 'date'> & {
  date?: string | null;
};

type EventFormRawValue = FormValueOf<IEvent>;

type NewEventFormRawValue = FormValueOf<NewEvent>;

type EventFormDefaults = Pick<NewEvent, 'id' | 'date'>;

type EventFormGroupContent = {
  id: FormControl<EventFormRawValue['id'] | NewEvent['id']>;
  date: FormControl<EventFormRawValue['date']>;
  spaces: FormControl<EventFormRawValue['spaces']>;
  title: FormControl<EventFormRawValue['title']>;
  venue: FormControl<EventFormRawValue['venue']>;
};

export type EventFormGroup = FormGroup<EventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventFormService {
  createEventFormGroup(event: EventFormGroupInput = { id: null }): EventFormGroup {
    const eventRawValue = this.convertEventToEventRawValue({
      ...this.getFormDefaults(),
      ...event,
    });
    return new FormGroup<EventFormGroupContent>({
      id: new FormControl(
        { value: eventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(eventRawValue.date),
      spaces: new FormControl(eventRawValue.spaces),
      title: new FormControl(eventRawValue.title),
      venue: new FormControl(eventRawValue.venue),
    });
  }

  getEvent(form: EventFormGroup): IEvent | NewEvent {
    return this.convertEventRawValueToEvent(form.getRawValue() as EventFormRawValue | NewEventFormRawValue);
  }

  resetForm(form: EventFormGroup, event: EventFormGroupInput): void {
    const eventRawValue = this.convertEventToEventRawValue({ ...this.getFormDefaults(), ...event });
    form.reset(
      {
        ...eventRawValue,
        id: { value: eventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EventFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertEventRawValueToEvent(rawEvent: EventFormRawValue | NewEventFormRawValue): IEvent | NewEvent {
    return {
      ...rawEvent,
      date: dayjs(rawEvent.date, DATE_TIME_FORMAT),
    };
  }

  private convertEventToEventRawValue(
    event: IEvent | (Partial<NewEvent> & EventFormDefaults)
  ): EventFormRawValue | PartialWithRequiredKeyOf<NewEventFormRawValue> {
    return {
      ...event,
      date: event.date ? event.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
