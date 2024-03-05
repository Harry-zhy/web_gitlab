import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActivityCompany, NewActivityCompany } from '../activity-company.model';

export type PartialUpdateActivityCompany = Partial<IActivityCompany> & Pick<IActivityCompany, 'id'>;

export type EntityResponseType = HttpResponse<IActivityCompany>;
export type EntityArrayResponseType = HttpResponse<IActivityCompany[]>;

@Injectable({ providedIn: 'root' })
export class ActivityCompanyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/activity-companies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(activityCompany: NewActivityCompany): Observable<EntityResponseType> {
    return this.http.post<IActivityCompany>(this.resourceUrl, activityCompany, { observe: 'response' });
  }

  update(activityCompany: IActivityCompany): Observable<EntityResponseType> {
    return this.http.put<IActivityCompany>(`${this.resourceUrl}/${this.getActivityCompanyIdentifier(activityCompany)}`, activityCompany, {
      observe: 'response',
    });
  }

  partialUpdate(activityCompany: PartialUpdateActivityCompany): Observable<EntityResponseType> {
    return this.http.patch<IActivityCompany>(`${this.resourceUrl}/${this.getActivityCompanyIdentifier(activityCompany)}`, activityCompany, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActivityCompany>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActivityCompany[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActivityCompanyIdentifier(activityCompany: Pick<IActivityCompany, 'id'>): number {
    return activityCompany.id;
  }

  compareActivityCompany(o1: Pick<IActivityCompany, 'id'> | null, o2: Pick<IActivityCompany, 'id'> | null): boolean {
    return o1 && o2 ? this.getActivityCompanyIdentifier(o1) === this.getActivityCompanyIdentifier(o2) : o1 === o2;
  }

  addActivityCompanyToCollectionIfMissing<Type extends Pick<IActivityCompany, 'id'>>(
    activityCompanyCollection: Type[],
    ...activityCompaniesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const activityCompanies: Type[] = activityCompaniesToCheck.filter(isPresent);
    if (activityCompanies.length > 0) {
      const activityCompanyCollectionIdentifiers = activityCompanyCollection.map(
        activityCompanyItem => this.getActivityCompanyIdentifier(activityCompanyItem)!
      );
      const activityCompaniesToAdd = activityCompanies.filter(activityCompanyItem => {
        const activityCompanyIdentifier = this.getActivityCompanyIdentifier(activityCompanyItem);
        if (activityCompanyCollectionIdentifiers.includes(activityCompanyIdentifier)) {
          return false;
        }
        activityCompanyCollectionIdentifiers.push(activityCompanyIdentifier);
        return true;
      });
      return [...activityCompaniesToAdd, ...activityCompanyCollection];
    }
    return activityCompanyCollection;
  }
}
