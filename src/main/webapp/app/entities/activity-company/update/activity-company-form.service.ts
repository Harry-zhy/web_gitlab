import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActivityCompany, NewActivityCompany } from '../activity-company.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActivityCompany for edit and NewActivityCompanyFormGroupInput for create.
 */
type ActivityCompanyFormGroupInput = IActivityCompany | PartialWithRequiredKeyOf<NewActivityCompany>;

type ActivityCompanyFormDefaults = Pick<NewActivityCompany, 'id'>;

type ActivityCompanyFormGroupContent = {
  id: FormControl<IActivityCompany['id'] | NewActivityCompany['id']>;
  name: FormControl<IActivityCompany['name']>;
  about: FormControl<IActivityCompany['about']>;
  supplier: FormControl<IActivityCompany['supplier']>;
  bookedActivity: FormControl<IActivityCompany['bookedActivity']>;
};

export type ActivityCompanyFormGroup = FormGroup<ActivityCompanyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActivityCompanyFormService {
  createActivityCompanyFormGroup(activityCompany: ActivityCompanyFormGroupInput = { id: null }): ActivityCompanyFormGroup {
    const activityCompanyRawValue = {
      ...this.getFormDefaults(),
      ...activityCompany,
    };
    return new FormGroup<ActivityCompanyFormGroupContent>({
      id: new FormControl(
        { value: activityCompanyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(activityCompanyRawValue.name, {
        validators: [Validators.required],
      }),
      about: new FormControl(activityCompanyRawValue.about),
      supplier: new FormControl(activityCompanyRawValue.supplier),
      bookedActivity: new FormControl(activityCompanyRawValue.bookedActivity),
    });
  }

  getActivityCompany(form: ActivityCompanyFormGroup): IActivityCompany | NewActivityCompany {
    return form.getRawValue() as IActivityCompany | NewActivityCompany;
  }

  resetForm(form: ActivityCompanyFormGroup, activityCompany: ActivityCompanyFormGroupInput): void {
    const activityCompanyRawValue = { ...this.getFormDefaults(), ...activityCompany };
    form.reset(
      {
        ...activityCompanyRawValue,
        id: { value: activityCompanyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActivityCompanyFormDefaults {
    return {
      id: null,
    };
  }
}
