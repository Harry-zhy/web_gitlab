import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IItinerary, NewItinerary } from '../itinerary.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItinerary for edit and NewItineraryFormGroupInput for create.
 */
type ItineraryFormGroupInput = IItinerary | PartialWithRequiredKeyOf<NewItinerary>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IItinerary | NewItinerary> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

type ItineraryFormRawValue = FormValueOf<IItinerary>;

type NewItineraryFormRawValue = FormValueOf<NewItinerary>;

type ItineraryFormDefaults = Pick<NewItinerary, 'id' | 'startTime' | 'endTime'>;

type ItineraryFormGroupContent = {
  id: FormControl<ItineraryFormRawValue['id'] | NewItinerary['id']>;
  startTime: FormControl<ItineraryFormRawValue['startTime']>;
  endTime: FormControl<ItineraryFormRawValue['endTime']>;
  location: FormControl<ItineraryFormRawValue['location']>;
};

export type ItineraryFormGroup = FormGroup<ItineraryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItineraryFormService {
  createItineraryFormGroup(itinerary: ItineraryFormGroupInput = { id: null }): ItineraryFormGroup {
    const itineraryRawValue = this.convertItineraryToItineraryRawValue({
      ...this.getFormDefaults(),
      ...itinerary,
    });
    return new FormGroup<ItineraryFormGroupContent>({
      id: new FormControl(
        { value: itineraryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startTime: new FormControl(itineraryRawValue.startTime),
      endTime: new FormControl(itineraryRawValue.endTime),
      location: new FormControl(itineraryRawValue.location),
    });
  }

  getItinerary(form: ItineraryFormGroup): IItinerary | NewItinerary {
    return this.convertItineraryRawValueToItinerary(form.getRawValue() as ItineraryFormRawValue | NewItineraryFormRawValue);
  }

  resetForm(form: ItineraryFormGroup, itinerary: ItineraryFormGroupInput): void {
    const itineraryRawValue = this.convertItineraryToItineraryRawValue({ ...this.getFormDefaults(), ...itinerary });
    form.reset(
      {
        ...itineraryRawValue,
        id: { value: itineraryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItineraryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
    };
  }

  private convertItineraryRawValueToItinerary(rawItinerary: ItineraryFormRawValue | NewItineraryFormRawValue): IItinerary | NewItinerary {
    return {
      ...rawItinerary,
      startTime: dayjs(rawItinerary.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawItinerary.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertItineraryToItineraryRawValue(
    itinerary: IItinerary | (Partial<NewItinerary> & ItineraryFormDefaults)
  ): ItineraryFormRawValue | PartialWithRequiredKeyOf<NewItineraryFormRawValue> {
    return {
      ...itinerary,
      startTime: itinerary.startTime ? itinerary.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: itinerary.endTime ? itinerary.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
