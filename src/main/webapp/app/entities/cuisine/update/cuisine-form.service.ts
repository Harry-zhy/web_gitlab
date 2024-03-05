import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICuisine, NewCuisine } from '../cuisine.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICuisine for edit and NewCuisineFormGroupInput for create.
 */
type CuisineFormGroupInput = ICuisine | PartialWithRequiredKeyOf<NewCuisine>;

type CuisineFormDefaults = Pick<NewCuisine, 'id' | 'caterers'>;

type CuisineFormGroupContent = {
  id: FormControl<ICuisine['id'] | NewCuisine['id']>;
  region: FormControl<ICuisine['region']>;
  caterers: FormControl<ICuisine['caterers']>;
};

export type CuisineFormGroup = FormGroup<CuisineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CuisineFormService {
  createCuisineFormGroup(cuisine: CuisineFormGroupInput = { id: null }): CuisineFormGroup {
    const cuisineRawValue = {
      ...this.getFormDefaults(),
      ...cuisine,
    };
    return new FormGroup<CuisineFormGroupContent>({
      id: new FormControl(
        { value: cuisineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      region: new FormControl(cuisineRawValue.region),
      caterers: new FormControl(cuisineRawValue.caterers ?? []),
    });
  }

  getCuisine(form: CuisineFormGroup): ICuisine | NewCuisine {
    return form.getRawValue() as ICuisine | NewCuisine;
  }

  resetForm(form: CuisineFormGroup, cuisine: CuisineFormGroupInput): void {
    const cuisineRawValue = { ...this.getFormDefaults(), ...cuisine };
    form.reset(
      {
        ...cuisineRawValue,
        id: { value: cuisineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CuisineFormDefaults {
    return {
      id: null,
      caterers: [],
    };
  }
}
