import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDecoThemes, NewDecoThemes } from '../deco-themes.model';

export type PartialUpdateDecoThemes = Partial<IDecoThemes> & Pick<IDecoThemes, 'id'>;

export type EntityResponseType = HttpResponse<IDecoThemes>;
export type EntityArrayResponseType = HttpResponse<IDecoThemes[]>;

@Injectable({ providedIn: 'root' })
export class DecoThemesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/deco-themes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(decoThemes: NewDecoThemes): Observable<EntityResponseType> {
    return this.http.post<IDecoThemes>(this.resourceUrl, decoThemes, { observe: 'response' });
  }

  update(decoThemes: IDecoThemes): Observable<EntityResponseType> {
    return this.http.put<IDecoThemes>(`${this.resourceUrl}/${this.getDecoThemesIdentifier(decoThemes)}`, decoThemes, {
      observe: 'response',
    });
  }

  partialUpdate(decoThemes: PartialUpdateDecoThemes): Observable<EntityResponseType> {
    return this.http.patch<IDecoThemes>(`${this.resourceUrl}/${this.getDecoThemesIdentifier(decoThemes)}`, decoThemes, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDecoThemes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDecoThemes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDecoThemesIdentifier(decoThemes: Pick<IDecoThemes, 'id'>): number {
    return decoThemes.id;
  }

  compareDecoThemes(o1: Pick<IDecoThemes, 'id'> | null, o2: Pick<IDecoThemes, 'id'> | null): boolean {
    return o1 && o2 ? this.getDecoThemesIdentifier(o1) === this.getDecoThemesIdentifier(o2) : o1 === o2;
  }

  addDecoThemesToCollectionIfMissing<Type extends Pick<IDecoThemes, 'id'>>(
    decoThemesCollection: Type[],
    ...decoThemesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const decoThemes: Type[] = decoThemesToCheck.filter(isPresent);
    if (decoThemes.length > 0) {
      const decoThemesCollectionIdentifiers = decoThemesCollection.map(decoThemesItem => this.getDecoThemesIdentifier(decoThemesItem)!);
      const decoThemesToAdd = decoThemes.filter(decoThemesItem => {
        const decoThemesIdentifier = this.getDecoThemesIdentifier(decoThemesItem);
        if (decoThemesCollectionIdentifiers.includes(decoThemesIdentifier)) {
          return false;
        }
        decoThemesCollectionIdentifiers.push(decoThemesIdentifier);
        return true;
      });
      return [...decoThemesToAdd, ...decoThemesCollection];
    }
    return decoThemesCollection;
  }
}
