import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActivitySaved, NewActivitySaved } from '../activity-saved.model';

export type PartialUpdateActivitySaved = Partial<IActivitySaved> & Pick<IActivitySaved, 'id'>;

type RestOf<T extends IActivitySaved | NewActivitySaved> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestActivitySaved = RestOf<IActivitySaved>;

export type NewRestActivitySaved = RestOf<NewActivitySaved>;

export type PartialUpdateRestActivitySaved = RestOf<PartialUpdateActivitySaved>;

export type EntityResponseType = HttpResponse<IActivitySaved>;
export type EntityArrayResponseType = HttpResponse<IActivitySaved[]>;

@Injectable({ providedIn: 'root' })
export class ActivitySavedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/activity-saveds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(activitySaved: NewActivitySaved): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(activitySaved);
    return this.http
      .post<RestActivitySaved>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(activitySaved: IActivitySaved): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(activitySaved);
    return this.http
      .put<RestActivitySaved>(`${this.resourceUrl}/${this.getActivitySavedIdentifier(activitySaved)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(activitySaved: PartialUpdateActivitySaved): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(activitySaved);
    return this.http
      .patch<RestActivitySaved>(`${this.resourceUrl}/${this.getActivitySavedIdentifier(activitySaved)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestActivitySaved>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestActivitySaved[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActivitySavedIdentifier(activitySaved: Pick<IActivitySaved, 'id'>): number {
    return activitySaved.id;
  }

  compareActivitySaved(o1: Pick<IActivitySaved, 'id'> | null, o2: Pick<IActivitySaved, 'id'> | null): boolean {
    return o1 && o2 ? this.getActivitySavedIdentifier(o1) === this.getActivitySavedIdentifier(o2) : o1 === o2;
  }

  addActivitySavedToCollectionIfMissing<Type extends Pick<IActivitySaved, 'id'>>(
    activitySavedCollection: Type[],
    ...activitySavedsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const activitySaveds: Type[] = activitySavedsToCheck.filter(isPresent);
    if (activitySaveds.length > 0) {
      const activitySavedCollectionIdentifiers = activitySavedCollection.map(
        activitySavedItem => this.getActivitySavedIdentifier(activitySavedItem)!
      );
      const activitySavedsToAdd = activitySaveds.filter(activitySavedItem => {
        const activitySavedIdentifier = this.getActivitySavedIdentifier(activitySavedItem);
        if (activitySavedCollectionIdentifiers.includes(activitySavedIdentifier)) {
          return false;
        }
        activitySavedCollectionIdentifiers.push(activitySavedIdentifier);
        return true;
      });
      return [...activitySavedsToAdd, ...activitySavedCollection];
    }
    return activitySavedCollection;
  }

  protected convertDateFromClient<T extends IActivitySaved | NewActivitySaved | PartialUpdateActivitySaved>(activitySaved: T): RestOf<T> {
    return {
      ...activitySaved,
      date: activitySaved.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restActivitySaved: RestActivitySaved): IActivitySaved {
    return {
      ...restActivitySaved,
      date: restActivitySaved.date ? dayjs(restActivitySaved.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestActivitySaved>): HttpResponse<IActivitySaved> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestActivitySaved[]>): HttpResponse<IActivitySaved[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
