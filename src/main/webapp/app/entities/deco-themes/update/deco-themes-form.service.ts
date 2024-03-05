import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDecoThemes, NewDecoThemes } from '../deco-themes.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDecoThemes for edit and NewDecoThemesFormGroupInput for create.
 */
type DecoThemesFormGroupInput = IDecoThemes | PartialWithRequiredKeyOf<NewDecoThemes>;

type DecoThemesFormDefaults = Pick<NewDecoThemes, 'id' | 'decoSavedThemes'>;

type DecoThemesFormGroupContent = {
  id: FormControl<IDecoThemes['id'] | NewDecoThemes['id']>;
  description: FormControl<IDecoThemes['description']>;
  name: FormControl<IDecoThemes['name']>;
  decoSavedThemes: FormControl<IDecoThemes['decoSavedThemes']>;
};

export type DecoThemesFormGroup = FormGroup<DecoThemesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DecoThemesFormService {
  createDecoThemesFormGroup(decoThemes: DecoThemesFormGroupInput = { id: null }): DecoThemesFormGroup {
    const decoThemesRawValue = {
      ...this.getFormDefaults(),
      ...decoThemes,
    };
    return new FormGroup<DecoThemesFormGroupContent>({
      id: new FormControl(
        { value: decoThemesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(decoThemesRawValue.description),
      name: new FormControl(decoThemesRawValue.name),
      decoSavedThemes: new FormControl(decoThemesRawValue.decoSavedThemes ?? []),
    });
  }

  getDecoThemes(form: DecoThemesFormGroup): IDecoThemes | NewDecoThemes {
    return form.getRawValue() as IDecoThemes | NewDecoThemes;
  }

  resetForm(form: DecoThemesFormGroup, decoThemes: DecoThemesFormGroupInput): void {
    const decoThemesRawValue = { ...this.getFormDefaults(), ...decoThemes };
    form.reset(
      {
        ...decoThemesRawValue,
        id: { value: decoThemesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DecoThemesFormDefaults {
    return {
      id: null,
      decoSavedThemes: [],
    };
  }
}
