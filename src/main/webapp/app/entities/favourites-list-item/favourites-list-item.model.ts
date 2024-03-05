import { ICaterers } from 'app/entities/caterers/caterers.model';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';
import { IVenueInformation } from 'app/entities/venue-information/venue-information.model';
import { IFavouritesList } from 'app/entities/favourites-list/favourites-list.model';
import { Category } from 'app/entities/enumerations/category.model';

export interface IFavouritesListItem {
  id: number;
  name?: string | null;
  category?: Category | null;
  description?: string | null;
  caterer?: Pick<ICaterers, 'id'> | null;
  activity?: Pick<IActivitySelf, 'id'> | null;
  venue?: Pick<IVenueInformation, 'id'> | null;
  favouritesList?: Pick<IFavouritesList, 'id'> | null;
}

export type NewFavouritesListItem = Omit<IFavouritesListItem, 'id'> & { id: null };
