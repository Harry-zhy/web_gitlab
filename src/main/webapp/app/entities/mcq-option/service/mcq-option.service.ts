import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMCQOption, NewMCQOption } from '../mcq-option.model';

export type PartialUpdateMCQOption = Partial<IMCQOption> & Pick<IMCQOption, 'id'>;

export type EntityResponseType = HttpResponse<IMCQOption>;
export type EntityArrayResponseType = HttpResponse<IMCQOption[]>;

@Injectable({ providedIn: 'root' })
export class MCQOptionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mcq-options');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mCQOption: NewMCQOption): Observable<EntityResponseType> {
    return this.http.post<IMCQOption>(this.resourceUrl, mCQOption, { observe: 'response' });
  }

  update(mCQOption: IMCQOption): Observable<EntityResponseType> {
    return this.http.put<IMCQOption>(`${this.resourceUrl}/${this.getMCQOptionIdentifier(mCQOption)}`, mCQOption, { observe: 'response' });
  }

  partialUpdate(mCQOption: PartialUpdateMCQOption): Observable<EntityResponseType> {
    return this.http.patch<IMCQOption>(`${this.resourceUrl}/${this.getMCQOptionIdentifier(mCQOption)}`, mCQOption, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMCQOption>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMCQOption[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMCQOptionIdentifier(mCQOption: Pick<IMCQOption, 'id'>): number {
    return mCQOption.id;
  }

  compareMCQOption(o1: Pick<IMCQOption, 'id'> | null, o2: Pick<IMCQOption, 'id'> | null): boolean {
    return o1 && o2 ? this.getMCQOptionIdentifier(o1) === this.getMCQOptionIdentifier(o2) : o1 === o2;
  }

  addMCQOptionToCollectionIfMissing<Type extends Pick<IMCQOption, 'id'>>(
    mCQOptionCollection: Type[],
    ...mCQOptionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mCQOptions: Type[] = mCQOptionsToCheck.filter(isPresent);
    if (mCQOptions.length > 0) {
      const mCQOptionCollectionIdentifiers = mCQOptionCollection.map(mCQOptionItem => this.getMCQOptionIdentifier(mCQOptionItem)!);
      const mCQOptionsToAdd = mCQOptions.filter(mCQOptionItem => {
        const mCQOptionIdentifier = this.getMCQOptionIdentifier(mCQOptionItem);
        if (mCQOptionCollectionIdentifiers.includes(mCQOptionIdentifier)) {
          return false;
        }
        mCQOptionCollectionIdentifiers.push(mCQOptionIdentifier);
        return true;
      });
      return [...mCQOptionsToAdd, ...mCQOptionCollection];
    }
    return mCQOptionCollection;
  }
}
