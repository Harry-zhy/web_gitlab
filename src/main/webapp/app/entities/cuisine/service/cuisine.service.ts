import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICuisine, NewCuisine } from '../cuisine.model';

export type PartialUpdateCuisine = Partial<ICuisine> & Pick<ICuisine, 'id'>;

export type EntityResponseType = HttpResponse<ICuisine>;
export type EntityArrayResponseType = HttpResponse<ICuisine[]>;

@Injectable({ providedIn: 'root' })
export class CuisineService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cuisines');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cuisine: NewCuisine): Observable<EntityResponseType> {
    return this.http.post<ICuisine>(this.resourceUrl, cuisine, { observe: 'response' });
  }

  update(cuisine: ICuisine): Observable<EntityResponseType> {
    return this.http.put<ICuisine>(`${this.resourceUrl}/${this.getCuisineIdentifier(cuisine)}`, cuisine, { observe: 'response' });
  }

  partialUpdate(cuisine: PartialUpdateCuisine): Observable<EntityResponseType> {
    return this.http.patch<ICuisine>(`${this.resourceUrl}/${this.getCuisineIdentifier(cuisine)}`, cuisine, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICuisine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICuisine[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCuisineIdentifier(cuisine: Pick<ICuisine, 'id'>): number {
    return cuisine.id;
  }

  compareCuisine(o1: Pick<ICuisine, 'id'> | null, o2: Pick<ICuisine, 'id'> | null): boolean {
    return o1 && o2 ? this.getCuisineIdentifier(o1) === this.getCuisineIdentifier(o2) : o1 === o2;
  }

  addCuisineToCollectionIfMissing<Type extends Pick<ICuisine, 'id'>>(
    cuisineCollection: Type[],
    ...cuisinesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cuisines: Type[] = cuisinesToCheck.filter(isPresent);
    if (cuisines.length > 0) {
      const cuisineCollectionIdentifiers = cuisineCollection.map(cuisineItem => this.getCuisineIdentifier(cuisineItem)!);
      const cuisinesToAdd = cuisines.filter(cuisineItem => {
        const cuisineIdentifier = this.getCuisineIdentifier(cuisineItem);
        if (cuisineCollectionIdentifiers.includes(cuisineIdentifier)) {
          return false;
        }
        cuisineCollectionIdentifiers.push(cuisineIdentifier);
        return true;
      });
      return [...cuisinesToAdd, ...cuisineCollection];
    }
    return cuisineCollection;
  }
}
