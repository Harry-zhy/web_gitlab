import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBookedCaterer, NewBookedCaterer } from '../booked-caterer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBookedCaterer for edit and NewBookedCatererFormGroupInput for create.
 */
type BookedCatererFormGroupInput = IBookedCaterer | PartialWithRequiredKeyOf<NewBookedCaterer>;

type BookedCatererFormDefaults = Pick<NewBookedCaterer, 'id' | 'confirmationStatus'>;

type BookedCatererFormGroupContent = {
  id: FormControl<IBookedCaterer['id'] | NewBookedCaterer['id']>;
  confirmationStatus: FormControl<IBookedCaterer['confirmationStatus']>;
  itinerary: FormControl<IBookedCaterer['itinerary']>;
};

export type BookedCatererFormGroup = FormGroup<BookedCatererFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BookedCatererFormService {
  createBookedCatererFormGroup(bookedCaterer: BookedCatererFormGroupInput = { id: null }): BookedCatererFormGroup {
    const bookedCatererRawValue = {
      ...this.getFormDefaults(),
      ...bookedCaterer,
    };
    return new FormGroup<BookedCatererFormGroupContent>({
      id: new FormControl(
        { value: bookedCatererRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      confirmationStatus: new FormControl(bookedCatererRawValue.confirmationStatus),
      itinerary: new FormControl(bookedCatererRawValue.itinerary),
    });
  }

  getBookedCaterer(form: BookedCatererFormGroup): IBookedCaterer | NewBookedCaterer {
    return form.getRawValue() as IBookedCaterer | NewBookedCaterer;
  }

  resetForm(form: BookedCatererFormGroup, bookedCaterer: BookedCatererFormGroupInput): void {
    const bookedCatererRawValue = { ...this.getFormDefaults(), ...bookedCaterer };
    form.reset(
      {
        ...bookedCatererRawValue,
        id: { value: bookedCatererRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BookedCatererFormDefaults {
    return {
      id: null,
      confirmationStatus: false,
    };
  }
}
