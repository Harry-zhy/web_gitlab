import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBusinessInformation, NewBusinessInformation } from '../business-information.model';

export type PartialUpdateBusinessInformation = Partial<IBusinessInformation> & Pick<IBusinessInformation, 'id'>;

export type EntityResponseType = HttpResponse<IBusinessInformation>;
export type EntityArrayResponseType = HttpResponse<IBusinessInformation[]>;

@Injectable({ providedIn: 'root' })
export class BusinessInformationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/business-informations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(businessInformation: NewBusinessInformation): Observable<EntityResponseType> {
    return this.http.post<IBusinessInformation>(this.resourceUrl, businessInformation, { observe: 'response' });
  }

  update(businessInformation: IBusinessInformation): Observable<EntityResponseType> {
    return this.http.put<IBusinessInformation>(
      `${this.resourceUrl}/${this.getBusinessInformationIdentifier(businessInformation)}`,
      businessInformation,
      { observe: 'response' }
    );
  }

  partialUpdate(businessInformation: PartialUpdateBusinessInformation): Observable<EntityResponseType> {
    return this.http.patch<IBusinessInformation>(
      `${this.resourceUrl}/${this.getBusinessInformationIdentifier(businessInformation)}`,
      businessInformation,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBusinessInformation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusinessInformation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBusinessInformationIdentifier(businessInformation: Pick<IBusinessInformation, 'id'>): number {
    return businessInformation.id;
  }

  compareBusinessInformation(o1: Pick<IBusinessInformation, 'id'> | null, o2: Pick<IBusinessInformation, 'id'> | null): boolean {
    return o1 && o2 ? this.getBusinessInformationIdentifier(o1) === this.getBusinessInformationIdentifier(o2) : o1 === o2;
  }

  addBusinessInformationToCollectionIfMissing<Type extends Pick<IBusinessInformation, 'id'>>(
    businessInformationCollection: Type[],
    ...businessInformationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const businessInformations: Type[] = businessInformationsToCheck.filter(isPresent);
    if (businessInformations.length > 0) {
      const businessInformationCollectionIdentifiers = businessInformationCollection.map(
        businessInformationItem => this.getBusinessInformationIdentifier(businessInformationItem)!
      );
      const businessInformationsToAdd = businessInformations.filter(businessInformationItem => {
        const businessInformationIdentifier = this.getBusinessInformationIdentifier(businessInformationItem);
        if (businessInformationCollectionIdentifiers.includes(businessInformationIdentifier)) {
          return false;
        }
        businessInformationCollectionIdentifiers.push(businessInformationIdentifier);
        return true;
      });
      return [...businessInformationsToAdd, ...businessInformationCollection];
    }
    return businessInformationCollection;
  }
}
