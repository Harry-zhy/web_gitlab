import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQuestionnaire, NewQuestionnaire } from '../questionnaire.model';

export type PartialUpdateQuestionnaire = Partial<IQuestionnaire> & Pick<IQuestionnaire, 'id'>;

type RestOf<T extends IQuestionnaire | NewQuestionnaire> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestQuestionnaire = RestOf<IQuestionnaire>;

export type NewRestQuestionnaire = RestOf<NewQuestionnaire>;

export type PartialUpdateRestQuestionnaire = RestOf<PartialUpdateQuestionnaire>;

export type EntityResponseType = HttpResponse<IQuestionnaire>;
export type EntityArrayResponseType = HttpResponse<IQuestionnaire[]>;

@Injectable({ providedIn: 'root' })
export class QuestionnaireService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/questionnaires');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(questionnaire: NewQuestionnaire): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(questionnaire);
    return this.http
      .post<RestQuestionnaire>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(questionnaire: IQuestionnaire): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(questionnaire);
    return this.http
      .put<RestQuestionnaire>(`${this.resourceUrl}/${this.getQuestionnaireIdentifier(questionnaire)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(questionnaire: PartialUpdateQuestionnaire): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(questionnaire);
    return this.http
      .patch<RestQuestionnaire>(`${this.resourceUrl}/${this.getQuestionnaireIdentifier(questionnaire)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestQuestionnaire>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestQuestionnaire[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getQuestionnaireIdentifier(questionnaire: Pick<IQuestionnaire, 'id'>): number {
    return questionnaire.id;
  }

  compareQuestionnaire(o1: Pick<IQuestionnaire, 'id'> | null, o2: Pick<IQuestionnaire, 'id'> | null): boolean {
    return o1 && o2 ? this.getQuestionnaireIdentifier(o1) === this.getQuestionnaireIdentifier(o2) : o1 === o2;
  }

  addQuestionnaireToCollectionIfMissing<Type extends Pick<IQuestionnaire, 'id'>>(
    questionnaireCollection: Type[],
    ...questionnairesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const questionnaires: Type[] = questionnairesToCheck.filter(isPresent);
    if (questionnaires.length > 0) {
      const questionnaireCollectionIdentifiers = questionnaireCollection.map(
        questionnaireItem => this.getQuestionnaireIdentifier(questionnaireItem)!
      );
      const questionnairesToAdd = questionnaires.filter(questionnaireItem => {
        const questionnaireIdentifier = this.getQuestionnaireIdentifier(questionnaireItem);
        if (questionnaireCollectionIdentifiers.includes(questionnaireIdentifier)) {
          return false;
        }
        questionnaireCollectionIdentifiers.push(questionnaireIdentifier);
        return true;
      });
      return [...questionnairesToAdd, ...questionnaireCollection];
    }
    return questionnaireCollection;
  }

  protected convertDateFromClient<T extends IQuestionnaire | NewQuestionnaire | PartialUpdateQuestionnaire>(questionnaire: T): RestOf<T> {
    return {
      ...questionnaire,
      date: questionnaire.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restQuestionnaire: RestQuestionnaire): IQuestionnaire {
    return {
      ...restQuestionnaire,
      date: restQuestionnaire.date ? dayjs(restQuestionnaire.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestQuestionnaire>): HttpResponse<IQuestionnaire> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestQuestionnaire[]>): HttpResponse<IQuestionnaire[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
