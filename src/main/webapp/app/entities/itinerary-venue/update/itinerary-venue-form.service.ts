import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItineraryVenue, NewItineraryVenue } from '../itinerary-venue.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItineraryVenue for edit and NewItineraryVenueFormGroupInput for create.
 */
type ItineraryVenueFormGroupInput = IItineraryVenue | PartialWithRequiredKeyOf<NewItineraryVenue>;

type ItineraryVenueFormDefaults = Pick<NewItineraryVenue, 'id'>;

type ItineraryVenueFormGroupContent = {
  id: FormControl<IItineraryVenue['id'] | NewItineraryVenue['id']>;
  venueName: FormControl<IItineraryVenue['venueName']>;
  venueCost: FormControl<IItineraryVenue['venueCost']>;
  venueHost: FormControl<IItineraryVenue['venueHost']>;
  venueAddress: FormControl<IItineraryVenue['venueAddress']>;
};

export type ItineraryVenueFormGroup = FormGroup<ItineraryVenueFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItineraryVenueFormService {
  createItineraryVenueFormGroup(itineraryVenue: ItineraryVenueFormGroupInput = { id: null }): ItineraryVenueFormGroup {
    const itineraryVenueRawValue = {
      ...this.getFormDefaults(),
      ...itineraryVenue,
    };
    return new FormGroup<ItineraryVenueFormGroupContent>({
      id: new FormControl(
        { value: itineraryVenueRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      venueName: new FormControl(itineraryVenueRawValue.venueName),
      venueCost: new FormControl(itineraryVenueRawValue.venueCost),
      venueHost: new FormControl(itineraryVenueRawValue.venueHost),
      venueAddress: new FormControl(itineraryVenueRawValue.venueAddress),
    });
  }

  getItineraryVenue(form: ItineraryVenueFormGroup): IItineraryVenue | NewItineraryVenue {
    return form.getRawValue() as IItineraryVenue | NewItineraryVenue;
  }

  resetForm(form: ItineraryVenueFormGroup, itineraryVenue: ItineraryVenueFormGroupInput): void {
    const itineraryVenueRawValue = { ...this.getFormDefaults(), ...itineraryVenue };
    form.reset(
      {
        ...itineraryVenueRawValue,
        id: { value: itineraryVenueRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItineraryVenueFormDefaults {
    return {
      id: null,
    };
  }
}
