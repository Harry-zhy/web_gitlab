import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActivityImage, NewActivityImage } from '../activity-image.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActivityImage for edit and NewActivityImageFormGroupInput for create.
 */
type ActivityImageFormGroupInput = IActivityImage | PartialWithRequiredKeyOf<NewActivityImage>;

type ActivityImageFormDefaults = Pick<NewActivityImage, 'id'>;

type ActivityImageFormGroupContent = {
  id: FormControl<IActivityImage['id'] | NewActivityImage['id']>;
  picture: FormControl<IActivityImage['picture']>;
  pictureContentType: FormControl<IActivityImage['pictureContentType']>;
  activityCompany: FormControl<IActivityImage['activityCompany']>;
  activitySelf: FormControl<IActivityImage['activitySelf']>;
};

export type ActivityImageFormGroup = FormGroup<ActivityImageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActivityImageFormService {
  createActivityImageFormGroup(activityImage: ActivityImageFormGroupInput = { id: null }): ActivityImageFormGroup {
    const activityImageRawValue = {
      ...this.getFormDefaults(),
      ...activityImage,
    };
    return new FormGroup<ActivityImageFormGroupContent>({
      id: new FormControl(
        { value: activityImageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      picture: new FormControl(activityImageRawValue.picture),
      pictureContentType: new FormControl(activityImageRawValue.pictureContentType),
      activityCompany: new FormControl(activityImageRawValue.activityCompany),
      activitySelf: new FormControl(activityImageRawValue.activitySelf),
    });
  }

  getActivityImage(form: ActivityImageFormGroup): IActivityImage | NewActivityImage {
    return form.getRawValue() as IActivityImage | NewActivityImage;
  }

  resetForm(form: ActivityImageFormGroup, activityImage: ActivityImageFormGroupInput): void {
    const activityImageRawValue = { ...this.getFormDefaults(), ...activityImage };
    form.reset(
      {
        ...activityImageRawValue,
        id: { value: activityImageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActivityImageFormDefaults {
    return {
      id: null,
    };
  }
}
