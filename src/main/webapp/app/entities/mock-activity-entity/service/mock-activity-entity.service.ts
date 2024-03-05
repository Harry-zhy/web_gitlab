import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMockActivityEntity, NewMockActivityEntity } from '../mock-activity-entity.model';

export type PartialUpdateMockActivityEntity = Partial<IMockActivityEntity> & Pick<IMockActivityEntity, 'id'>;

export type EntityResponseType = HttpResponse<IMockActivityEntity>;
export type EntityArrayResponseType = HttpResponse<IMockActivityEntity[]>;

@Injectable({ providedIn: 'root' })
export class MockActivityEntityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mock-activity-entities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mockActivityEntity: NewMockActivityEntity): Observable<EntityResponseType> {
    return this.http.post<IMockActivityEntity>(this.resourceUrl, mockActivityEntity, { observe: 'response' });
  }

  update(mockActivityEntity: IMockActivityEntity): Observable<EntityResponseType> {
    return this.http.put<IMockActivityEntity>(
      `${this.resourceUrl}/${this.getMockActivityEntityIdentifier(mockActivityEntity)}`,
      mockActivityEntity,
      { observe: 'response' }
    );
  }

  partialUpdate(mockActivityEntity: PartialUpdateMockActivityEntity): Observable<EntityResponseType> {
    return this.http.patch<IMockActivityEntity>(
      `${this.resourceUrl}/${this.getMockActivityEntityIdentifier(mockActivityEntity)}`,
      mockActivityEntity,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMockActivityEntity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMockActivityEntity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMockActivityEntityIdentifier(mockActivityEntity: Pick<IMockActivityEntity, 'id'>): number {
    return mockActivityEntity.id;
  }

  compareMockActivityEntity(o1: Pick<IMockActivityEntity, 'id'> | null, o2: Pick<IMockActivityEntity, 'id'> | null): boolean {
    return o1 && o2 ? this.getMockActivityEntityIdentifier(o1) === this.getMockActivityEntityIdentifier(o2) : o1 === o2;
  }

  addMockActivityEntityToCollectionIfMissing<Type extends Pick<IMockActivityEntity, 'id'>>(
    mockActivityEntityCollection: Type[],
    ...mockActivityEntitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mockActivityEntities: Type[] = mockActivityEntitiesToCheck.filter(isPresent);
    if (mockActivityEntities.length > 0) {
      const mockActivityEntityCollectionIdentifiers = mockActivityEntityCollection.map(
        mockActivityEntityItem => this.getMockActivityEntityIdentifier(mockActivityEntityItem)!
      );
      const mockActivityEntitiesToAdd = mockActivityEntities.filter(mockActivityEntityItem => {
        const mockActivityEntityIdentifier = this.getMockActivityEntityIdentifier(mockActivityEntityItem);
        if (mockActivityEntityCollectionIdentifiers.includes(mockActivityEntityIdentifier)) {
          return false;
        }
        mockActivityEntityCollectionIdentifiers.push(mockActivityEntityIdentifier);
        return true;
      });
      return [...mockActivityEntitiesToAdd, ...mockActivityEntityCollection];
    }
    return mockActivityEntityCollection;
  }
}
