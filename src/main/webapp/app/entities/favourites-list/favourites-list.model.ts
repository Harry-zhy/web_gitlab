export interface IFavouritesList {
  id: number;
}

export type NewFavouritesList = Omit<IFavouritesList, 'id'> & { id: null };
