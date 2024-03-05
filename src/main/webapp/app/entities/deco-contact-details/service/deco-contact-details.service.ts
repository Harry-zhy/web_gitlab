import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDecoContactDetails, NewDecoContactDetails } from '../deco-contact-details.model';

export type PartialUpdateDecoContactDetails = Partial<IDecoContactDetails> & Pick<IDecoContactDetails, 'id'>;

export type EntityResponseType = HttpResponse<IDecoContactDetails>;
export type EntityArrayResponseType = HttpResponse<IDecoContactDetails[]>;

@Injectable({ providedIn: 'root' })
export class DecoContactDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/deco-contact-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(decoContactDetails: NewDecoContactDetails): Observable<EntityResponseType> {
    return this.http.post<IDecoContactDetails>(this.resourceUrl, decoContactDetails, { observe: 'response' });
  }

  update(decoContactDetails: IDecoContactDetails): Observable<EntityResponseType> {
    return this.http.put<IDecoContactDetails>(
      `${this.resourceUrl}/${this.getDecoContactDetailsIdentifier(decoContactDetails)}`,
      decoContactDetails,
      { observe: 'response' }
    );
  }

  partialUpdate(decoContactDetails: PartialUpdateDecoContactDetails): Observable<EntityResponseType> {
    return this.http.patch<IDecoContactDetails>(
      `${this.resourceUrl}/${this.getDecoContactDetailsIdentifier(decoContactDetails)}`,
      decoContactDetails,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDecoContactDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDecoContactDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDecoContactDetailsIdentifier(decoContactDetails: Pick<IDecoContactDetails, 'id'>): number {
    return decoContactDetails.id;
  }

  compareDecoContactDetails(o1: Pick<IDecoContactDetails, 'id'> | null, o2: Pick<IDecoContactDetails, 'id'> | null): boolean {
    return o1 && o2 ? this.getDecoContactDetailsIdentifier(o1) === this.getDecoContactDetailsIdentifier(o2) : o1 === o2;
  }

  addDecoContactDetailsToCollectionIfMissing<Type extends Pick<IDecoContactDetails, 'id'>>(
    decoContactDetailsCollection: Type[],
    ...decoContactDetailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const decoContactDetails: Type[] = decoContactDetailsToCheck.filter(isPresent);
    if (decoContactDetails.length > 0) {
      const decoContactDetailsCollectionIdentifiers = decoContactDetailsCollection.map(
        decoContactDetailsItem => this.getDecoContactDetailsIdentifier(decoContactDetailsItem)!
      );
      const decoContactDetailsToAdd = decoContactDetails.filter(decoContactDetailsItem => {
        const decoContactDetailsIdentifier = this.getDecoContactDetailsIdentifier(decoContactDetailsItem);
        if (decoContactDetailsCollectionIdentifiers.includes(decoContactDetailsIdentifier)) {
          return false;
        }
        decoContactDetailsCollectionIdentifiers.push(decoContactDetailsIdentifier);
        return true;
      });
      return [...decoContactDetailsToAdd, ...decoContactDetailsCollection];
    }
    return decoContactDetailsCollection;
  }
}
