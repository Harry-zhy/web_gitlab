import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRating, NewRating } from '../rating.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRating for edit and NewRatingFormGroupInput for create.
 */
type RatingFormGroupInput = IRating | PartialWithRequiredKeyOf<NewRating>;

type RatingFormDefaults = Pick<NewRating, 'id'>;

type RatingFormGroupContent = {
  id: FormControl<IRating['id'] | NewRating['id']>;
  point: FormControl<IRating['point']>;
  caterers: FormControl<IRating['caterers']>;
  activityCompany: FormControl<IRating['activityCompany']>;
  bookedActivity: FormControl<IRating['bookedActivity']>;
  activitySelf: FormControl<IRating['activitySelf']>;
};

export type RatingFormGroup = FormGroup<RatingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RatingFormService {
  createRatingFormGroup(rating: RatingFormGroupInput = { id: null }): RatingFormGroup {
    const ratingRawPoint = {
      ...this.getFormDefaults(),
      ...rating,
    };
    return new FormGroup<RatingFormGroupContent>({
      id: new FormControl(
        { value: ratingRawPoint.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      point: new FormControl(ratingRawPoint.point, {
        validators: [Validators.required],
      }),
      caterers: new FormControl(ratingRawPoint.caterers),
      activityCompany: new FormControl(ratingRawPoint.activityCompany),
      bookedActivity: new FormControl(ratingRawPoint.bookedActivity),
      activitySelf: new FormControl(ratingRawPoint.activitySelf),
    });
  }

  getRating(form: RatingFormGroup): IRating | NewRating {
    return form.getRawValue() as IRating | NewRating;
  }

  resetForm(form: RatingFormGroup, rating: RatingFormGroupInput): void {
    const ratingRawValue = { ...this.getFormDefaults(), ...rating };
    form.reset(
      {
        ...ratingRawValue,
        id: { point: ratingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RatingFormDefaults {
    return {
      id: null,
    };
  }
}
