import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICaterers, NewCaterers } from '../caterers.model';

export type PartialUpdateCaterers = Partial<ICaterers> & Pick<ICaterers, 'id'>;

export type EntityResponseType = HttpResponse<ICaterers>;
export type EntityArrayResponseType = HttpResponse<ICaterers[]>;

@Injectable({ providedIn: 'root' })
export class CaterersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/caterers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(caterers: NewCaterers): Observable<EntityResponseType> {
    return this.http.post<ICaterers>(this.resourceUrl, caterers, { observe: 'response' });
  }

  update(caterers: ICaterers): Observable<EntityResponseType> {
    return this.http.put<ICaterers>(`${this.resourceUrl}/${this.getCaterersIdentifier(caterers)}`, caterers, { observe: 'response' });
  }

  partialUpdate(caterers: PartialUpdateCaterers): Observable<EntityResponseType> {
    return this.http.patch<ICaterers>(`${this.resourceUrl}/${this.getCaterersIdentifier(caterers)}`, caterers, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICaterers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICaterers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCaterersIdentifier(caterers: Pick<ICaterers, 'id'>): number {
    return caterers.id;
  }

  compareCaterers(o1: Pick<ICaterers, 'id'> | null, o2: Pick<ICaterers, 'id'> | null): boolean {
    return o1 && o2 ? this.getCaterersIdentifier(o1) === this.getCaterersIdentifier(o2) : o1 === o2;
  }

  addCaterersToCollectionIfMissing<Type extends Pick<ICaterers, 'id'>>(
    caterersCollection: Type[],
    ...caterersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const caterers: Type[] = caterersToCheck.filter(isPresent);
    if (caterers.length > 0) {
      const caterersCollectionIdentifiers = caterersCollection.map(caterersItem => this.getCaterersIdentifier(caterersItem)!);
      const caterersToAdd = caterers.filter(caterersItem => {
        const caterersIdentifier = this.getCaterersIdentifier(caterersItem);
        if (caterersCollectionIdentifiers.includes(caterersIdentifier)) {
          return false;
        }
        caterersCollectionIdentifiers.push(caterersIdentifier);
        return true;
      });
      return [...caterersToAdd, ...caterersCollection];
    }
    return caterersCollection;
  }
}
