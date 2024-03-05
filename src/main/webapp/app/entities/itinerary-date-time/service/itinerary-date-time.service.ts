import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItineraryDateTime, NewItineraryDateTime } from '../itinerary-date-time.model';

export type PartialUpdateItineraryDateTime = Partial<IItineraryDateTime> & Pick<IItineraryDateTime, 'id'>;

type RestOf<T extends IItineraryDateTime | NewItineraryDateTime> = Omit<T, 'date' | 'startTime' | 'endTime'> & {
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

export type RestItineraryDateTime = RestOf<IItineraryDateTime>;

export type NewRestItineraryDateTime = RestOf<NewItineraryDateTime>;

export type PartialUpdateRestItineraryDateTime = RestOf<PartialUpdateItineraryDateTime>;

export type EntityResponseType = HttpResponse<IItineraryDateTime>;
export type EntityArrayResponseType = HttpResponse<IItineraryDateTime[]>;

@Injectable({ providedIn: 'root' })
export class ItineraryDateTimeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/itinerary-date-times');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itineraryDateTime: NewItineraryDateTime): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itineraryDateTime);
    return this.http
      .post<RestItineraryDateTime>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(itineraryDateTime: IItineraryDateTime): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itineraryDateTime);
    return this.http
      .put<RestItineraryDateTime>(`${this.resourceUrl}/${this.getItineraryDateTimeIdentifier(itineraryDateTime)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(itineraryDateTime: PartialUpdateItineraryDateTime): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itineraryDateTime);
    return this.http
      .patch<RestItineraryDateTime>(`${this.resourceUrl}/${this.getItineraryDateTimeIdentifier(itineraryDateTime)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestItineraryDateTime>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestItineraryDateTime[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItineraryDateTimeIdentifier(itineraryDateTime: Pick<IItineraryDateTime, 'id'>): number {
    return itineraryDateTime.id;
  }

  compareItineraryDateTime(o1: Pick<IItineraryDateTime, 'id'> | null, o2: Pick<IItineraryDateTime, 'id'> | null): boolean {
    return o1 && o2 ? this.getItineraryDateTimeIdentifier(o1) === this.getItineraryDateTimeIdentifier(o2) : o1 === o2;
  }

  addItineraryDateTimeToCollectionIfMissing<Type extends Pick<IItineraryDateTime, 'id'>>(
    itineraryDateTimeCollection: Type[],
    ...itineraryDateTimesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itineraryDateTimes: Type[] = itineraryDateTimesToCheck.filter(isPresent);
    if (itineraryDateTimes.length > 0) {
      const itineraryDateTimeCollectionIdentifiers = itineraryDateTimeCollection.map(
        itineraryDateTimeItem => this.getItineraryDateTimeIdentifier(itineraryDateTimeItem)!
      );
      const itineraryDateTimesToAdd = itineraryDateTimes.filter(itineraryDateTimeItem => {
        const itineraryDateTimeIdentifier = this.getItineraryDateTimeIdentifier(itineraryDateTimeItem);
        if (itineraryDateTimeCollectionIdentifiers.includes(itineraryDateTimeIdentifier)) {
          return false;
        }
        itineraryDateTimeCollectionIdentifiers.push(itineraryDateTimeIdentifier);
        return true;
      });
      return [...itineraryDateTimesToAdd, ...itineraryDateTimeCollection];
    }
    return itineraryDateTimeCollection;
  }

  protected convertDateFromClient<T extends IItineraryDateTime | NewItineraryDateTime | PartialUpdateItineraryDateTime>(
    itineraryDateTime: T
  ): RestOf<T> {
    return {
      ...itineraryDateTime,
      date: itineraryDateTime.date?.toJSON() ?? null,
      startTime: itineraryDateTime.startTime?.toJSON() ?? null,
      endTime: itineraryDateTime.endTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restItineraryDateTime: RestItineraryDateTime): IItineraryDateTime {
    return {
      ...restItineraryDateTime,
      date: restItineraryDateTime.date ? dayjs(restItineraryDateTime.date) : undefined,
      startTime: restItineraryDateTime.startTime ? dayjs(restItineraryDateTime.startTime) : undefined,
      endTime: restItineraryDateTime.endTime ? dayjs(restItineraryDateTime.endTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestItineraryDateTime>): HttpResponse<IItineraryDateTime> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestItineraryDateTime[]>): HttpResponse<IItineraryDateTime[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
