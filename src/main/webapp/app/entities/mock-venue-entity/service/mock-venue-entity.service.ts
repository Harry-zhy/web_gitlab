import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMockVenueEntity, NewMockVenueEntity } from '../mock-venue-entity.model';

export type PartialUpdateMockVenueEntity = Partial<IMockVenueEntity> & Pick<IMockVenueEntity, 'id'>;

export type EntityResponseType = HttpResponse<IMockVenueEntity>;
export type EntityArrayResponseType = HttpResponse<IMockVenueEntity[]>;

@Injectable({ providedIn: 'root' })
export class MockVenueEntityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mock-venue-entities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mockVenueEntity: NewMockVenueEntity): Observable<EntityResponseType> {
    return this.http.post<IMockVenueEntity>(this.resourceUrl, mockVenueEntity, { observe: 'response' });
  }

  update(mockVenueEntity: IMockVenueEntity): Observable<EntityResponseType> {
    return this.http.put<IMockVenueEntity>(`${this.resourceUrl}/${this.getMockVenueEntityIdentifier(mockVenueEntity)}`, mockVenueEntity, {
      observe: 'response',
    });
  }

  partialUpdate(mockVenueEntity: PartialUpdateMockVenueEntity): Observable<EntityResponseType> {
    return this.http.patch<IMockVenueEntity>(`${this.resourceUrl}/${this.getMockVenueEntityIdentifier(mockVenueEntity)}`, mockVenueEntity, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMockVenueEntity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMockVenueEntity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMockVenueEntityIdentifier(mockVenueEntity: Pick<IMockVenueEntity, 'id'>): number {
    return mockVenueEntity.id;
  }

  compareMockVenueEntity(o1: Pick<IMockVenueEntity, 'id'> | null, o2: Pick<IMockVenueEntity, 'id'> | null): boolean {
    return o1 && o2 ? this.getMockVenueEntityIdentifier(o1) === this.getMockVenueEntityIdentifier(o2) : o1 === o2;
  }

  addMockVenueEntityToCollectionIfMissing<Type extends Pick<IMockVenueEntity, 'id'>>(
    mockVenueEntityCollection: Type[],
    ...mockVenueEntitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mockVenueEntities: Type[] = mockVenueEntitiesToCheck.filter(isPresent);
    if (mockVenueEntities.length > 0) {
      const mockVenueEntityCollectionIdentifiers = mockVenueEntityCollection.map(
        mockVenueEntityItem => this.getMockVenueEntityIdentifier(mockVenueEntityItem)!
      );
      const mockVenueEntitiesToAdd = mockVenueEntities.filter(mockVenueEntityItem => {
        const mockVenueEntityIdentifier = this.getMockVenueEntityIdentifier(mockVenueEntityItem);
        if (mockVenueEntityCollectionIdentifiers.includes(mockVenueEntityIdentifier)) {
          return false;
        }
        mockVenueEntityCollectionIdentifiers.push(mockVenueEntityIdentifier);
        return true;
      });
      return [...mockVenueEntitiesToAdd, ...mockVenueEntityCollection];
    }
    return mockVenueEntityCollection;
  }
}
