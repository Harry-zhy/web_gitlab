import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActivityContactDetails, NewActivityContactDetails } from '../activity-contact-details.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActivityContactDetails for edit and NewActivityContactDetailsFormGroupInput for create.
 */
type ActivityContactDetailsFormGroupInput = IActivityContactDetails | PartialWithRequiredKeyOf<NewActivityContactDetails>;

type ActivityContactDetailsFormDefaults = Pick<NewActivityContactDetails, 'id'>;

type ActivityContactDetailsFormGroupContent = {
  id: FormControl<IActivityContactDetails['id'] | NewActivityContactDetails['id']>;
  website: FormControl<IActivityContactDetails['website']>;
  twitter: FormControl<IActivityContactDetails['twitter']>;
  instagram: FormControl<IActivityContactDetails['instagram']>;
  facebook: FormControl<IActivityContactDetails['facebook']>;
  tiktok: FormControl<IActivityContactDetails['tiktok']>;
  phoneNumber: FormControl<IActivityContactDetails['phoneNumber']>;
  activityCompany: FormControl<IActivityContactDetails['activityCompany']>;
};

export type ActivityContactDetailsFormGroup = FormGroup<ActivityContactDetailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActivityContactDetailsFormService {
  createActivityContactDetailsFormGroup(
    activityContactDetails: ActivityContactDetailsFormGroupInput = { id: null }
  ): ActivityContactDetailsFormGroup {
    const activityContactDetailsRawValue = {
      ...this.getFormDefaults(),
      ...activityContactDetails,
    };
    return new FormGroup<ActivityContactDetailsFormGroupContent>({
      id: new FormControl(
        { value: activityContactDetailsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      website: new FormControl(activityContactDetailsRawValue.website),
      twitter: new FormControl(activityContactDetailsRawValue.twitter),
      instagram: new FormControl(activityContactDetailsRawValue.instagram),
      facebook: new FormControl(activityContactDetailsRawValue.facebook),
      tiktok: new FormControl(activityContactDetailsRawValue.tiktok),
      phoneNumber: new FormControl(activityContactDetailsRawValue.phoneNumber),
      activityCompany: new FormControl(activityContactDetailsRawValue.activityCompany),
    });
  }

  getActivityContactDetails(form: ActivityContactDetailsFormGroup): IActivityContactDetails | NewActivityContactDetails {
    return form.getRawValue() as IActivityContactDetails | NewActivityContactDetails;
  }

  resetForm(form: ActivityContactDetailsFormGroup, activityContactDetails: ActivityContactDetailsFormGroupInput): void {
    const activityContactDetailsRawValue = { ...this.getFormDefaults(), ...activityContactDetails };
    form.reset(
      {
        ...activityContactDetailsRawValue,
        id: { value: activityContactDetailsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActivityContactDetailsFormDefaults {
    return {
      id: null,
    };
  }
}
