import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItineraryGuest, NewItineraryGuest } from '../itinerary-guest.model';

export type PartialUpdateItineraryGuest = Partial<IItineraryGuest> & Pick<IItineraryGuest, 'id'>;

export type EntityResponseType = HttpResponse<IItineraryGuest>;
export type EntityArrayResponseType = HttpResponse<IItineraryGuest[]>;

@Injectable({ providedIn: 'root' })
export class ItineraryGuestService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/itinerary-guests');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itineraryGuest: NewItineraryGuest): Observable<EntityResponseType> {
    return this.http.post<IItineraryGuest>(this.resourceUrl, itineraryGuest, { observe: 'response' });
  }

  update(itineraryGuest: IItineraryGuest): Observable<EntityResponseType> {
    return this.http.put<IItineraryGuest>(`${this.resourceUrl}/${this.getItineraryGuestIdentifier(itineraryGuest)}`, itineraryGuest, {
      observe: 'response',
    });
  }

  partialUpdate(itineraryGuest: PartialUpdateItineraryGuest): Observable<EntityResponseType> {
    return this.http.patch<IItineraryGuest>(`${this.resourceUrl}/${this.getItineraryGuestIdentifier(itineraryGuest)}`, itineraryGuest, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItineraryGuest>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItineraryGuest[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItineraryGuestIdentifier(itineraryGuest: Pick<IItineraryGuest, 'id'>): number {
    return itineraryGuest.id;
  }

  compareItineraryGuest(o1: Pick<IItineraryGuest, 'id'> | null, o2: Pick<IItineraryGuest, 'id'> | null): boolean {
    return o1 && o2 ? this.getItineraryGuestIdentifier(o1) === this.getItineraryGuestIdentifier(o2) : o1 === o2;
  }

  addItineraryGuestToCollectionIfMissing<Type extends Pick<IItineraryGuest, 'id'>>(
    itineraryGuestCollection: Type[],
    ...itineraryGuestsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itineraryGuests: Type[] = itineraryGuestsToCheck.filter(isPresent);
    if (itineraryGuests.length > 0) {
      const itineraryGuestCollectionIdentifiers = itineraryGuestCollection.map(
        itineraryGuestItem => this.getItineraryGuestIdentifier(itineraryGuestItem)!
      );
      const itineraryGuestsToAdd = itineraryGuests.filter(itineraryGuestItem => {
        const itineraryGuestIdentifier = this.getItineraryGuestIdentifier(itineraryGuestItem);
        if (itineraryGuestCollectionIdentifiers.includes(itineraryGuestIdentifier)) {
          return false;
        }
        itineraryGuestCollectionIdentifiers.push(itineraryGuestIdentifier);
        return true;
      });
      return [...itineraryGuestsToAdd, ...itineraryGuestCollection];
    }
    return itineraryGuestCollection;
  }
}
