import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDietaryRequirements, NewDietaryRequirements } from '../dietary-requirements.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDietaryRequirements for edit and NewDietaryRequirementsFormGroupInput for create.
 */
type DietaryRequirementsFormGroupInput = IDietaryRequirements | PartialWithRequiredKeyOf<NewDietaryRequirements>;

type DietaryRequirementsFormDefaults = Pick<NewDietaryRequirements, 'id' | 'caterers'>;

type DietaryRequirementsFormGroupContent = {
  id: FormControl<IDietaryRequirements['id'] | NewDietaryRequirements['id']>;
  option: FormControl<IDietaryRequirements['option']>;
  caterers: FormControl<IDietaryRequirements['caterers']>;
};

export type DietaryRequirementsFormGroup = FormGroup<DietaryRequirementsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DietaryRequirementsFormService {
  createDietaryRequirementsFormGroup(dietaryRequirements: DietaryRequirementsFormGroupInput = { id: null }): DietaryRequirementsFormGroup {
    const dietaryRequirementsRawValue = {
      ...this.getFormDefaults(),
      ...dietaryRequirements,
    };
    return new FormGroup<DietaryRequirementsFormGroupContent>({
      id: new FormControl(
        { value: dietaryRequirementsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      option: new FormControl(dietaryRequirementsRawValue.option),
      caterers: new FormControl(dietaryRequirementsRawValue.caterers ?? []),
    });
  }

  getDietaryRequirements(form: DietaryRequirementsFormGroup): IDietaryRequirements | NewDietaryRequirements {
    return form.getRawValue() as IDietaryRequirements | NewDietaryRequirements;
  }

  resetForm(form: DietaryRequirementsFormGroup, dietaryRequirements: DietaryRequirementsFormGroupInput): void {
    const dietaryRequirementsRawValue = { ...this.getFormDefaults(), ...dietaryRequirements };
    form.reset(
      {
        ...dietaryRequirementsRawValue,
        id: { value: dietaryRequirementsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DietaryRequirementsFormDefaults {
    return {
      id: null,
      caterers: [],
    };
  }
}
