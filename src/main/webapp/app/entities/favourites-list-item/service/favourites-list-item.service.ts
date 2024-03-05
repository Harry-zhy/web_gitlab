import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFavouritesListItem, NewFavouritesListItem } from '../favourites-list-item.model';

export type PartialUpdateFavouritesListItem = Partial<IFavouritesListItem> & Pick<IFavouritesListItem, 'id'>;

export type EntityResponseType = HttpResponse<IFavouritesListItem>;
export type EntityArrayResponseType = HttpResponse<IFavouritesListItem[]>;

@Injectable({ providedIn: 'root' })
export class FavouritesListItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/favourites-list-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(favouritesListItem: NewFavouritesListItem): Observable<EntityResponseType> {
    return this.http.post<IFavouritesListItem>(this.resourceUrl, favouritesListItem, { observe: 'response' });
  }

  update(favouritesListItem: IFavouritesListItem): Observable<EntityResponseType> {
    return this.http.put<IFavouritesListItem>(
      `${this.resourceUrl}/${this.getFavouritesListItemIdentifier(favouritesListItem)}`,
      favouritesListItem,
      { observe: 'response' }
    );
  }

  partialUpdate(favouritesListItem: PartialUpdateFavouritesListItem): Observable<EntityResponseType> {
    return this.http.patch<IFavouritesListItem>(
      `${this.resourceUrl}/${this.getFavouritesListItemIdentifier(favouritesListItem)}`,
      favouritesListItem,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFavouritesListItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFavouritesListItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFavouritesListItemIdentifier(favouritesListItem: Pick<IFavouritesListItem, 'id'>): number {
    return favouritesListItem.id;
  }

  compareFavouritesListItem(o1: Pick<IFavouritesListItem, 'id'> | null, o2: Pick<IFavouritesListItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getFavouritesListItemIdentifier(o1) === this.getFavouritesListItemIdentifier(o2) : o1 === o2;
  }

  addFavouritesListItemToCollectionIfMissing<Type extends Pick<IFavouritesListItem, 'id'>>(
    favouritesListItemCollection: Type[],
    ...favouritesListItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const favouritesListItems: Type[] = favouritesListItemsToCheck.filter(isPresent);
    if (favouritesListItems.length > 0) {
      const favouritesListItemCollectionIdentifiers = favouritesListItemCollection.map(
        favouritesListItemItem => this.getFavouritesListItemIdentifier(favouritesListItemItem)!
      );
      const favouritesListItemsToAdd = favouritesListItems.filter(favouritesListItemItem => {
        const favouritesListItemIdentifier = this.getFavouritesListItemIdentifier(favouritesListItemItem);
        if (favouritesListItemCollectionIdentifiers.includes(favouritesListItemIdentifier)) {
          return false;
        }
        favouritesListItemCollectionIdentifiers.push(favouritesListItemIdentifier);
        return true;
      });
      return [...favouritesListItemsToAdd, ...favouritesListItemCollection];
    }
    return favouritesListItemCollection;
  }
}
