import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActivityContactDetails, NewActivityContactDetails } from '../activity-contact-details.model';

export type PartialUpdateActivityContactDetails = Partial<IActivityContactDetails> & Pick<IActivityContactDetails, 'id'>;

export type EntityResponseType = HttpResponse<IActivityContactDetails>;
export type EntityArrayResponseType = HttpResponse<IActivityContactDetails[]>;

@Injectable({ providedIn: 'root' })
export class ActivityContactDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/activity-contact-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(activityContactDetails: NewActivityContactDetails): Observable<EntityResponseType> {
    return this.http.post<IActivityContactDetails>(this.resourceUrl, activityContactDetails, { observe: 'response' });
  }

  update(activityContactDetails: IActivityContactDetails): Observable<EntityResponseType> {
    return this.http.put<IActivityContactDetails>(
      `${this.resourceUrl}/${this.getActivityContactDetailsIdentifier(activityContactDetails)}`,
      activityContactDetails,
      { observe: 'response' }
    );
  }

  partialUpdate(activityContactDetails: PartialUpdateActivityContactDetails): Observable<EntityResponseType> {
    return this.http.patch<IActivityContactDetails>(
      `${this.resourceUrl}/${this.getActivityContactDetailsIdentifier(activityContactDetails)}`,
      activityContactDetails,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActivityContactDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActivityContactDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActivityContactDetailsIdentifier(activityContactDetails: Pick<IActivityContactDetails, 'id'>): number {
    return activityContactDetails.id;
  }

  compareActivityContactDetails(o1: Pick<IActivityContactDetails, 'id'> | null, o2: Pick<IActivityContactDetails, 'id'> | null): boolean {
    return o1 && o2 ? this.getActivityContactDetailsIdentifier(o1) === this.getActivityContactDetailsIdentifier(o2) : o1 === o2;
  }

  addActivityContactDetailsToCollectionIfMissing<Type extends Pick<IActivityContactDetails, 'id'>>(
    activityContactDetailsCollection: Type[],
    ...activityContactDetailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const activityContactDetails: Type[] = activityContactDetailsToCheck.filter(isPresent);
    if (activityContactDetails.length > 0) {
      const activityContactDetailsCollectionIdentifiers = activityContactDetailsCollection.map(
        activityContactDetailsItem => this.getActivityContactDetailsIdentifier(activityContactDetailsItem)!
      );
      const activityContactDetailsToAdd = activityContactDetails.filter(activityContactDetailsItem => {
        const activityContactDetailsIdentifier = this.getActivityContactDetailsIdentifier(activityContactDetailsItem);
        if (activityContactDetailsCollectionIdentifiers.includes(activityContactDetailsIdentifier)) {
          return false;
        }
        activityContactDetailsCollectionIdentifiers.push(activityContactDetailsIdentifier);
        return true;
      });
      return [...activityContactDetailsToAdd, ...activityContactDetailsCollection];
    }
    return activityContactDetailsCollection;
  }
}
