import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVenueInformation, NewVenueInformation } from '../venue-information.model';

export type PartialUpdateVenueInformation = Partial<IVenueInformation> & Pick<IVenueInformation, 'id'>;

type RestOf<T extends IVenueInformation | NewVenueInformation> = Omit<T, 'openingTimeFrom' | 'openingTimeUntil'> & {
  openingTimeFrom?: string | null;
  openingTimeUntil?: string | null;
};

export type RestVenueInformation = RestOf<IVenueInformation>;

export type NewRestVenueInformation = RestOf<NewVenueInformation>;

export type PartialUpdateRestVenueInformation = RestOf<PartialUpdateVenueInformation>;

export type EntityResponseType = HttpResponse<IVenueInformation>;
export type EntityArrayResponseType = HttpResponse<IVenueInformation[]>;

@Injectable({ providedIn: 'root' })
export class VenueInformationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/venue-informations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(venueInformation: NewVenueInformation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(venueInformation);
    return this.http
      .post<RestVenueInformation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(venueInformation: IVenueInformation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(venueInformation);
    return this.http
      .put<RestVenueInformation>(`${this.resourceUrl}/${this.getVenueInformationIdentifier(venueInformation)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(venueInformation: PartialUpdateVenueInformation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(venueInformation);
    return this.http
      .patch<RestVenueInformation>(`${this.resourceUrl}/${this.getVenueInformationIdentifier(venueInformation)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVenueInformation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVenueInformation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVenueInformationIdentifier(venueInformation: Pick<IVenueInformation, 'id'>): number {
    return venueInformation.id;
  }

  compareVenueInformation(o1: Pick<IVenueInformation, 'id'> | null, o2: Pick<IVenueInformation, 'id'> | null): boolean {
    return o1 && o2 ? this.getVenueInformationIdentifier(o1) === this.getVenueInformationIdentifier(o2) : o1 === o2;
  }

  addVenueInformationToCollectionIfMissing<Type extends Pick<IVenueInformation, 'id'>>(
    venueInformationCollection: Type[],
    ...venueInformationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const venueInformations: Type[] = venueInformationsToCheck.filter(isPresent);
    if (venueInformations.length > 0) {
      const venueInformationCollectionIdentifiers = venueInformationCollection.map(
        venueInformationItem => this.getVenueInformationIdentifier(venueInformationItem)!
      );
      const venueInformationsToAdd = venueInformations.filter(venueInformationItem => {
        const venueInformationIdentifier = this.getVenueInformationIdentifier(venueInformationItem);
        if (venueInformationCollectionIdentifiers.includes(venueInformationIdentifier)) {
          return false;
        }
        venueInformationCollectionIdentifiers.push(venueInformationIdentifier);
        return true;
      });
      return [...venueInformationsToAdd, ...venueInformationCollection];
    }
    return venueInformationCollection;
  }

  protected convertDateFromClient<T extends IVenueInformation | NewVenueInformation | PartialUpdateVenueInformation>(
    venueInformation: T
  ): RestOf<T> {
    return {
      ...venueInformation,
      openingTimeFrom: venueInformation.openingTimeFrom?.toJSON() ?? null,
      openingTimeUntil: venueInformation.openingTimeUntil?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVenueInformation: RestVenueInformation): IVenueInformation {
    return {
      ...restVenueInformation,
      openingTimeFrom: restVenueInformation.openingTimeFrom ? dayjs(restVenueInformation.openingTimeFrom) : undefined,
      openingTimeUntil: restVenueInformation.openingTimeUntil ? dayjs(restVenueInformation.openingTimeUntil) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVenueInformation>): HttpResponse<IVenueInformation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVenueInformation[]>): HttpResponse<IVenueInformation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
