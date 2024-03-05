import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IIntro, NewIntro } from '../intro.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIntro for edit and NewIntroFormGroupInput for create.
 */
type IntroFormGroupInput = IIntro | PartialWithRequiredKeyOf<NewIntro>;

type IntroFormDefaults = Pick<NewIntro, 'id'>;

type IntroFormGroupContent = {
  id: FormControl<IIntro['id'] | NewIntro['id']>;
  title: FormControl<IIntro['title']>;
  salutation: FormControl<IIntro['salutation']>;
  body: FormControl<IIntro['body']>;
};

export type IntroFormGroup = FormGroup<IntroFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IntroFormService {
  createIntroFormGroup(intro: IntroFormGroupInput = { id: null }): IntroFormGroup {
    const introRawValue = {
      ...this.getFormDefaults(),
      ...intro,
    };
    return new FormGroup<IntroFormGroupContent>({
      id: new FormControl(
        { value: introRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(introRawValue.title, {
        validators: [Validators.required],
      }),
      salutation: new FormControl(introRawValue.salutation, {
        validators: [Validators.required],
      }),
      body: new FormControl(introRawValue.body, {
        validators: [Validators.required],
      }),
    });
  }

  getIntro(form: IntroFormGroup): IIntro | NewIntro {
    return form.getRawValue() as IIntro | NewIntro;
  }

  resetForm(form: IntroFormGroup, intro: IntroFormGroupInput): void {
    const introRawValue = { ...this.getFormDefaults(), ...intro };
    form.reset(
      {
        ...introRawValue,
        id: { value: introRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): IntroFormDefaults {
    return {
      id: null,
    };
  }
}
