import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventItinerary, NewEventItinerary } from '../event-itinerary.model';

export type PartialUpdateEventItinerary = Partial<IEventItinerary> & Pick<IEventItinerary, 'id'>;

export type EntityResponseType = HttpResponse<IEventItinerary>;
export type EntityArrayResponseType = HttpResponse<IEventItinerary[]>;

@Injectable({ providedIn: 'root' })
export class EventItineraryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-itineraries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventItinerary: NewEventItinerary): Observable<EntityResponseType> {
    return this.http.post<IEventItinerary>(this.resourceUrl, eventItinerary, { observe: 'response' });
  }

  update(eventItinerary: IEventItinerary): Observable<EntityResponseType> {
    return this.http.put<IEventItinerary>(`${this.resourceUrl}/${this.getEventItineraryIdentifier(eventItinerary)}`, eventItinerary, {
      observe: 'response',
    });
  }

  partialUpdate(eventItinerary: PartialUpdateEventItinerary): Observable<EntityResponseType> {
    return this.http.patch<IEventItinerary>(`${this.resourceUrl}/${this.getEventItineraryIdentifier(eventItinerary)}`, eventItinerary, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEventItinerary>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventItinerary[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEventItineraryIdentifier(eventItinerary: Pick<IEventItinerary, 'id'>): number {
    return eventItinerary.id;
  }

  compareEventItinerary(o1: Pick<IEventItinerary, 'id'> | null, o2: Pick<IEventItinerary, 'id'> | null): boolean {
    return o1 && o2 ? this.getEventItineraryIdentifier(o1) === this.getEventItineraryIdentifier(o2) : o1 === o2;
  }

  addEventItineraryToCollectionIfMissing<Type extends Pick<IEventItinerary, 'id'>>(
    eventItineraryCollection: Type[],
    ...eventItinerariesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const eventItineraries: Type[] = eventItinerariesToCheck.filter(isPresent);
    if (eventItineraries.length > 0) {
      const eventItineraryCollectionIdentifiers = eventItineraryCollection.map(
        eventItineraryItem => this.getEventItineraryIdentifier(eventItineraryItem)!
      );
      const eventItinerariesToAdd = eventItineraries.filter(eventItineraryItem => {
        const eventItineraryIdentifier = this.getEventItineraryIdentifier(eventItineraryItem);
        if (eventItineraryCollectionIdentifiers.includes(eventItineraryIdentifier)) {
          return false;
        }
        eventItineraryCollectionIdentifiers.push(eventItineraryIdentifier);
        return true;
      });
      return [...eventItinerariesToAdd, ...eventItineraryCollection];
    }
    return eventItineraryCollection;
  }
}
