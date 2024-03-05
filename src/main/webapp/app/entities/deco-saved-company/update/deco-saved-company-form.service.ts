import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDecoSavedCompany, NewDecoSavedCompany } from '../deco-saved-company.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDecoSavedCompany for edit and NewDecoSavedCompanyFormGroupInput for create.
 */
type DecoSavedCompanyFormGroupInput = IDecoSavedCompany | PartialWithRequiredKeyOf<NewDecoSavedCompany>;

type DecoSavedCompanyFormDefaults = Pick<NewDecoSavedCompany, 'id' | 'decoCompanies'>;

type DecoSavedCompanyFormGroupContent = {
  id: FormControl<IDecoSavedCompany['id'] | NewDecoSavedCompany['id']>;
  name: FormControl<IDecoSavedCompany['name']>;
  decoCompanies: FormControl<IDecoSavedCompany['decoCompanies']>;
};

export type DecoSavedCompanyFormGroup = FormGroup<DecoSavedCompanyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DecoSavedCompanyFormService {
  createDecoSavedCompanyFormGroup(decoSavedCompany: DecoSavedCompanyFormGroupInput = { id: null }): DecoSavedCompanyFormGroup {
    const decoSavedCompanyRawValue = {
      ...this.getFormDefaults(),
      ...decoSavedCompany,
    };
    return new FormGroup<DecoSavedCompanyFormGroupContent>({
      id: new FormControl(
        { value: decoSavedCompanyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(decoSavedCompanyRawValue.name),
      decoCompanies: new FormControl(decoSavedCompanyRawValue.decoCompanies ?? []),
    });
  }

  getDecoSavedCompany(form: DecoSavedCompanyFormGroup): IDecoSavedCompany | NewDecoSavedCompany {
    return form.getRawValue() as IDecoSavedCompany | NewDecoSavedCompany;
  }

  resetForm(form: DecoSavedCompanyFormGroup, decoSavedCompany: DecoSavedCompanyFormGroupInput): void {
    const decoSavedCompanyRawValue = { ...this.getFormDefaults(), ...decoSavedCompany };
    form.reset(
      {
        ...decoSavedCompanyRawValue,
        id: { value: decoSavedCompanyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DecoSavedCompanyFormDefaults {
    return {
      id: null,
      decoCompanies: [],
    };
  }
}
