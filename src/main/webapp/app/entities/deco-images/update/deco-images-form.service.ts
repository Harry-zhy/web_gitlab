import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDecoImages, NewDecoImages } from '../deco-images.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDecoImages for edit and NewDecoImagesFormGroupInput for create.
 */
type DecoImagesFormGroupInput = IDecoImages | PartialWithRequiredKeyOf<NewDecoImages>;

type DecoImagesFormDefaults = Pick<NewDecoImages, 'id'>;

type DecoImagesFormGroupContent = {
  id: FormControl<IDecoImages['id'] | NewDecoImages['id']>;
  picture: FormControl<IDecoImages['picture']>;
  pictureContentType: FormControl<IDecoImages['pictureContentType']>;
  decoThemes: FormControl<IDecoImages['decoThemes']>;
  decoCompany: FormControl<IDecoImages['decoCompany']>;
};

export type DecoImagesFormGroup = FormGroup<DecoImagesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DecoImagesFormService {
  createDecoImagesFormGroup(decoImages: DecoImagesFormGroupInput = { id: null }): DecoImagesFormGroup {
    const decoImagesRawValue = {
      ...this.getFormDefaults(),
      ...decoImages,
    };
    return new FormGroup<DecoImagesFormGroupContent>({
      id: new FormControl(
        { value: decoImagesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      picture: new FormControl(decoImagesRawValue.picture, {
        validators: [Validators.required],
      }),
      pictureContentType: new FormControl(decoImagesRawValue.pictureContentType),
      decoThemes: new FormControl(decoImagesRawValue.decoThemes),
      decoCompany: new FormControl(decoImagesRawValue.decoCompany),
    });
  }

  getDecoImages(form: DecoImagesFormGroup): IDecoImages | NewDecoImages {
    return form.getRawValue() as IDecoImages | NewDecoImages;
  }

  resetForm(form: DecoImagesFormGroup, decoImages: DecoImagesFormGroupInput): void {
    const decoImagesRawValue = { ...this.getFormDefaults(), ...decoImages };
    form.reset(
      {
        ...decoImagesRawValue,
        id: { value: decoImagesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DecoImagesFormDefaults {
    return {
      id: null,
    };
  }
}
