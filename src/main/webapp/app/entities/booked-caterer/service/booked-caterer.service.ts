import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBookedCaterer, NewBookedCaterer } from '../booked-caterer.model';

export type PartialUpdateBookedCaterer = Partial<IBookedCaterer> & Pick<IBookedCaterer, 'id'>;

export type EntityResponseType = HttpResponse<IBookedCaterer>;
export type EntityArrayResponseType = HttpResponse<IBookedCaterer[]>;

@Injectable({ providedIn: 'root' })
export class BookedCatererService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/booked-caterers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bookedCaterer: NewBookedCaterer): Observable<EntityResponseType> {
    return this.http.post<IBookedCaterer>(this.resourceUrl, bookedCaterer, { observe: 'response' });
  }

  update(bookedCaterer: IBookedCaterer): Observable<EntityResponseType> {
    return this.http.put<IBookedCaterer>(`${this.resourceUrl}/${this.getBookedCatererIdentifier(bookedCaterer)}`, bookedCaterer, {
      observe: 'response',
    });
  }

  partialUpdate(bookedCaterer: PartialUpdateBookedCaterer): Observable<EntityResponseType> {
    return this.http.patch<IBookedCaterer>(`${this.resourceUrl}/${this.getBookedCatererIdentifier(bookedCaterer)}`, bookedCaterer, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBookedCaterer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBookedCaterer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBookedCatererIdentifier(bookedCaterer: Pick<IBookedCaterer, 'id'>): number {
    return bookedCaterer.id;
  }

  compareBookedCaterer(o1: Pick<IBookedCaterer, 'id'> | null, o2: Pick<IBookedCaterer, 'id'> | null): boolean {
    return o1 && o2 ? this.getBookedCatererIdentifier(o1) === this.getBookedCatererIdentifier(o2) : o1 === o2;
  }

  addBookedCatererToCollectionIfMissing<Type extends Pick<IBookedCaterer, 'id'>>(
    bookedCatererCollection: Type[],
    ...bookedCaterersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bookedCaterers: Type[] = bookedCaterersToCheck.filter(isPresent);
    if (bookedCaterers.length > 0) {
      const bookedCatererCollectionIdentifiers = bookedCatererCollection.map(
        bookedCatererItem => this.getBookedCatererIdentifier(bookedCatererItem)!
      );
      const bookedCaterersToAdd = bookedCaterers.filter(bookedCatererItem => {
        const bookedCatererIdentifier = this.getBookedCatererIdentifier(bookedCatererItem);
        if (bookedCatererCollectionIdentifiers.includes(bookedCatererIdentifier)) {
          return false;
        }
        bookedCatererCollectionIdentifiers.push(bookedCatererIdentifier);
        return true;
      });
      return [...bookedCaterersToAdd, ...bookedCatererCollection];
    }
    return bookedCatererCollection;
  }
}
