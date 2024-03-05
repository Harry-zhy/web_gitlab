import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDecoBudget, NewDecoBudget } from '../deco-budget.model';

export type PartialUpdateDecoBudget = Partial<IDecoBudget> & Pick<IDecoBudget, 'id'>;

export type EntityResponseType = HttpResponse<IDecoBudget>;
export type EntityArrayResponseType = HttpResponse<IDecoBudget[]>;

@Injectable({ providedIn: 'root' })
export class DecoBudgetService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/deco-budgets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(decoBudget: NewDecoBudget): Observable<EntityResponseType> {
    return this.http.post<IDecoBudget>(this.resourceUrl, decoBudget, { observe: 'response' });
  }

  update(decoBudget: IDecoBudget): Observable<EntityResponseType> {
    return this.http.put<IDecoBudget>(`${this.resourceUrl}/${this.getDecoBudgetIdentifier(decoBudget)}`, decoBudget, {
      observe: 'response',
    });
  }

  partialUpdate(decoBudget: PartialUpdateDecoBudget): Observable<EntityResponseType> {
    return this.http.patch<IDecoBudget>(`${this.resourceUrl}/${this.getDecoBudgetIdentifier(decoBudget)}`, decoBudget, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDecoBudget>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDecoBudget[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDecoBudgetIdentifier(decoBudget: Pick<IDecoBudget, 'id'>): number {
    return decoBudget.id;
  }

  compareDecoBudget(o1: Pick<IDecoBudget, 'id'> | null, o2: Pick<IDecoBudget, 'id'> | null): boolean {
    return o1 && o2 ? this.getDecoBudgetIdentifier(o1) === this.getDecoBudgetIdentifier(o2) : o1 === o2;
  }

  addDecoBudgetToCollectionIfMissing<Type extends Pick<IDecoBudget, 'id'>>(
    decoBudgetCollection: Type[],
    ...decoBudgetsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const decoBudgets: Type[] = decoBudgetsToCheck.filter(isPresent);
    if (decoBudgets.length > 0) {
      const decoBudgetCollectionIdentifiers = decoBudgetCollection.map(decoBudgetItem => this.getDecoBudgetIdentifier(decoBudgetItem)!);
      const decoBudgetsToAdd = decoBudgets.filter(decoBudgetItem => {
        const decoBudgetIdentifier = this.getDecoBudgetIdentifier(decoBudgetItem);
        if (decoBudgetCollectionIdentifiers.includes(decoBudgetIdentifier)) {
          return false;
        }
        decoBudgetCollectionIdentifiers.push(decoBudgetIdentifier);
        return true;
      });
      return [...decoBudgetsToAdd, ...decoBudgetCollection];
    }
    return decoBudgetCollection;
  }
}
