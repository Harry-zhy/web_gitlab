import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMockCatererEntity, NewMockCatererEntity } from '../mock-caterer-entity.model';

export type PartialUpdateMockCatererEntity = Partial<IMockCatererEntity> & Pick<IMockCatererEntity, 'id'>;

export type EntityResponseType = HttpResponse<IMockCatererEntity>;
export type EntityArrayResponseType = HttpResponse<IMockCatererEntity[]>;

@Injectable({ providedIn: 'root' })
export class MockCatererEntityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mock-caterer-entities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mockCatererEntity: NewMockCatererEntity): Observable<EntityResponseType> {
    return this.http.post<IMockCatererEntity>(this.resourceUrl, mockCatererEntity, { observe: 'response' });
  }

  update(mockCatererEntity: IMockCatererEntity): Observable<EntityResponseType> {
    return this.http.put<IMockCatererEntity>(
      `${this.resourceUrl}/${this.getMockCatererEntityIdentifier(mockCatererEntity)}`,
      mockCatererEntity,
      { observe: 'response' }
    );
  }

  partialUpdate(mockCatererEntity: PartialUpdateMockCatererEntity): Observable<EntityResponseType> {
    return this.http.patch<IMockCatererEntity>(
      `${this.resourceUrl}/${this.getMockCatererEntityIdentifier(mockCatererEntity)}`,
      mockCatererEntity,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMockCatererEntity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMockCatererEntity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMockCatererEntityIdentifier(mockCatererEntity: Pick<IMockCatererEntity, 'id'>): number {
    return mockCatererEntity.id;
  }

  compareMockCatererEntity(o1: Pick<IMockCatererEntity, 'id'> | null, o2: Pick<IMockCatererEntity, 'id'> | null): boolean {
    return o1 && o2 ? this.getMockCatererEntityIdentifier(o1) === this.getMockCatererEntityIdentifier(o2) : o1 === o2;
  }

  addMockCatererEntityToCollectionIfMissing<Type extends Pick<IMockCatererEntity, 'id'>>(
    mockCatererEntityCollection: Type[],
    ...mockCatererEntitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mockCatererEntities: Type[] = mockCatererEntitiesToCheck.filter(isPresent);
    if (mockCatererEntities.length > 0) {
      const mockCatererEntityCollectionIdentifiers = mockCatererEntityCollection.map(
        mockCatererEntityItem => this.getMockCatererEntityIdentifier(mockCatererEntityItem)!
      );
      const mockCatererEntitiesToAdd = mockCatererEntities.filter(mockCatererEntityItem => {
        const mockCatererEntityIdentifier = this.getMockCatererEntityIdentifier(mockCatererEntityItem);
        if (mockCatererEntityCollectionIdentifiers.includes(mockCatererEntityIdentifier)) {
          return false;
        }
        mockCatererEntityCollectionIdentifiers.push(mockCatererEntityIdentifier);
        return true;
      });
      return [...mockCatererEntitiesToAdd, ...mockCatererEntityCollection];
    }
    return mockCatererEntityCollection;
  }
}
