import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItineraryGuest, NewItineraryGuest } from '../itinerary-guest.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItineraryGuest for edit and NewItineraryGuestFormGroupInput for create.
 */
type ItineraryGuestFormGroupInput = IItineraryGuest | PartialWithRequiredKeyOf<NewItineraryGuest>;

type ItineraryGuestFormDefaults = Pick<NewItineraryGuest, 'id' | 'rsvpStatus' | 'eventItineraries'>;

type ItineraryGuestFormGroupContent = {
  id: FormControl<IItineraryGuest['id'] | NewItineraryGuest['id']>;
  name: FormControl<IItineraryGuest['name']>;
  email: FormControl<IItineraryGuest['email']>;
  rsvpStatus: FormControl<IItineraryGuest['rsvpStatus']>;
  eventItineraries: FormControl<IItineraryGuest['eventItineraries']>;
};

export type ItineraryGuestFormGroup = FormGroup<ItineraryGuestFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItineraryGuestFormService {
  createItineraryGuestFormGroup(itineraryGuest: ItineraryGuestFormGroupInput = { id: null }): ItineraryGuestFormGroup {
    const itineraryGuestRawValue = {
      ...this.getFormDefaults(),
      ...itineraryGuest,
    };
    return new FormGroup<ItineraryGuestFormGroupContent>({
      id: new FormControl(
        { value: itineraryGuestRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(itineraryGuestRawValue.name),
      email: new FormControl(itineraryGuestRawValue.email),
      rsvpStatus: new FormControl(itineraryGuestRawValue.rsvpStatus),
      eventItineraries: new FormControl(itineraryGuestRawValue.eventItineraries ?? []),
    });
  }

  getItineraryGuest(form: ItineraryGuestFormGroup): IItineraryGuest | NewItineraryGuest {
    return form.getRawValue() as IItineraryGuest | NewItineraryGuest;
  }

  resetForm(form: ItineraryGuestFormGroup, itineraryGuest: ItineraryGuestFormGroupInput): void {
    const itineraryGuestRawValue = { ...this.getFormDefaults(), ...itineraryGuest };
    form.reset(
      {
        ...itineraryGuestRawValue,
        id: { value: itineraryGuestRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItineraryGuestFormDefaults {
    return {
      id: null,
      rsvpStatus: false,
      eventItineraries: [],
    };
  }
}
