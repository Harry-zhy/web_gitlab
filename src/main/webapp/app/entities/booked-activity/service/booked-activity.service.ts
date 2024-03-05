import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBookedActivity, NewBookedActivity } from '../booked-activity.model';

export type PartialUpdateBookedActivity = Partial<IBookedActivity> & Pick<IBookedActivity, 'id'>;

export type EntityResponseType = HttpResponse<IBookedActivity>;
export type EntityArrayResponseType = HttpResponse<IBookedActivity[]>;

@Injectable({ providedIn: 'root' })
export class BookedActivityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/booked-activities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bookedActivity: NewBookedActivity): Observable<EntityResponseType> {
    return this.http.post<IBookedActivity>(this.resourceUrl, bookedActivity, { observe: 'response' });
  }

  update(bookedActivity: IBookedActivity): Observable<EntityResponseType> {
    return this.http.put<IBookedActivity>(`${this.resourceUrl}/${this.getBookedActivityIdentifier(bookedActivity)}`, bookedActivity, {
      observe: 'response',
    });
  }

  partialUpdate(bookedActivity: PartialUpdateBookedActivity): Observable<EntityResponseType> {
    return this.http.patch<IBookedActivity>(`${this.resourceUrl}/${this.getBookedActivityIdentifier(bookedActivity)}`, bookedActivity, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBookedActivity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBookedActivity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBookedActivityIdentifier(bookedActivity: Pick<IBookedActivity, 'id'>): number {
    return bookedActivity.id;
  }

  compareBookedActivity(o1: Pick<IBookedActivity, 'id'> | null, o2: Pick<IBookedActivity, 'id'> | null): boolean {
    return o1 && o2 ? this.getBookedActivityIdentifier(o1) === this.getBookedActivityIdentifier(o2) : o1 === o2;
  }

  addBookedActivityToCollectionIfMissing<Type extends Pick<IBookedActivity, 'id'>>(
    bookedActivityCollection: Type[],
    ...bookedActivitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bookedActivities: Type[] = bookedActivitiesToCheck.filter(isPresent);
    if (bookedActivities.length > 0) {
      const bookedActivityCollectionIdentifiers = bookedActivityCollection.map(
        bookedActivityItem => this.getBookedActivityIdentifier(bookedActivityItem)!
      );
      const bookedActivitiesToAdd = bookedActivities.filter(bookedActivityItem => {
        const bookedActivityIdentifier = this.getBookedActivityIdentifier(bookedActivityItem);
        if (bookedActivityCollectionIdentifiers.includes(bookedActivityIdentifier)) {
          return false;
        }
        bookedActivityCollectionIdentifiers.push(bookedActivityIdentifier);
        return true;
      });
      return [...bookedActivitiesToAdd, ...bookedActivityCollection];
    }
    return bookedActivityCollection;
  }
}
