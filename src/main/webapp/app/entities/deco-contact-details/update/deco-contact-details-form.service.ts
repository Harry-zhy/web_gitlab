import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDecoContactDetails, NewDecoContactDetails } from '../deco-contact-details.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDecoContactDetails for edit and NewDecoContactDetailsFormGroupInput for create.
 */
type DecoContactDetailsFormGroupInput = IDecoContactDetails | PartialWithRequiredKeyOf<NewDecoContactDetails>;

type DecoContactDetailsFormDefaults = Pick<NewDecoContactDetails, 'id'>;

type DecoContactDetailsFormGroupContent = {
  id: FormControl<IDecoContactDetails['id'] | NewDecoContactDetails['id']>;
  website: FormControl<IDecoContactDetails['website']>;
  phoneNumber: FormControl<IDecoContactDetails['phoneNumber']>;
  instagram: FormControl<IDecoContactDetails['instagram']>;
  twitter: FormControl<IDecoContactDetails['twitter']>;
  facebook: FormControl<IDecoContactDetails['facebook']>;
  tiktok: FormControl<IDecoContactDetails['tiktok']>;
};

export type DecoContactDetailsFormGroup = FormGroup<DecoContactDetailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DecoContactDetailsFormService {
  createDecoContactDetailsFormGroup(decoContactDetails: DecoContactDetailsFormGroupInput = { id: null }): DecoContactDetailsFormGroup {
    const decoContactDetailsRawValue = {
      ...this.getFormDefaults(),
      ...decoContactDetails,
    };
    return new FormGroup<DecoContactDetailsFormGroupContent>({
      id: new FormControl(
        { value: decoContactDetailsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      website: new FormControl(decoContactDetailsRawValue.website),
      phoneNumber: new FormControl(decoContactDetailsRawValue.phoneNumber),
      instagram: new FormControl(decoContactDetailsRawValue.instagram),
      twitter: new FormControl(decoContactDetailsRawValue.twitter),
      facebook: new FormControl(decoContactDetailsRawValue.facebook),
      tiktok: new FormControl(decoContactDetailsRawValue.tiktok),
    });
  }

  getDecoContactDetails(form: DecoContactDetailsFormGroup): IDecoContactDetails | NewDecoContactDetails {
    return form.getRawValue() as IDecoContactDetails | NewDecoContactDetails;
  }

  resetForm(form: DecoContactDetailsFormGroup, decoContactDetails: DecoContactDetailsFormGroupInput): void {
    const decoContactDetailsRawValue = { ...this.getFormDefaults(), ...decoContactDetails };
    form.reset(
      {
        ...decoContactDetailsRawValue,
        id: { value: decoContactDetailsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DecoContactDetailsFormDefaults {
    return {
      id: null,
    };
  }
}
