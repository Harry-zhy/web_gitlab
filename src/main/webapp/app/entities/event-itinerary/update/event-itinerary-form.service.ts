import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEventItinerary, NewEventItinerary } from '../event-itinerary.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEventItinerary for edit and NewEventItineraryFormGroupInput for create.
 */
type EventItineraryFormGroupInput = IEventItinerary | PartialWithRequiredKeyOf<NewEventItinerary>;

type EventItineraryFormDefaults = Pick<NewEventItinerary, 'id' | 'itineraryGuests'>;

type EventItineraryFormGroupContent = {
  id: FormControl<IEventItinerary['id'] | NewEventItinerary['id']>;
  numberOfGuests: FormControl<IEventItinerary['numberOfGuests']>;
  eventDate: FormControl<IEventItinerary['eventDate']>;
  itineraryGuests: FormControl<IEventItinerary['itineraryGuests']>;
};

export type EventItineraryFormGroup = FormGroup<EventItineraryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventItineraryFormService {
  createEventItineraryFormGroup(eventItinerary: EventItineraryFormGroupInput = { id: null }): EventItineraryFormGroup {
    const eventItineraryRawValue = {
      ...this.getFormDefaults(),
      ...eventItinerary,
    };
    return new FormGroup<EventItineraryFormGroupContent>({
      id: new FormControl(
        { value: eventItineraryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      numberOfGuests: new FormControl(eventItineraryRawValue.numberOfGuests),
      eventDate: new FormControl(eventItineraryRawValue.eventDate),
      itineraryGuests: new FormControl(eventItineraryRawValue.itineraryGuests ?? []),
    });
  }

  getEventItinerary(form: EventItineraryFormGroup): IEventItinerary | NewEventItinerary {
    return form.getRawValue() as IEventItinerary | NewEventItinerary;
  }

  resetForm(form: EventItineraryFormGroup, eventItinerary: EventItineraryFormGroupInput): void {
    const eventItineraryRawValue = { ...this.getFormDefaults(), ...eventItinerary };
    form.reset(
      {
        ...eventItineraryRawValue,
        id: { value: eventItineraryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EventItineraryFormDefaults {
    return {
      id: null,
      itineraryGuests: [],
    };
  }
}
