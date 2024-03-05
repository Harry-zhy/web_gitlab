import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActivitySelf, NewActivitySelf } from '../activity-self.model';

export type PartialUpdateActivitySelf = Partial<IActivitySelf> & Pick<IActivitySelf, 'id'>;

export type EntityResponseType = HttpResponse<IActivitySelf>;
export type EntityArrayResponseType = HttpResponse<IActivitySelf[]>;

@Injectable({ providedIn: 'root' })
export class ActivitySelfService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/activity-selves');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(activitySelf: NewActivitySelf): Observable<EntityResponseType> {
    return this.http.post<IActivitySelf>(this.resourceUrl, activitySelf, { observe: 'response' });
  }

  update(activitySelf: IActivitySelf): Observable<EntityResponseType> {
    return this.http.put<IActivitySelf>(`${this.resourceUrl}/${this.getActivitySelfIdentifier(activitySelf)}`, activitySelf, {
      observe: 'response',
    });
  }

  partialUpdate(activitySelf: PartialUpdateActivitySelf): Observable<EntityResponseType> {
    return this.http.patch<IActivitySelf>(`${this.resourceUrl}/${this.getActivitySelfIdentifier(activitySelf)}`, activitySelf, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActivitySelf>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActivitySelf[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActivitySelfIdentifier(activitySelf: Pick<IActivitySelf, 'id'>): number {
    return activitySelf.id;
  }

  compareActivitySelf(o1: Pick<IActivitySelf, 'id'> | null, o2: Pick<IActivitySelf, 'id'> | null): boolean {
    return o1 && o2 ? this.getActivitySelfIdentifier(o1) === this.getActivitySelfIdentifier(o2) : o1 === o2;
  }

  addActivitySelfToCollectionIfMissing<Type extends Pick<IActivitySelf, 'id'>>(
    activitySelfCollection: Type[],
    ...activitySelvesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const activitySelves: Type[] = activitySelvesToCheck.filter(isPresent);
    if (activitySelves.length > 0) {
      const activitySelfCollectionIdentifiers = activitySelfCollection.map(
        activitySelfItem => this.getActivitySelfIdentifier(activitySelfItem)!
      );
      const activitySelvesToAdd = activitySelves.filter(activitySelfItem => {
        const activitySelfIdentifier = this.getActivitySelfIdentifier(activitySelfItem);
        if (activitySelfCollectionIdentifiers.includes(activitySelfIdentifier)) {
          return false;
        }
        activitySelfCollectionIdentifiers.push(activitySelfIdentifier);
        return true;
      });
      return [...activitySelvesToAdd, ...activitySelfCollection];
    }
    return activitySelfCollection;
  }
}
