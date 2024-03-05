import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDecoSavedTheme, NewDecoSavedTheme } from '../deco-saved-theme.model';

export type PartialUpdateDecoSavedTheme = Partial<IDecoSavedTheme> & Pick<IDecoSavedTheme, 'id'>;

export type EntityResponseType = HttpResponse<IDecoSavedTheme>;
export type EntityArrayResponseType = HttpResponse<IDecoSavedTheme[]>;

@Injectable({ providedIn: 'root' })
export class DecoSavedThemeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/deco-saved-themes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(decoSavedTheme: NewDecoSavedTheme): Observable<EntityResponseType> {
    return this.http.post<IDecoSavedTheme>(this.resourceUrl, decoSavedTheme, { observe: 'response' });
  }

  update(decoSavedTheme: IDecoSavedTheme): Observable<EntityResponseType> {
    return this.http.put<IDecoSavedTheme>(`${this.resourceUrl}/${this.getDecoSavedThemeIdentifier(decoSavedTheme)}`, decoSavedTheme, {
      observe: 'response',
    });
  }

  partialUpdate(decoSavedTheme: PartialUpdateDecoSavedTheme): Observable<EntityResponseType> {
    return this.http.patch<IDecoSavedTheme>(`${this.resourceUrl}/${this.getDecoSavedThemeIdentifier(decoSavedTheme)}`, decoSavedTheme, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDecoSavedTheme>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDecoSavedTheme[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDecoSavedThemeIdentifier(decoSavedTheme: Pick<IDecoSavedTheme, 'id'>): number {
    return decoSavedTheme.id;
  }

  compareDecoSavedTheme(o1: Pick<IDecoSavedTheme, 'id'> | null, o2: Pick<IDecoSavedTheme, 'id'> | null): boolean {
    return o1 && o2 ? this.getDecoSavedThemeIdentifier(o1) === this.getDecoSavedThemeIdentifier(o2) : o1 === o2;
  }

  addDecoSavedThemeToCollectionIfMissing<Type extends Pick<IDecoSavedTheme, 'id'>>(
    decoSavedThemeCollection: Type[],
    ...decoSavedThemesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const decoSavedThemes: Type[] = decoSavedThemesToCheck.filter(isPresent);
    if (decoSavedThemes.length > 0) {
      const decoSavedThemeCollectionIdentifiers = decoSavedThemeCollection.map(
        decoSavedThemeItem => this.getDecoSavedThemeIdentifier(decoSavedThemeItem)!
      );
      const decoSavedThemesToAdd = decoSavedThemes.filter(decoSavedThemeItem => {
        const decoSavedThemeIdentifier = this.getDecoSavedThemeIdentifier(decoSavedThemeItem);
        if (decoSavedThemeCollectionIdentifiers.includes(decoSavedThemeIdentifier)) {
          return false;
        }
        decoSavedThemeCollectionIdentifiers.push(decoSavedThemeIdentifier);
        return true;
      });
      return [...decoSavedThemesToAdd, ...decoSavedThemeCollection];
    }
    return decoSavedThemeCollection;
  }
}
