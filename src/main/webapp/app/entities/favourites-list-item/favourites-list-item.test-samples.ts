import { Category } from 'app/entities/enumerations/category.model';

import { IFavouritesListItem, NewFavouritesListItem } from './favourites-list-item.model';

export const sampleWithRequiredData: IFavouritesListItem = {
  id: 78917,
};

export const sampleWithPartialData: IFavouritesListItem = {
  id: 15712,
  description: 'deposit Awesome Chips',
};

export const sampleWithFullData: IFavouritesListItem = {
  id: 61400,
  name: 'index Montana Argentina',
  category: Category['OTHER'],
  description: 'next-generation',
};

export const sampleWithNewData: NewFavouritesListItem = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
