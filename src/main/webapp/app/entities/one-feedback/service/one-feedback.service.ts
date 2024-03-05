import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOneFeedback, NewOneFeedback } from '../one-feedback.model';

export type PartialUpdateOneFeedback = Partial<IOneFeedback> & Pick<IOneFeedback, 'id'>;

export type EntityResponseType = HttpResponse<IOneFeedback>;
export type EntityArrayResponseType = HttpResponse<IOneFeedback[]>;

@Injectable({ providedIn: 'root' })
export class OneFeedbackService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/one-feedbacks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(oneFeedback: NewOneFeedback): Observable<EntityResponseType> {
    return this.http.post<IOneFeedback>(this.resourceUrl, oneFeedback, { observe: 'response' });
  }

  update(oneFeedback: IOneFeedback): Observable<EntityResponseType> {
    return this.http.put<IOneFeedback>(`${this.resourceUrl}/${this.getOneFeedbackIdentifier(oneFeedback)}`, oneFeedback, {
      observe: 'response',
    });
  }

  partialUpdate(oneFeedback: PartialUpdateOneFeedback): Observable<EntityResponseType> {
    return this.http.patch<IOneFeedback>(`${this.resourceUrl}/${this.getOneFeedbackIdentifier(oneFeedback)}`, oneFeedback, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOneFeedback>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOneFeedback[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOneFeedbackIdentifier(oneFeedback: Pick<IOneFeedback, 'id'>): number {
    return oneFeedback.id;
  }

  compareOneFeedback(o1: Pick<IOneFeedback, 'id'> | null, o2: Pick<IOneFeedback, 'id'> | null): boolean {
    return o1 && o2 ? this.getOneFeedbackIdentifier(o1) === this.getOneFeedbackIdentifier(o2) : o1 === o2;
  }

  addOneFeedbackToCollectionIfMissing<Type extends Pick<IOneFeedback, 'id'>>(
    oneFeedbackCollection: Type[],
    ...oneFeedbacksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const oneFeedbacks: Type[] = oneFeedbacksToCheck.filter(isPresent);
    if (oneFeedbacks.length > 0) {
      const oneFeedbackCollectionIdentifiers = oneFeedbackCollection.map(
        oneFeedbackItem => this.getOneFeedbackIdentifier(oneFeedbackItem)!
      );
      const oneFeedbacksToAdd = oneFeedbacks.filter(oneFeedbackItem => {
        const oneFeedbackIdentifier = this.getOneFeedbackIdentifier(oneFeedbackItem);
        if (oneFeedbackCollectionIdentifiers.includes(oneFeedbackIdentifier)) {
          return false;
        }
        oneFeedbackCollectionIdentifiers.push(oneFeedbackIdentifier);
        return true;
      });
      return [...oneFeedbacksToAdd, ...oneFeedbackCollection];
    }
    return oneFeedbackCollection;
  }
}
