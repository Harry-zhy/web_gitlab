import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItinerary, NewItinerary } from '../itinerary.model';

export type PartialUpdateItinerary = Partial<IItinerary> & Pick<IItinerary, 'id'>;

type RestOf<T extends IItinerary | NewItinerary> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

export type RestItinerary = RestOf<IItinerary>;

export type NewRestItinerary = RestOf<NewItinerary>;

export type PartialUpdateRestItinerary = RestOf<PartialUpdateItinerary>;

export type EntityResponseType = HttpResponse<IItinerary>;
export type EntityArrayResponseType = HttpResponse<IItinerary[]>;

@Injectable({ providedIn: 'root' })
export class ItineraryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/itineraries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itinerary: NewItinerary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itinerary);
    return this.http
      .post<RestItinerary>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(itinerary: IItinerary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itinerary);
    return this.http
      .put<RestItinerary>(`${this.resourceUrl}/${this.getItineraryIdentifier(itinerary)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(itinerary: PartialUpdateItinerary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itinerary);
    return this.http
      .patch<RestItinerary>(`${this.resourceUrl}/${this.getItineraryIdentifier(itinerary)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestItinerary>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestItinerary[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItineraryIdentifier(itinerary: Pick<IItinerary, 'id'>): number {
    return itinerary.id;
  }

  compareItinerary(o1: Pick<IItinerary, 'id'> | null, o2: Pick<IItinerary, 'id'> | null): boolean {
    return o1 && o2 ? this.getItineraryIdentifier(o1) === this.getItineraryIdentifier(o2) : o1 === o2;
  }

  addItineraryToCollectionIfMissing<Type extends Pick<IItinerary, 'id'>>(
    itineraryCollection: Type[],
    ...itinerariesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itineraries: Type[] = itinerariesToCheck.filter(isPresent);
    if (itineraries.length > 0) {
      const itineraryCollectionIdentifiers = itineraryCollection.map(itineraryItem => this.getItineraryIdentifier(itineraryItem)!);
      const itinerariesToAdd = itineraries.filter(itineraryItem => {
        const itineraryIdentifier = this.getItineraryIdentifier(itineraryItem);
        if (itineraryCollectionIdentifiers.includes(itineraryIdentifier)) {
          return false;
        }
        itineraryCollectionIdentifiers.push(itineraryIdentifier);
        return true;
      });
      return [...itinerariesToAdd, ...itineraryCollection];
    }
    return itineraryCollection;
  }

  protected convertDateFromClient<T extends IItinerary | NewItinerary | PartialUpdateItinerary>(itinerary: T): RestOf<T> {
    return {
      ...itinerary,
      startTime: itinerary.startTime?.toJSON() ?? null,
      endTime: itinerary.endTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restItinerary: RestItinerary): IItinerary {
    return {
      ...restItinerary,
      startTime: restItinerary.startTime ? dayjs(restItinerary.startTime) : undefined,
      endTime: restItinerary.endTime ? dayjs(restItinerary.endTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestItinerary>): HttpResponse<IItinerary> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestItinerary[]>): HttpResponse<IItinerary[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
