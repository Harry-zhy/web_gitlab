import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBusinessInformation, NewBusinessInformation } from '../business-information.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBusinessInformation for edit and NewBusinessInformationFormGroupInput for create.
 */
type BusinessInformationFormGroupInput = IBusinessInformation | PartialWithRequiredKeyOf<NewBusinessInformation>;

type BusinessInformationFormDefaults = Pick<NewBusinessInformation, 'id'>;

type BusinessInformationFormGroupContent = {
  id: FormControl<IBusinessInformation['id'] | NewBusinessInformation['id']>;
  information: FormControl<IBusinessInformation['information']>;
  businessHours: FormControl<IBusinessInformation['businessHours']>;
  specialServicesAvailable: FormControl<IBusinessInformation['specialServicesAvailable']>;
  supplier: FormControl<IBusinessInformation['supplier']>;
};

export type BusinessInformationFormGroup = FormGroup<BusinessInformationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BusinessInformationFormService {
  createBusinessInformationFormGroup(businessInformation: BusinessInformationFormGroupInput = { id: null }): BusinessInformationFormGroup {
    const businessInformationRawValue = {
      ...this.getFormDefaults(),
      ...businessInformation,
    };
    return new FormGroup<BusinessInformationFormGroupContent>({
      id: new FormControl(
        { value: businessInformationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      information: new FormControl(businessInformationRawValue.information),
      businessHours: new FormControl(businessInformationRawValue.businessHours),
      specialServicesAvailable: new FormControl(businessInformationRawValue.specialServicesAvailable),
      supplier: new FormControl(businessInformationRawValue.supplier),
    });
  }

  getBusinessInformation(form: BusinessInformationFormGroup): IBusinessInformation | NewBusinessInformation {
    return form.getRawValue() as IBusinessInformation | NewBusinessInformation;
  }

  resetForm(form: BusinessInformationFormGroup, businessInformation: BusinessInformationFormGroupInput): void {
    const businessInformationRawValue = { ...this.getFormDefaults(), ...businessInformation };
    form.reset(
      {
        ...businessInformationRawValue,
        id: { value: businessInformationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BusinessInformationFormDefaults {
    return {
      id: null,
    };
  }
}
