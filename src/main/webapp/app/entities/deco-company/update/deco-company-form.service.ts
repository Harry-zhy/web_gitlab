import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDecoCompany, NewDecoCompany } from '../deco-company.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDecoCompany for edit and NewDecoCompanyFormGroupInput for create.
 */
type DecoCompanyFormGroupInput = IDecoCompany | PartialWithRequiredKeyOf<NewDecoCompany>;

type DecoCompanyFormDefaults = Pick<NewDecoCompany, 'id' | 'decoSavedCompanies' | 'decoBudgets'>;

type DecoCompanyFormGroupContent = {
  id: FormControl<IDecoCompany['id'] | NewDecoCompany['id']>;
  name: FormControl<IDecoCompany['name']>;
  about: FormControl<IDecoCompany['about']>;
  rating: FormControl<IDecoCompany['rating']>;
  decoContactDetails: FormControl<IDecoCompany['decoContactDetails']>;
  supplier: FormControl<IDecoCompany['supplier']>;
  decoSavedCompanies: FormControl<IDecoCompany['decoSavedCompanies']>;
  decoBudgets: FormControl<IDecoCompany['decoBudgets']>;
};

export type DecoCompanyFormGroup = FormGroup<DecoCompanyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DecoCompanyFormService {
  createDecoCompanyFormGroup(decoCompany: DecoCompanyFormGroupInput = { id: null }): DecoCompanyFormGroup {
    const decoCompanyRawValue = {
      ...this.getFormDefaults(),
      ...decoCompany,
    };
    return new FormGroup<DecoCompanyFormGroupContent>({
      id: new FormControl(
        { value: decoCompanyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(decoCompanyRawValue.name, {
        validators: [Validators.required],
      }),
      about: new FormControl(decoCompanyRawValue.about),
      rating: new FormControl(decoCompanyRawValue.rating),
      decoContactDetails: new FormControl(decoCompanyRawValue.decoContactDetails),
      supplier: new FormControl(decoCompanyRawValue.supplier),
      decoSavedCompanies: new FormControl(decoCompanyRawValue.decoSavedCompanies ?? []),
      decoBudgets: new FormControl(decoCompanyRawValue.decoBudgets ?? []),
    });
  }

  getDecoCompany(form: DecoCompanyFormGroup): IDecoCompany | NewDecoCompany {
    return form.getRawValue() as IDecoCompany | NewDecoCompany;
  }

  resetForm(form: DecoCompanyFormGroup, decoCompany: DecoCompanyFormGroupInput): void {
    const decoCompanyRawValue = { ...this.getFormDefaults(), ...decoCompany };
    form.reset(
      {
        ...decoCompanyRawValue,
        id: { value: decoCompanyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DecoCompanyFormDefaults {
    return {
      id: null,
      decoSavedCompanies: [],
      decoBudgets: [],
    };
  }
}
