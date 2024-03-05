import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActivityIdea, NewActivityIdea } from '../activity-idea.model';

export type PartialUpdateActivityIdea = Partial<IActivityIdea> & Pick<IActivityIdea, 'id'>;

export type EntityResponseType = HttpResponse<IActivityIdea>;
export type EntityArrayResponseType = HttpResponse<IActivityIdea[]>;

@Injectable({ providedIn: 'root' })
export class ActivityIdeaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/activity-ideas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(activityIdea: NewActivityIdea): Observable<EntityResponseType> {
    return this.http.post<IActivityIdea>(this.resourceUrl, activityIdea, { observe: 'response' });
  }

  update(activityIdea: IActivityIdea): Observable<EntityResponseType> {
    return this.http.put<IActivityIdea>(`${this.resourceUrl}/${this.getActivityIdeaIdentifier(activityIdea)}`, activityIdea, {
      observe: 'response',
    });
  }

  partialUpdate(activityIdea: PartialUpdateActivityIdea): Observable<EntityResponseType> {
    return this.http.patch<IActivityIdea>(`${this.resourceUrl}/${this.getActivityIdeaIdentifier(activityIdea)}`, activityIdea, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActivityIdea>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActivityIdea[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActivityIdeaIdentifier(activityIdea: Pick<IActivityIdea, 'id'>): number {
    return activityIdea.id;
  }

  compareActivityIdea(o1: Pick<IActivityIdea, 'id'> | null, o2: Pick<IActivityIdea, 'id'> | null): boolean {
    return o1 && o2 ? this.getActivityIdeaIdentifier(o1) === this.getActivityIdeaIdentifier(o2) : o1 === o2;
  }

  addActivityIdeaToCollectionIfMissing<Type extends Pick<IActivityIdea, 'id'>>(
    activityIdeaCollection: Type[],
    ...activityIdeasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const activityIdeas: Type[] = activityIdeasToCheck.filter(isPresent);
    if (activityIdeas.length > 0) {
      const activityIdeaCollectionIdentifiers = activityIdeaCollection.map(
        activityIdeaItem => this.getActivityIdeaIdentifier(activityIdeaItem)!
      );
      const activityIdeasToAdd = activityIdeas.filter(activityIdeaItem => {
        const activityIdeaIdentifier = this.getActivityIdeaIdentifier(activityIdeaItem);
        if (activityIdeaCollectionIdentifiers.includes(activityIdeaIdentifier)) {
          return false;
        }
        activityIdeaCollectionIdentifiers.push(activityIdeaIdentifier);
        return true;
      });
      return [...activityIdeasToAdd, ...activityIdeaCollection];
    }
    return activityIdeaCollection;
  }
}
