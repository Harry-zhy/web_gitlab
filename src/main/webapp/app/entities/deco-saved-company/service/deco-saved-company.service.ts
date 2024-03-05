import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDecoSavedCompany, NewDecoSavedCompany } from '../deco-saved-company.model';

export type PartialUpdateDecoSavedCompany = Partial<IDecoSavedCompany> & Pick<IDecoSavedCompany, 'id'>;

export type EntityResponseType = HttpResponse<IDecoSavedCompany>;
export type EntityArrayResponseType = HttpResponse<IDecoSavedCompany[]>;

@Injectable({ providedIn: 'root' })
export class DecoSavedCompanyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/deco-saved-companies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(decoSavedCompany: NewDecoSavedCompany): Observable<EntityResponseType> {
    return this.http.post<IDecoSavedCompany>(this.resourceUrl, decoSavedCompany, { observe: 'response' });
  }

  update(decoSavedCompany: IDecoSavedCompany): Observable<EntityResponseType> {
    return this.http.put<IDecoSavedCompany>(
      `${this.resourceUrl}/${this.getDecoSavedCompanyIdentifier(decoSavedCompany)}`,
      decoSavedCompany,
      { observe: 'response' }
    );
  }

  partialUpdate(decoSavedCompany: PartialUpdateDecoSavedCompany): Observable<EntityResponseType> {
    return this.http.patch<IDecoSavedCompany>(
      `${this.resourceUrl}/${this.getDecoSavedCompanyIdentifier(decoSavedCompany)}`,
      decoSavedCompany,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDecoSavedCompany>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDecoSavedCompany[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDecoSavedCompanyIdentifier(decoSavedCompany: Pick<IDecoSavedCompany, 'id'>): number {
    return decoSavedCompany.id;
  }

  compareDecoSavedCompany(o1: Pick<IDecoSavedCompany, 'id'> | null, o2: Pick<IDecoSavedCompany, 'id'> | null): boolean {
    return o1 && o2 ? this.getDecoSavedCompanyIdentifier(o1) === this.getDecoSavedCompanyIdentifier(o2) : o1 === o2;
  }

  addDecoSavedCompanyToCollectionIfMissing<Type extends Pick<IDecoSavedCompany, 'id'>>(
    decoSavedCompanyCollection: Type[],
    ...decoSavedCompaniesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const decoSavedCompanies: Type[] = decoSavedCompaniesToCheck.filter(isPresent);
    if (decoSavedCompanies.length > 0) {
      const decoSavedCompanyCollectionIdentifiers = decoSavedCompanyCollection.map(
        decoSavedCompanyItem => this.getDecoSavedCompanyIdentifier(decoSavedCompanyItem)!
      );
      const decoSavedCompaniesToAdd = decoSavedCompanies.filter(decoSavedCompanyItem => {
        const decoSavedCompanyIdentifier = this.getDecoSavedCompanyIdentifier(decoSavedCompanyItem);
        if (decoSavedCompanyCollectionIdentifiers.includes(decoSavedCompanyIdentifier)) {
          return false;
        }
        decoSavedCompanyCollectionIdentifiers.push(decoSavedCompanyIdentifier);
        return true;
      });
      return [...decoSavedCompaniesToAdd, ...decoSavedCompanyCollection];
    }
    return decoSavedCompanyCollection;
  }
}
