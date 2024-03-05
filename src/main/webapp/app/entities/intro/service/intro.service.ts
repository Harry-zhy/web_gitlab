import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIntro, NewIntro } from '../intro.model';

export type PartialUpdateIntro = Partial<IIntro> & Pick<IIntro, 'id'>;

export type EntityResponseType = HttpResponse<IIntro>;
export type EntityArrayResponseType = HttpResponse<IIntro[]>;

@Injectable({ providedIn: 'root' })
export class IntroService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/intros');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(intro: NewIntro): Observable<EntityResponseType> {
    return this.http.post<IIntro>(this.resourceUrl, intro, { observe: 'response' });
  }

  update(intro: IIntro): Observable<EntityResponseType> {
    return this.http.put<IIntro>(`${this.resourceUrl}/${this.getIntroIdentifier(intro)}`, intro, { observe: 'response' });
  }

  partialUpdate(intro: PartialUpdateIntro): Observable<EntityResponseType> {
    return this.http.patch<IIntro>(`${this.resourceUrl}/${this.getIntroIdentifier(intro)}`, intro, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIntro>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIntro[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getIntroIdentifier(intro: Pick<IIntro, 'id'>): number {
    return intro.id;
  }

  compareIntro(o1: Pick<IIntro, 'id'> | null, o2: Pick<IIntro, 'id'> | null): boolean {
    return o1 && o2 ? this.getIntroIdentifier(o1) === this.getIntroIdentifier(o2) : o1 === o2;
  }

  addIntroToCollectionIfMissing<Type extends Pick<IIntro, 'id'>>(
    introCollection: Type[],
    ...introsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const intros: Type[] = introsToCheck.filter(isPresent);
    if (intros.length > 0) {
      const introCollectionIdentifiers = introCollection.map(introItem => this.getIntroIdentifier(introItem)!);
      const introsToAdd = intros.filter(introItem => {
        const introIdentifier = this.getIntroIdentifier(introItem);
        if (introCollectionIdentifiers.includes(introIdentifier)) {
          return false;
        }
        introCollectionIdentifiers.push(introIdentifier);
        return true;
      });
      return [...introsToAdd, ...introCollection];
    }
    return introCollection;
  }
}
