import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdsManagement, NewAdsManagement } from '../ads-management.model';

export type PartialUpdateAdsManagement = Partial<IAdsManagement> & Pick<IAdsManagement, 'id'>;

export type EntityResponseType = HttpResponse<IAdsManagement>;
export type EntityArrayResponseType = HttpResponse<IAdsManagement[]>;

@Injectable({ providedIn: 'root' })
export class AdsManagementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ads-managements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(adsManagement: NewAdsManagement): Observable<EntityResponseType> {
    return this.http.post<IAdsManagement>(this.resourceUrl, adsManagement, { observe: 'response' });
  }

  update(adsManagement: IAdsManagement): Observable<EntityResponseType> {
    return this.http.put<IAdsManagement>(`${this.resourceUrl}/${this.getAdsManagementIdentifier(adsManagement)}`, adsManagement, {
      observe: 'response',
    });
  }

  partialUpdate(adsManagement: PartialUpdateAdsManagement): Observable<EntityResponseType> {
    return this.http.patch<IAdsManagement>(`${this.resourceUrl}/${this.getAdsManagementIdentifier(adsManagement)}`, adsManagement, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdsManagement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdsManagement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAdsManagementIdentifier(adsManagement: Pick<IAdsManagement, 'id'>): number {
    return adsManagement.id;
  }

  compareAdsManagement(o1: Pick<IAdsManagement, 'id'> | null, o2: Pick<IAdsManagement, 'id'> | null): boolean {
    return o1 && o2 ? this.getAdsManagementIdentifier(o1) === this.getAdsManagementIdentifier(o2) : o1 === o2;
  }

  addAdsManagementToCollectionIfMissing<Type extends Pick<IAdsManagement, 'id'>>(
    adsManagementCollection: Type[],
    ...adsManagementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const adsManagements: Type[] = adsManagementsToCheck.filter(isPresent);
    if (adsManagements.length > 0) {
      const adsManagementCollectionIdentifiers = adsManagementCollection.map(
        adsManagementItem => this.getAdsManagementIdentifier(adsManagementItem)!
      );
      const adsManagementsToAdd = adsManagements.filter(adsManagementItem => {
        const adsManagementIdentifier = this.getAdsManagementIdentifier(adsManagementItem);
        if (adsManagementCollectionIdentifiers.includes(adsManagementIdentifier)) {
          return false;
        }
        adsManagementCollectionIdentifiers.push(adsManagementIdentifier);
        return true;
      });
      return [...adsManagementsToAdd, ...adsManagementCollection];
    }
    return adsManagementCollection;
  }
}
