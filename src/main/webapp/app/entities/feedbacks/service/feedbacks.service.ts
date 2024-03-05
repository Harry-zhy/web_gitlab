import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFeedbacks, NewFeedbacks } from '../feedbacks.model';

export type PartialUpdateFeedbacks = Partial<IFeedbacks> & Pick<IFeedbacks, 'id'>;

type RestOf<T extends IFeedbacks | NewFeedbacks> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestFeedbacks = RestOf<IFeedbacks>;

export type NewRestFeedbacks = RestOf<NewFeedbacks>;

export type PartialUpdateRestFeedbacks = RestOf<PartialUpdateFeedbacks>;

export type EntityResponseType = HttpResponse<IFeedbacks>;
export type EntityArrayResponseType = HttpResponse<IFeedbacks[]>;

@Injectable({ providedIn: 'root' })
export class FeedbacksService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/feedbacks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(feedbacks: NewFeedbacks): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feedbacks);
    return this.http
      .post<RestFeedbacks>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(feedbacks: IFeedbacks): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feedbacks);
    return this.http
      .put<RestFeedbacks>(`${this.resourceUrl}/${this.getFeedbacksIdentifier(feedbacks)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(feedbacks: PartialUpdateFeedbacks): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feedbacks);
    return this.http
      .patch<RestFeedbacks>(`${this.resourceUrl}/${this.getFeedbacksIdentifier(feedbacks)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFeedbacks>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFeedbacks[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFeedbacksIdentifier(feedbacks: Pick<IFeedbacks, 'id'>): number {
    return feedbacks.id;
  }

  compareFeedbacks(o1: Pick<IFeedbacks, 'id'> | null, o2: Pick<IFeedbacks, 'id'> | null): boolean {
    return o1 && o2 ? this.getFeedbacksIdentifier(o1) === this.getFeedbacksIdentifier(o2) : o1 === o2;
  }

  addFeedbacksToCollectionIfMissing<Type extends Pick<IFeedbacks, 'id'>>(
    feedbacksCollection: Type[],
    ...feedbacksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const feedbacks: Type[] = feedbacksToCheck.filter(isPresent);
    if (feedbacks.length > 0) {
      const feedbacksCollectionIdentifiers = feedbacksCollection.map(feedbacksItem => this.getFeedbacksIdentifier(feedbacksItem)!);
      const feedbacksToAdd = feedbacks.filter(feedbacksItem => {
        const feedbacksIdentifier = this.getFeedbacksIdentifier(feedbacksItem);
        if (feedbacksCollectionIdentifiers.includes(feedbacksIdentifier)) {
          return false;
        }
        feedbacksCollectionIdentifiers.push(feedbacksIdentifier);
        return true;
      });
      return [...feedbacksToAdd, ...feedbacksCollection];
    }
    return feedbacksCollection;
  }

  protected convertDateFromClient<T extends IFeedbacks | NewFeedbacks | PartialUpdateFeedbacks>(feedbacks: T): RestOf<T> {
    return {
      ...feedbacks,
      date: feedbacks.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFeedbacks: RestFeedbacks): IFeedbacks {
    return {
      ...restFeedbacks,
      date: restFeedbacks.date ? dayjs(restFeedbacks.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFeedbacks>): HttpResponse<IFeedbacks> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFeedbacks[]>): HttpResponse<IFeedbacks[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
