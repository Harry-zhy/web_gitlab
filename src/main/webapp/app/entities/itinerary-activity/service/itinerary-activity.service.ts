import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItineraryActivity, NewItineraryActivity } from '../itinerary-activity.model';

export type PartialUpdateItineraryActivity = Partial<IItineraryActivity> & Pick<IItineraryActivity, 'id'>;

type RestOf<T extends IItineraryActivity | NewItineraryActivity> = Omit<T, 'activityTime'> & {
  activityTime?: string | null;
};

export type RestItineraryActivity = RestOf<IItineraryActivity>;

export type NewRestItineraryActivity = RestOf<NewItineraryActivity>;

export type PartialUpdateRestItineraryActivity = RestOf<PartialUpdateItineraryActivity>;

export type EntityResponseType = HttpResponse<IItineraryActivity>;
export type EntityArrayResponseType = HttpResponse<IItineraryActivity[]>;

@Injectable({ providedIn: 'root' })
export class ItineraryActivityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/itinerary-activities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itineraryActivity: NewItineraryActivity): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itineraryActivity);
    return this.http
      .post<RestItineraryActivity>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(itineraryActivity: IItineraryActivity): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itineraryActivity);
    return this.http
      .put<RestItineraryActivity>(`${this.resourceUrl}/${this.getItineraryActivityIdentifier(itineraryActivity)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(itineraryActivity: PartialUpdateItineraryActivity): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itineraryActivity);
    return this.http
      .patch<RestItineraryActivity>(`${this.resourceUrl}/${this.getItineraryActivityIdentifier(itineraryActivity)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestItineraryActivity>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestItineraryActivity[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItineraryActivityIdentifier(itineraryActivity: Pick<IItineraryActivity, 'id'>): number {
    return itineraryActivity.id;
  }

  compareItineraryActivity(o1: Pick<IItineraryActivity, 'id'> | null, o2: Pick<IItineraryActivity, 'id'> | null): boolean {
    return o1 && o2 ? this.getItineraryActivityIdentifier(o1) === this.getItineraryActivityIdentifier(o2) : o1 === o2;
  }

  addItineraryActivityToCollectionIfMissing<Type extends Pick<IItineraryActivity, 'id'>>(
    itineraryActivityCollection: Type[],
    ...itineraryActivitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itineraryActivities: Type[] = itineraryActivitiesToCheck.filter(isPresent);
    if (itineraryActivities.length > 0) {
      const itineraryActivityCollectionIdentifiers = itineraryActivityCollection.map(
        itineraryActivityItem => this.getItineraryActivityIdentifier(itineraryActivityItem)!
      );
      const itineraryActivitiesToAdd = itineraryActivities.filter(itineraryActivityItem => {
        const itineraryActivityIdentifier = this.getItineraryActivityIdentifier(itineraryActivityItem);
        if (itineraryActivityCollectionIdentifiers.includes(itineraryActivityIdentifier)) {
          return false;
        }
        itineraryActivityCollectionIdentifiers.push(itineraryActivityIdentifier);
        return true;
      });
      return [...itineraryActivitiesToAdd, ...itineraryActivityCollection];
    }
    return itineraryActivityCollection;
  }

  protected convertDateFromClient<T extends IItineraryActivity | NewItineraryActivity | PartialUpdateItineraryActivity>(
    itineraryActivity: T
  ): RestOf<T> {
    return {
      ...itineraryActivity,
      activityTime: itineraryActivity.activityTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restItineraryActivity: RestItineraryActivity): IItineraryActivity {
    return {
      ...restItineraryActivity,
      activityTime: restItineraryActivity.activityTime ? dayjs(restItineraryActivity.activityTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestItineraryActivity>): HttpResponse<IItineraryActivity> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestItineraryActivity[]>): HttpResponse<IItineraryActivity[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
