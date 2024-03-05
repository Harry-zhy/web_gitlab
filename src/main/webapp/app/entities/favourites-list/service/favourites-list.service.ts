import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFavouritesList, NewFavouritesList } from '../favourites-list.model';

export type PartialUpdateFavouritesList = Partial<IFavouritesList> & Pick<IFavouritesList, 'id'>;

export type EntityResponseType = HttpResponse<IFavouritesList>;
export type EntityArrayResponseType = HttpResponse<IFavouritesList[]>;

@Injectable({ providedIn: 'root' })
export class FavouritesListService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/favourites-lists');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(favouritesList: NewFavouritesList): Observable<EntityResponseType> {
    return this.http.post<IFavouritesList>(this.resourceUrl, favouritesList, { observe: 'response' });
  }

  update(favouritesList: IFavouritesList): Observable<EntityResponseType> {
    return this.http.put<IFavouritesList>(`${this.resourceUrl}/${this.getFavouritesListIdentifier(favouritesList)}`, favouritesList, {
      observe: 'response',
    });
  }

  partialUpdate(favouritesList: PartialUpdateFavouritesList): Observable<EntityResponseType> {
    return this.http.patch<IFavouritesList>(`${this.resourceUrl}/${this.getFavouritesListIdentifier(favouritesList)}`, favouritesList, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFavouritesList>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFavouritesList[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFavouritesListIdentifier(favouritesList: Pick<IFavouritesList, 'id'>): number {
    return favouritesList.id;
  }

  compareFavouritesList(o1: Pick<IFavouritesList, 'id'> | null, o2: Pick<IFavouritesList, 'id'> | null): boolean {
    return o1 && o2 ? this.getFavouritesListIdentifier(o1) === this.getFavouritesListIdentifier(o2) : o1 === o2;
  }

  addFavouritesListToCollectionIfMissing<Type extends Pick<IFavouritesList, 'id'>>(
    favouritesListCollection: Type[],
    ...favouritesListsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const favouritesLists: Type[] = favouritesListsToCheck.filter(isPresent);
    if (favouritesLists.length > 0) {
      const favouritesListCollectionIdentifiers = favouritesListCollection.map(
        favouritesListItem => this.getFavouritesListIdentifier(favouritesListItem)!
      );
      const favouritesListsToAdd = favouritesLists.filter(favouritesListItem => {
        const favouritesListIdentifier = this.getFavouritesListIdentifier(favouritesListItem);
        if (favouritesListCollectionIdentifiers.includes(favouritesListIdentifier)) {
          return false;
        }
        favouritesListCollectionIdentifiers.push(favouritesListIdentifier);
        return true;
      });
      return [...favouritesListsToAdd, ...favouritesListCollection];
    }
    return favouritesListCollection;
  }
}
