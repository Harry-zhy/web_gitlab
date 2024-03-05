import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDietaryRequirements, NewDietaryRequirements } from '../dietary-requirements.model';

export type PartialUpdateDietaryRequirements = Partial<IDietaryRequirements> & Pick<IDietaryRequirements, 'id'>;

export type EntityResponseType = HttpResponse<IDietaryRequirements>;
export type EntityArrayResponseType = HttpResponse<IDietaryRequirements[]>;

@Injectable({ providedIn: 'root' })
export class DietaryRequirementsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/dietary-requirements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(dietaryRequirements: NewDietaryRequirements): Observable<EntityResponseType> {
    return this.http.post<IDietaryRequirements>(this.resourceUrl, dietaryRequirements, { observe: 'response' });
  }

  update(dietaryRequirements: IDietaryRequirements): Observable<EntityResponseType> {
    return this.http.put<IDietaryRequirements>(
      `${this.resourceUrl}/${this.getDietaryRequirementsIdentifier(dietaryRequirements)}`,
      dietaryRequirements,
      { observe: 'response' }
    );
  }

  partialUpdate(dietaryRequirements: PartialUpdateDietaryRequirements): Observable<EntityResponseType> {
    return this.http.patch<IDietaryRequirements>(
      `${this.resourceUrl}/${this.getDietaryRequirementsIdentifier(dietaryRequirements)}`,
      dietaryRequirements,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDietaryRequirements>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDietaryRequirements[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDietaryRequirementsIdentifier(dietaryRequirements: Pick<IDietaryRequirements, 'id'>): number {
    return dietaryRequirements.id;
  }

  compareDietaryRequirements(o1: Pick<IDietaryRequirements, 'id'> | null, o2: Pick<IDietaryRequirements, 'id'> | null): boolean {
    return o1 && o2 ? this.getDietaryRequirementsIdentifier(o1) === this.getDietaryRequirementsIdentifier(o2) : o1 === o2;
  }

  addDietaryRequirementsToCollectionIfMissing<Type extends Pick<IDietaryRequirements, 'id'>>(
    dietaryRequirementsCollection: Type[],
    ...dietaryRequirementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const dietaryRequirements: Type[] = dietaryRequirementsToCheck.filter(isPresent);
    if (dietaryRequirements.length > 0) {
      const dietaryRequirementsCollectionIdentifiers = dietaryRequirementsCollection.map(
        dietaryRequirementsItem => this.getDietaryRequirementsIdentifier(dietaryRequirementsItem)!
      );
      const dietaryRequirementsToAdd = dietaryRequirements.filter(dietaryRequirementsItem => {
        const dietaryRequirementsIdentifier = this.getDietaryRequirementsIdentifier(dietaryRequirementsItem);
        if (dietaryRequirementsCollectionIdentifiers.includes(dietaryRequirementsIdentifier)) {
          return false;
        }
        dietaryRequirementsCollectionIdentifiers.push(dietaryRequirementsIdentifier);
        return true;
      });
      return [...dietaryRequirementsToAdd, ...dietaryRequirementsCollection];
    }
    return dietaryRequirementsCollection;
  }
}
