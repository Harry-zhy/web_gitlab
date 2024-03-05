import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDecoSavedTheme, NewDecoSavedTheme } from '../deco-saved-theme.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDecoSavedTheme for edit and NewDecoSavedThemeFormGroupInput for create.
 */
type DecoSavedThemeFormGroupInput = IDecoSavedTheme | PartialWithRequiredKeyOf<NewDecoSavedTheme>;

type DecoSavedThemeFormDefaults = Pick<NewDecoSavedTheme, 'id' | 'decoThemes'>;

type DecoSavedThemeFormGroupContent = {
  id: FormControl<IDecoSavedTheme['id'] | NewDecoSavedTheme['id']>;
  name: FormControl<IDecoSavedTheme['name']>;
  decoThemes: FormControl<IDecoSavedTheme['decoThemes']>;
};

export type DecoSavedThemeFormGroup = FormGroup<DecoSavedThemeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DecoSavedThemeFormService {
  createDecoSavedThemeFormGroup(decoSavedTheme: DecoSavedThemeFormGroupInput = { id: null }): DecoSavedThemeFormGroup {
    const decoSavedThemeRawValue = {
      ...this.getFormDefaults(),
      ...decoSavedTheme,
    };
    return new FormGroup<DecoSavedThemeFormGroupContent>({
      id: new FormControl(
        { value: decoSavedThemeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(decoSavedThemeRawValue.name),
      decoThemes: new FormControl(decoSavedThemeRawValue.decoThemes ?? []),
    });
  }

  getDecoSavedTheme(form: DecoSavedThemeFormGroup): IDecoSavedTheme | NewDecoSavedTheme {
    return form.getRawValue() as IDecoSavedTheme | NewDecoSavedTheme;
  }

  resetForm(form: DecoSavedThemeFormGroup, decoSavedTheme: DecoSavedThemeFormGroupInput): void {
    const decoSavedThemeRawValue = { ...this.getFormDefaults(), ...decoSavedTheme };
    form.reset(
      {
        ...decoSavedThemeRawValue,
        id: { value: decoSavedThemeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DecoSavedThemeFormDefaults {
    return {
      id: null,
      decoThemes: [],
    };
  }
}
