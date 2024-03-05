import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFavouritesListItem, NewFavouritesListItem } from '../favourites-list-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFavouritesListItem for edit and NewFavouritesListItemFormGroupInput for create.
 */
type FavouritesListItemFormGroupInput = IFavouritesListItem | PartialWithRequiredKeyOf<NewFavouritesListItem>;

type FavouritesListItemFormDefaults = Pick<NewFavouritesListItem, 'id'>;

type FavouritesListItemFormGroupContent = {
  id: FormControl<IFavouritesListItem['id'] | NewFavouritesListItem['id']>;
  name: FormControl<IFavouritesListItem['name']>;
  category: FormControl<IFavouritesListItem['category']>;
  description: FormControl<IFavouritesListItem['description']>;
  caterer: FormControl<IFavouritesListItem['caterer']>;
  activity: FormControl<IFavouritesListItem['activity']>;
  venue: FormControl<IFavouritesListItem['venue']>;
  favouritesList: FormControl<IFavouritesListItem['favouritesList']>;
};

export type FavouritesListItemFormGroup = FormGroup<FavouritesListItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FavouritesListItemFormService {
  createFavouritesListItemFormGroup(favouritesListItem: FavouritesListItemFormGroupInput = { id: null }): FavouritesListItemFormGroup {
    const favouritesListItemRawValue = {
      ...this.getFormDefaults(),
      ...favouritesListItem,
    };
    return new FormGroup<FavouritesListItemFormGroupContent>({
      id: new FormControl(
        { value: favouritesListItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(favouritesListItemRawValue.name),
      category: new FormControl(favouritesListItemRawValue.category),
      description: new FormControl(favouritesListItemRawValue.description),
      caterer: new FormControl(favouritesListItemRawValue.caterer),
      activity: new FormControl(favouritesListItemRawValue.activity),
      venue: new FormControl(favouritesListItemRawValue.venue),
      favouritesList: new FormControl(favouritesListItemRawValue.favouritesList),
    });
  }

  getFavouritesListItem(form: FavouritesListItemFormGroup): IFavouritesListItem | NewFavouritesListItem {
    return form.getRawValue() as IFavouritesListItem | NewFavouritesListItem;
  }

  resetForm(form: FavouritesListItemFormGroup, favouritesListItem: FavouritesListItemFormGroupInput): void {
    const favouritesListItemRawValue = { ...this.getFormDefaults(), ...favouritesListItem };
    form.reset(
      {
        ...favouritesListItemRawValue,
        id: { value: favouritesListItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FavouritesListItemFormDefaults {
    return {
      id: null,
    };
  }
}
