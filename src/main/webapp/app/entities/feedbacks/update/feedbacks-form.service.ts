import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFeedbacks, NewFeedbacks } from '../feedbacks.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFeedbacks for edit and NewFeedbacksFormGroupInput for create.
 */
type FeedbacksFormGroupInput = IFeedbacks | PartialWithRequiredKeyOf<NewFeedbacks>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFeedbacks | NewFeedbacks> = Omit<T, 'date'> & {
  date?: string | null;
};

type FeedbacksFormRawValue = FormValueOf<IFeedbacks>;

type NewFeedbacksFormRawValue = FormValueOf<NewFeedbacks>;

type FeedbacksFormDefaults = Pick<NewFeedbacks, 'id' | 'date'>;

type FeedbacksFormGroupContent = {
  id: FormControl<FeedbacksFormRawValue['id'] | NewFeedbacks['id']>;
  date: FormControl<FeedbacksFormRawValue['date']>;
  userName: FormControl<FeedbacksFormRawValue['userName']>;
  rating: FormControl<FeedbacksFormRawValue['rating']>;
  supplier: FormControl<FeedbacksFormRawValue['supplier']>;
};

export type FeedbacksFormGroup = FormGroup<FeedbacksFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FeedbacksFormService {
  createFeedbacksFormGroup(feedbacks: FeedbacksFormGroupInput = { id: null }): FeedbacksFormGroup {
    const feedbacksRawValue = this.convertFeedbacksToFeedbacksRawValue({
      ...this.getFormDefaults(),
      ...feedbacks,
    });
    return new FormGroup<FeedbacksFormGroupContent>({
      id: new FormControl(
        { value: feedbacksRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(feedbacksRawValue.date, {
        validators: [Validators.required],
      }),
      userName: new FormControl(feedbacksRawValue.userName, {
        validators: [Validators.required],
      }),
      rating: new FormControl(feedbacksRawValue.rating),
      supplier: new FormControl(feedbacksRawValue.supplier),
    });
  }

  getFeedbacks(form: FeedbacksFormGroup): IFeedbacks | NewFeedbacks {
    return this.convertFeedbacksRawValueToFeedbacks(form.getRawValue() as FeedbacksFormRawValue | NewFeedbacksFormRawValue);
  }

  resetForm(form: FeedbacksFormGroup, feedbacks: FeedbacksFormGroupInput): void {
    const feedbacksRawValue = this.convertFeedbacksToFeedbacksRawValue({ ...this.getFormDefaults(), ...feedbacks });
    form.reset(
      {
        ...feedbacksRawValue,
        id: { value: feedbacksRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FeedbacksFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertFeedbacksRawValueToFeedbacks(rawFeedbacks: FeedbacksFormRawValue | NewFeedbacksFormRawValue): IFeedbacks | NewFeedbacks {
    return {
      ...rawFeedbacks,
      date: dayjs(rawFeedbacks.date, DATE_TIME_FORMAT),
    };
  }

  private convertFeedbacksToFeedbacksRawValue(
    feedbacks: IFeedbacks | (Partial<NewFeedbacks> & FeedbacksFormDefaults)
  ): FeedbacksFormRawValue | PartialWithRequiredKeyOf<NewFeedbacksFormRawValue> {
    return {
      ...feedbacks,
      date: feedbacks.date ? feedbacks.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
