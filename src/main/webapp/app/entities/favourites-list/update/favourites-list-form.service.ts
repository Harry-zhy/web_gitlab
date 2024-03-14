import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFavouritesList, NewFavouritesList } from '../favourites-list.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFavouritesList for edit and NewFavouritesListFormGroupInput for create.
 */
type FavouritesListFormGroupInput = IFavouritesList | PartialWithRequiredKeyOf<NewFavouritesList>;

type FavouritesListFormDefaults = Pick<NewFavouritesList, 'id'>;

type FavouritesListFormGroupContent = {
  id: FormControl<IFavouritesList['id'] | NewFavouritesList['id']>;
};

export type FavouritesListFormGroup = FormGroup<FavouritesListFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FavouritesListFormService {
  createFavouritesListFormGroup(favouritesList: FavouritesListFormGroupInput = { id: null }): FavouritesListFormGroup {
    const favouritesListRawValue = {
      ...this.getFormDefaults(),
      ...favouritesList,
    };
    return new FormGroup<FavouritesListFormGroupContent>({
      id: new FormControl(
        { value: favouritesListRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
    });
  }

  getFavouritesList(form: FavouritesListFormGroup): IFavouritesList | NewFavouritesList {
    if (form.controls.id.disabled) {
      // form.value returns id with null value for FormGroup with only one FormControl
      return form.getRawValue() as IFavouritesList | NewFavouritesList; //Some errors here, origin one: return {};
    }
    return form.getRawValue() as IFavouritesList | NewFavouritesList;
  }

  resetForm(form: FavouritesListFormGroup, favouritesList: FavouritesListFormGroupInput): void {
    const favouritesListRawValue = { ...this.getFormDefaults(), ...favouritesList };
    form.reset(
      {
        ...favouritesListRawValue,
        id: { value: favouritesListRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FavouritesListFormDefaults {
    return {
      id: null,
    };
  }
}
