import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDecoCompany, NewDecoCompany } from '../deco-company.model';

export type PartialUpdateDecoCompany = Partial<IDecoCompany> & Pick<IDecoCompany, 'id'>;

export type EntityResponseType = HttpResponse<IDecoCompany>;
export type EntityArrayResponseType = HttpResponse<IDecoCompany[]>;

@Injectable({ providedIn: 'root' })
export class DecoCompanyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/deco-companies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(decoCompany: NewDecoCompany): Observable<EntityResponseType> {
    return this.http.post<IDecoCompany>(this.resourceUrl, decoCompany, { observe: 'response' });
  }

  update(decoCompany: IDecoCompany): Observable<EntityResponseType> {
    return this.http.put<IDecoCompany>(`${this.resourceUrl}/${this.getDecoCompanyIdentifier(decoCompany)}`, decoCompany, {
      observe: 'response',
    });
  }

  partialUpdate(decoCompany: PartialUpdateDecoCompany): Observable<EntityResponseType> {
    return this.http.patch<IDecoCompany>(`${this.resourceUrl}/${this.getDecoCompanyIdentifier(decoCompany)}`, decoCompany, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDecoCompany>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDecoCompany[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDecoCompanyIdentifier(decoCompany: Pick<IDecoCompany, 'id'>): number {
    return decoCompany.id;
  }

  compareDecoCompany(o1: Pick<IDecoCompany, 'id'> | null, o2: Pick<IDecoCompany, 'id'> | null): boolean {
    return o1 && o2 ? this.getDecoCompanyIdentifier(o1) === this.getDecoCompanyIdentifier(o2) : o1 === o2;
  }

  addDecoCompanyToCollectionIfMissing<Type extends Pick<IDecoCompany, 'id'>>(
    decoCompanyCollection: Type[],
    ...decoCompaniesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const decoCompanies: Type[] = decoCompaniesToCheck.filter(isPresent);
    if (decoCompanies.length > 0) {
      const decoCompanyCollectionIdentifiers = decoCompanyCollection.map(
        decoCompanyItem => this.getDecoCompanyIdentifier(decoCompanyItem)!
      );
      const decoCompaniesToAdd = decoCompanies.filter(decoCompanyItem => {
        const decoCompanyIdentifier = this.getDecoCompanyIdentifier(decoCompanyItem);
        if (decoCompanyCollectionIdentifiers.includes(decoCompanyIdentifier)) {
          return false;
        }
        decoCompanyCollectionIdentifiers.push(decoCompanyIdentifier);
        return true;
      });
      return [...decoCompaniesToAdd, ...decoCompanyCollection];
    }
    return decoCompanyCollection;
  }
}
