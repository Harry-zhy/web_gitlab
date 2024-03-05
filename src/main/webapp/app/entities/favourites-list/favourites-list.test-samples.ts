import { IFavouritesList, NewFavouritesList } from './favourites-list.model';

export const sampleWithRequiredData: IFavouritesList = {
  id: 83472,
};

export const sampleWithPartialData: IFavouritesList = {
  id: 31076,
};

export const sampleWithFullData: IFavouritesList = {
  id: 17144,
};

export const sampleWithNewData: NewFavouritesList = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
