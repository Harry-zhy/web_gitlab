import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVenueInformation, NewVenueInformation } from '../venue-information.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVenueInformation for edit and NewVenueInformationFormGroupInput for create.
 */
type VenueInformationFormGroupInput = IVenueInformation | PartialWithRequiredKeyOf<NewVenueInformation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVenueInformation | NewVenueInformation> = Omit<T, 'openingTimeFrom' | 'openingTimeUntil'> & {
  openingTimeFrom?: string | null;
  openingTimeUntil?: string | null;
};

type VenueInformationFormRawValue = FormValueOf<IVenueInformation>;

type NewVenueInformationFormRawValue = FormValueOf<NewVenueInformation>;

type VenueInformationFormDefaults = Pick<NewVenueInformation, 'id' | 'openingTimeFrom' | 'openingTimeUntil'>;

type VenueInformationFormGroupContent = {
  id: FormControl<VenueInformationFormRawValue['id'] | NewVenueInformation['id']>;
  name: FormControl<VenueInformationFormRawValue['name']>;
  price: FormControl<VenueInformationFormRawValue['price']>;
  capacity: FormControl<VenueInformationFormRawValue['capacity']>;
  location: FormControl<VenueInformationFormRawValue['location']>;
  openingTimeFrom: FormControl<VenueInformationFormRawValue['openingTimeFrom']>;
  openingTimeUntil: FormControl<VenueInformationFormRawValue['openingTimeUntil']>;
  picture: FormControl<VenueInformationFormRawValue['picture']>;
  pictureContentType: FormControl<VenueInformationFormRawValue['pictureContentType']>;
  eventItinerary: FormControl<VenueInformationFormRawValue['eventItinerary']>;
  supplier: FormControl<VenueInformationFormRawValue['supplier']>;
};

export type VenueInformationFormGroup = FormGroup<VenueInformationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VenueInformationFormService {
  createVenueInformationFormGroup(venueInformation: VenueInformationFormGroupInput = { id: null }): VenueInformationFormGroup {
    const venueInformationRawValue = this.convertVenueInformationToVenueInformationRawValue({
      ...this.getFormDefaults(),
      ...venueInformation,
    });
    return new FormGroup<VenueInformationFormGroupContent>({
      id: new FormControl(
        { value: venueInformationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(venueInformationRawValue.name),
      price: new FormControl(venueInformationRawValue.price),
      capacity: new FormControl(venueInformationRawValue.capacity),
      location: new FormControl(venueInformationRawValue.location),
      openingTimeFrom: new FormControl(venueInformationRawValue.openingTimeFrom),
      openingTimeUntil: new FormControl(venueInformationRawValue.openingTimeUntil),
      picture: new FormControl(venueInformationRawValue.picture),
      pictureContentType: new FormControl(venueInformationRawValue.pictureContentType),
      eventItinerary: new FormControl(venueInformationRawValue.eventItinerary),
      supplier: new FormControl(venueInformationRawValue.supplier),
    });
  }

  getVenueInformation(form: VenueInformationFormGroup): IVenueInformation | NewVenueInformation {
    return this.convertVenueInformationRawValueToVenueInformation(
      form.getRawValue() as VenueInformationFormRawValue | NewVenueInformationFormRawValue
    );
  }

  resetForm(form: VenueInformationFormGroup, venueInformation: VenueInformationFormGroupInput): void {
    const venueInformationRawValue = this.convertVenueInformationToVenueInformationRawValue({
      ...this.getFormDefaults(),
      ...venueInformation,
    });
    form.reset(
      {
        ...venueInformationRawValue,
        id: { value: venueInformationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VenueInformationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      openingTimeFrom: currentTime,
      openingTimeUntil: currentTime,
    };
  }

  private convertVenueInformationRawValueToVenueInformation(
    rawVenueInformation: VenueInformationFormRawValue | NewVenueInformationFormRawValue
  ): IVenueInformation | NewVenueInformation {
    return {
      ...rawVenueInformation,
      openingTimeFrom: dayjs(rawVenueInformation.openingTimeFrom, DATE_TIME_FORMAT),
      openingTimeUntil: dayjs(rawVenueInformation.openingTimeUntil, DATE_TIME_FORMAT),
    };
  }

  private convertVenueInformationToVenueInformationRawValue(
    venueInformation: IVenueInformation | (Partial<NewVenueInformation> & VenueInformationFormDefaults)
  ): VenueInformationFormRawValue | PartialWithRequiredKeyOf<NewVenueInformationFormRawValue> {
    return {
      ...venueInformation,
      openingTimeFrom: venueInformation.openingTimeFrom ? venueInformation.openingTimeFrom.format(DATE_TIME_FORMAT) : undefined,
      openingTimeUntil: venueInformation.openingTimeUntil ? venueInformation.openingTimeUntil.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
