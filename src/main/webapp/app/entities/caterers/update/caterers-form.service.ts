import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICaterers, NewCaterers } from '../caterers.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICaterers for edit and NewCaterersFormGroupInput for create.
 */
type CaterersFormGroupInput = ICaterers | PartialWithRequiredKeyOf<NewCaterers>;

type CaterersFormDefaults = Pick<NewCaterers, 'id' | 'dietaryRequirements' | 'cuisines'>;

type CaterersFormGroupContent = {
  id: FormControl<ICaterers['id'] | NewCaterers['id']>;
  name: FormControl<ICaterers['name']>;
  picture: FormControl<ICaterers['picture']>;
  pictureContentType: FormControl<ICaterers['pictureContentType']>;
  pricePerPerson: FormControl<ICaterers['pricePerPerson']>;
  guestLimit: FormControl<ICaterers['guestLimit']>;
  bookedCaterer: FormControl<ICaterers['bookedCaterer']>;
  eventItinerary: FormControl<ICaterers['eventItinerary']>;
  supplier: FormControl<ICaterers['supplier']>;
  dietaryRequirements: FormControl<ICaterers['dietaryRequirements']>;
  cuisines: FormControl<ICaterers['cuisines']>;
  event: FormControl<ICaterers['event']>;
};

export type CaterersFormGroup = FormGroup<CaterersFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CaterersFormService {
  createCaterersFormGroup(caterers: CaterersFormGroupInput = { id: null }): CaterersFormGroup {
    const caterersRawValue = {
      ...this.getFormDefaults(),
      ...caterers,
    };
    return new FormGroup<CaterersFormGroupContent>({
      id: new FormControl(
        { value: caterersRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(caterersRawValue.name),
      picture: new FormControl(caterersRawValue.picture),
      pictureContentType: new FormControl(caterersRawValue.pictureContentType),
      pricePerPerson: new FormControl(caterersRawValue.pricePerPerson),
      guestLimit: new FormControl(caterersRawValue.guestLimit),
      bookedCaterer: new FormControl(caterersRawValue.bookedCaterer),
      eventItinerary: new FormControl(caterersRawValue.eventItinerary),
      supplier: new FormControl(caterersRawValue.supplier),
      dietaryRequirements: new FormControl(caterersRawValue.dietaryRequirements ?? []),
      cuisines: new FormControl(caterersRawValue.cuisines ?? []),
      event: new FormControl(caterersRawValue.event),
    });
  }

  getCaterers(form: CaterersFormGroup): ICaterers | NewCaterers {
    return form.getRawValue() as ICaterers | NewCaterers;
  }

  resetForm(form: CaterersFormGroup, caterers: CaterersFormGroupInput): void {
    const caterersRawValue = { ...this.getFormDefaults(), ...caterers };
    form.reset(
      {
        ...caterersRawValue,
        id: { value: caterersRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CaterersFormDefaults {
    return {
      id: null,
      dietaryRequirements: [],
      cuisines: [],
    };
  }
}
