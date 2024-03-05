import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOneFeedback, NewOneFeedback } from '../one-feedback.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOneFeedback for edit and NewOneFeedbackFormGroupInput for create.
 */
type OneFeedbackFormGroupInput = IOneFeedback | PartialWithRequiredKeyOf<NewOneFeedback>;

type OneFeedbackFormDefaults = Pick<NewOneFeedback, 'id' | 'withMultiMedia'>;

type OneFeedbackFormGroupContent = {
  id: FormControl<IOneFeedback['id'] | NewOneFeedback['id']>;
  content: FormControl<IOneFeedback['content']>;
  withMultiMedia: FormControl<IOneFeedback['withMultiMedia']>;
  imagePath: FormControl<IOneFeedback['imagePath']>;
  videoPath: FormControl<IOneFeedback['videoPath']>;
  feedbacks: FormControl<IOneFeedback['feedbacks']>;
};

export type OneFeedbackFormGroup = FormGroup<OneFeedbackFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OneFeedbackFormService {
  createOneFeedbackFormGroup(oneFeedback: OneFeedbackFormGroupInput = { id: null }): OneFeedbackFormGroup {
    const oneFeedbackRawValue = {
      ...this.getFormDefaults(),
      ...oneFeedback,
    };
    return new FormGroup<OneFeedbackFormGroupContent>({
      id: new FormControl(
        { value: oneFeedbackRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      content: new FormControl(oneFeedbackRawValue.content, {
        validators: [Validators.required],
      }),
      withMultiMedia: new FormControl(oneFeedbackRawValue.withMultiMedia, {
        validators: [Validators.required],
      }),
      imagePath: new FormControl(oneFeedbackRawValue.imagePath),
      videoPath: new FormControl(oneFeedbackRawValue.videoPath),
      feedbacks: new FormControl(oneFeedbackRawValue.feedbacks),
    });
  }

  getOneFeedback(form: OneFeedbackFormGroup): IOneFeedback | NewOneFeedback {
    return form.getRawValue() as IOneFeedback | NewOneFeedback;
  }

  resetForm(form: OneFeedbackFormGroup, oneFeedback: OneFeedbackFormGroupInput): void {
    const oneFeedbackRawValue = { ...this.getFormDefaults(), ...oneFeedback };
    form.reset(
      {
        ...oneFeedbackRawValue,
        id: { value: oneFeedbackRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OneFeedbackFormDefaults {
    return {
      id: null,
      withMultiMedia: false,
    };
  }
}
