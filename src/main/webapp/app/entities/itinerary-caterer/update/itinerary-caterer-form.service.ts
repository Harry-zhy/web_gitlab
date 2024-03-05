import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IItineraryCaterer, NewItineraryCaterer } from '../itinerary-caterer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItineraryCaterer for edit and NewItineraryCatererFormGroupInput for create.
 */
type ItineraryCatererFormGroupInput = IItineraryCaterer | PartialWithRequiredKeyOf<NewItineraryCaterer>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IItineraryCaterer | NewItineraryCaterer> = Omit<T, 'catererTime'> & {
  catererTime?: string | null;
};

type ItineraryCatererFormRawValue = FormValueOf<IItineraryCaterer>;

type NewItineraryCatererFormRawValue = FormValueOf<NewItineraryCaterer>;

type ItineraryCatererFormDefaults = Pick<NewItineraryCaterer, 'id' | 'catererTime'>;

type ItineraryCatererFormGroupContent = {
  id: FormControl<ItineraryCatererFormRawValue['id'] | NewItineraryCaterer['id']>;
  catererName: FormControl<ItineraryCatererFormRawValue['catererName']>;
  catererCost: FormControl<ItineraryCatererFormRawValue['catererCost']>;
  catererHost: FormControl<ItineraryCatererFormRawValue['catererHost']>;
  catererTime: FormControl<ItineraryCatererFormRawValue['catererTime']>;
};

export type ItineraryCatererFormGroup = FormGroup<ItineraryCatererFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItineraryCatererFormService {
  createItineraryCatererFormGroup(itineraryCaterer: ItineraryCatererFormGroupInput = { id: null }): ItineraryCatererFormGroup {
    const itineraryCatererRawValue = this.convertItineraryCatererToItineraryCatererRawValue({
      ...this.getFormDefaults(),
      ...itineraryCaterer,
    });
    return new FormGroup<ItineraryCatererFormGroupContent>({
      id: new FormControl(
        { value: itineraryCatererRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      catererName: new FormControl(itineraryCatererRawValue.catererName),
      catererCost: new FormControl(itineraryCatererRawValue.catererCost),
      catererHost: new FormControl(itineraryCatererRawValue.catererHost),
      catererTime: new FormControl(itineraryCatererRawValue.catererTime),
    });
  }

  getItineraryCaterer(form: ItineraryCatererFormGroup): IItineraryCaterer | NewItineraryCaterer {
    return this.convertItineraryCatererRawValueToItineraryCaterer(
      form.getRawValue() as ItineraryCatererFormRawValue | NewItineraryCatererFormRawValue
    );
  }

  resetForm(form: ItineraryCatererFormGroup, itineraryCaterer: ItineraryCatererFormGroupInput): void {
    const itineraryCatererRawValue = this.convertItineraryCatererToItineraryCatererRawValue({
      ...this.getFormDefaults(),
      ...itineraryCaterer,
    });
    form.reset(
      {
        ...itineraryCatererRawValue,
        id: { value: itineraryCatererRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItineraryCatererFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      catererTime: currentTime,
    };
  }

  private convertItineraryCatererRawValueToItineraryCaterer(
    rawItineraryCaterer: ItineraryCatererFormRawValue | NewItineraryCatererFormRawValue
  ): IItineraryCaterer | NewItineraryCaterer {
    return {
      ...rawItineraryCaterer,
      catererTime: dayjs(rawItineraryCaterer.catererTime, DATE_TIME_FORMAT),
    };
  }

  private convertItineraryCatererToItineraryCatererRawValue(
    itineraryCaterer: IItineraryCaterer | (Partial<NewItineraryCaterer> & ItineraryCatererFormDefaults)
  ): ItineraryCatererFormRawValue | PartialWithRequiredKeyOf<NewItineraryCatererFormRawValue> {
    return {
      ...itineraryCaterer,
      catererTime: itineraryCaterer.catererTime ? itineraryCaterer.catererTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
