import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItineraryVenue, NewItineraryVenue } from '../itinerary-venue.model';

export type PartialUpdateItineraryVenue = Partial<IItineraryVenue> & Pick<IItineraryVenue, 'id'>;

export type EntityResponseType = HttpResponse<IItineraryVenue>;
export type EntityArrayResponseType = HttpResponse<IItineraryVenue[]>;

@Injectable({ providedIn: 'root' })
export class ItineraryVenueService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/itinerary-venues');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itineraryVenue: NewItineraryVenue): Observable<EntityResponseType> {
    return this.http.post<IItineraryVenue>(this.resourceUrl, itineraryVenue, { observe: 'response' });
  }

  update(itineraryVenue: IItineraryVenue): Observable<EntityResponseType> {
    return this.http.put<IItineraryVenue>(`${this.resourceUrl}/${this.getItineraryVenueIdentifier(itineraryVenue)}`, itineraryVenue, {
      observe: 'response',
    });
  }

  partialUpdate(itineraryVenue: PartialUpdateItineraryVenue): Observable<EntityResponseType> {
    return this.http.patch<IItineraryVenue>(`${this.resourceUrl}/${this.getItineraryVenueIdentifier(itineraryVenue)}`, itineraryVenue, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItineraryVenue>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItineraryVenue[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItineraryVenueIdentifier(itineraryVenue: Pick<IItineraryVenue, 'id'>): number {
    return itineraryVenue.id;
  }

  compareItineraryVenue(o1: Pick<IItineraryVenue, 'id'> | null, o2: Pick<IItineraryVenue, 'id'> | null): boolean {
    return o1 && o2 ? this.getItineraryVenueIdentifier(o1) === this.getItineraryVenueIdentifier(o2) : o1 === o2;
  }

  addItineraryVenueToCollectionIfMissing<Type extends Pick<IItineraryVenue, 'id'>>(
    itineraryVenueCollection: Type[],
    ...itineraryVenuesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itineraryVenues: Type[] = itineraryVenuesToCheck.filter(isPresent);
    if (itineraryVenues.length > 0) {
      const itineraryVenueCollectionIdentifiers = itineraryVenueCollection.map(
        itineraryVenueItem => this.getItineraryVenueIdentifier(itineraryVenueItem)!
      );
      const itineraryVenuesToAdd = itineraryVenues.filter(itineraryVenueItem => {
        const itineraryVenueIdentifier = this.getItineraryVenueIdentifier(itineraryVenueItem);
        if (itineraryVenueCollectionIdentifiers.includes(itineraryVenueIdentifier)) {
          return false;
        }
        itineraryVenueCollectionIdentifiers.push(itineraryVenueIdentifier);
        return true;
      });
      return [...itineraryVenuesToAdd, ...itineraryVenueCollection];
    }
    return itineraryVenueCollection;
  }
}
