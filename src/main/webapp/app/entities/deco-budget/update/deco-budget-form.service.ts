import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDecoBudget, NewDecoBudget } from '../deco-budget.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDecoBudget for edit and NewDecoBudgetFormGroupInput for create.
 */
type DecoBudgetFormGroupInput = IDecoBudget | PartialWithRequiredKeyOf<NewDecoBudget>;

type DecoBudgetFormDefaults = Pick<NewDecoBudget, 'id' | 'decoCompanies'>;

type DecoBudgetFormGroupContent = {
  id: FormControl<IDecoBudget['id'] | NewDecoBudget['id']>;
  money: FormControl<IDecoBudget['money']>;
  decoCompanies: FormControl<IDecoBudget['decoCompanies']>;
};

export type DecoBudgetFormGroup = FormGroup<DecoBudgetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DecoBudgetFormService {
  createDecoBudgetFormGroup(decoBudget: DecoBudgetFormGroupInput = { id: null }): DecoBudgetFormGroup {
    const decoBudgetRawValue = {
      ...this.getFormDefaults(),
      ...decoBudget,
    };
    return new FormGroup<DecoBudgetFormGroupContent>({
      id: new FormControl(
        { value: decoBudgetRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      money: new FormControl(decoBudgetRawValue.money),
      decoCompanies: new FormControl(decoBudgetRawValue.decoCompanies ?? []),
    });
  }

  getDecoBudget(form: DecoBudgetFormGroup): IDecoBudget | NewDecoBudget {
    return form.getRawValue() as IDecoBudget | NewDecoBudget;
  }

  resetForm(form: DecoBudgetFormGroup, decoBudget: DecoBudgetFormGroupInput): void {
    const decoBudgetRawValue = { ...this.getFormDefaults(), ...decoBudget };
    form.reset(
      {
        ...decoBudgetRawValue,
        id: { value: decoBudgetRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DecoBudgetFormDefaults {
    return {
      id: null,
      decoCompanies: [],
    };
  }
}
