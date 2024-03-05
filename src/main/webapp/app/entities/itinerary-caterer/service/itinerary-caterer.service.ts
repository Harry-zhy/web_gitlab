import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItineraryCaterer, NewItineraryCaterer } from '../itinerary-caterer.model';

export type PartialUpdateItineraryCaterer = Partial<IItineraryCaterer> & Pick<IItineraryCaterer, 'id'>;

type RestOf<T extends IItineraryCaterer | NewItineraryCaterer> = Omit<T, 'catererTime'> & {
  catererTime?: string | null;
};

export type RestItineraryCaterer = RestOf<IItineraryCaterer>;

export type NewRestItineraryCaterer = RestOf<NewItineraryCaterer>;

export type PartialUpdateRestItineraryCaterer = RestOf<PartialUpdateItineraryCaterer>;

export type EntityResponseType = HttpResponse<IItineraryCaterer>;
export type EntityArrayResponseType = HttpResponse<IItineraryCaterer[]>;

@Injectable({ providedIn: 'root' })
export class ItineraryCatererService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/itinerary-caterers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itineraryCaterer: NewItineraryCaterer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itineraryCaterer);
    return this.http
      .post<RestItineraryCaterer>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(itineraryCaterer: IItineraryCaterer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itineraryCaterer);
    return this.http
      .put<RestItineraryCaterer>(`${this.resourceUrl}/${this.getItineraryCatererIdentifier(itineraryCaterer)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(itineraryCaterer: PartialUpdateItineraryCaterer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itineraryCaterer);
    return this.http
      .patch<RestItineraryCaterer>(`${this.resourceUrl}/${this.getItineraryCatererIdentifier(itineraryCaterer)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestItineraryCaterer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestItineraryCaterer[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItineraryCatererIdentifier(itineraryCaterer: Pick<IItineraryCaterer, 'id'>): number {
    return itineraryCaterer.id;
  }

  compareItineraryCaterer(o1: Pick<IItineraryCaterer, 'id'> | null, o2: Pick<IItineraryCaterer, 'id'> | null): boolean {
    return o1 && o2 ? this.getItineraryCatererIdentifier(o1) === this.getItineraryCatererIdentifier(o2) : o1 === o2;
  }

  addItineraryCatererToCollectionIfMissing<Type extends Pick<IItineraryCaterer, 'id'>>(
    itineraryCatererCollection: Type[],
    ...itineraryCaterersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itineraryCaterers: Type[] = itineraryCaterersToCheck.filter(isPresent);
    if (itineraryCaterers.length > 0) {
      const itineraryCatererCollectionIdentifiers = itineraryCatererCollection.map(
        itineraryCatererItem => this.getItineraryCatererIdentifier(itineraryCatererItem)!
      );
      const itineraryCaterersToAdd = itineraryCaterers.filter(itineraryCatererItem => {
        const itineraryCatererIdentifier = this.getItineraryCatererIdentifier(itineraryCatererItem);
        if (itineraryCatererCollectionIdentifiers.includes(itineraryCatererIdentifier)) {
          return false;
        }
        itineraryCatererCollectionIdentifiers.push(itineraryCatererIdentifier);
        return true;
      });
      return [...itineraryCaterersToAdd, ...itineraryCatererCollection];
    }
    return itineraryCatererCollection;
  }

  protected convertDateFromClient<T extends IItineraryCaterer | NewItineraryCaterer | PartialUpdateItineraryCaterer>(
    itineraryCaterer: T
  ): RestOf<T> {
    return {
      ...itineraryCaterer,
      catererTime: itineraryCaterer.catererTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restItineraryCaterer: RestItineraryCaterer): IItineraryCaterer {
    return {
      ...restItineraryCaterer,
      catererTime: restItineraryCaterer.catererTime ? dayjs(restItineraryCaterer.catererTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestItineraryCaterer>): HttpResponse<IItineraryCaterer> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestItineraryCaterer[]>): HttpResponse<IItineraryCaterer[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
