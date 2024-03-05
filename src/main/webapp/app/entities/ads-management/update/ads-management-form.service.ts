import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAdsManagement, NewAdsManagement } from '../ads-management.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAdsManagement for edit and NewAdsManagementFormGroupInput for create.
 */
type AdsManagementFormGroupInput = IAdsManagement | PartialWithRequiredKeyOf<NewAdsManagement>;

type AdsManagementFormDefaults = Pick<NewAdsManagement, 'id'>;

type AdsManagementFormGroupContent = {
  id: FormControl<IAdsManagement['id'] | NewAdsManagement['id']>;
  age: FormControl<IAdsManagement['age']>;
  gender: FormControl<IAdsManagement['gender']>;
  preference: FormControl<IAdsManagement['preference']>;
  location: FormControl<IAdsManagement['location']>;
  supplier: FormControl<IAdsManagement['supplier']>;
};

export type AdsManagementFormGroup = FormGroup<AdsManagementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AdsManagementFormService {
  createAdsManagementFormGroup(adsManagement: AdsManagementFormGroupInput = { id: null }): AdsManagementFormGroup {
    const adsManagementRawValue = {
      ...this.getFormDefaults(),
      ...adsManagement,
    };
    return new FormGroup<AdsManagementFormGroupContent>({
      id: new FormControl(
        { value: adsManagementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      age: new FormControl(adsManagementRawValue.age),
      gender: new FormControl(adsManagementRawValue.gender),
      preference: new FormControl(adsManagementRawValue.preference),
      location: new FormControl(adsManagementRawValue.location),
      supplier: new FormControl(adsManagementRawValue.supplier),
    });
  }

  getAdsManagement(form: AdsManagementFormGroup): IAdsManagement | NewAdsManagement {
    return form.getRawValue() as IAdsManagement | NewAdsManagement;
  }

  resetForm(form: AdsManagementFormGroup, adsManagement: AdsManagementFormGroupInput): void {
    const adsManagementRawValue = { ...this.getFormDefaults(), ...adsManagement };
    form.reset(
      {
        ...adsManagementRawValue,
        id: { value: adsManagementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AdsManagementFormDefaults {
    return {
      id: null,
    };
  }
}
