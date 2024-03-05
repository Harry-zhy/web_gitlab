import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMockVenueEntity } from '../mock-venue-entity.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mock-venue-entity.test-samples';

import { MockVenueEntityService } from './mock-venue-entity.service';

const requireRestSample: IMockVenueEntity = {
  ...sampleWithRequiredData,
};

describe('MockVenueEntity Service', () => {
  let service: MockVenueEntityService;
  let httpMock: HttpTestingController;
  let expectedResult: IMockVenueEntity | IMockVenueEntity[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MockVenueEntityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a MockVenueEntity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mockVenueEntity = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mockVenueEntity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MockVenueEntity', () => {
      const mockVenueEntity = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mockVenueEntity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MockVenueEntity', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MockVenueEntity', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MockVenueEntity', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMockVenueEntityToCollectionIfMissing', () => {
      it('should add a MockVenueEntity to an empty array', () => {
        const mockVenueEntity: IMockVenueEntity = sampleWithRequiredData;
        expectedResult = service.addMockVenueEntityToCollectionIfMissing([], mockVenueEntity);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mockVenueEntity);
      });

      it('should not add a MockVenueEntity to an array that contains it', () => {
        const mockVenueEntity: IMockVenueEntity = sampleWithRequiredData;
        const mockVenueEntityCollection: IMockVenueEntity[] = [
          {
            ...mockVenueEntity,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMockVenueEntityToCollectionIfMissing(mockVenueEntityCollection, mockVenueEntity);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MockVenueEntity to an array that doesn't contain it", () => {
        const mockVenueEntity: IMockVenueEntity = sampleWithRequiredData;
        const mockVenueEntityCollection: IMockVenueEntity[] = [sampleWithPartialData];
        expectedResult = service.addMockVenueEntityToCollectionIfMissing(mockVenueEntityCollection, mockVenueEntity);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mockVenueEntity);
      });

      it('should add only unique MockVenueEntity to an array', () => {
        const mockVenueEntityArray: IMockVenueEntity[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mockVenueEntityCollection: IMockVenueEntity[] = [sampleWithRequiredData];
        expectedResult = service.addMockVenueEntityToCollectionIfMissing(mockVenueEntityCollection, ...mockVenueEntityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mockVenueEntity: IMockVenueEntity = sampleWithRequiredData;
        const mockVenueEntity2: IMockVenueEntity = sampleWithPartialData;
        expectedResult = service.addMockVenueEntityToCollectionIfMissing([], mockVenueEntity, mockVenueEntity2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mockVenueEntity);
        expect(expectedResult).toContain(mockVenueEntity2);
      });

      it('should accept null and undefined values', () => {
        const mockVenueEntity: IMockVenueEntity = sampleWithRequiredData;
        expectedResult = service.addMockVenueEntityToCollectionIfMissing([], null, mockVenueEntity, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mockVenueEntity);
      });

      it('should return initial array if no MockVenueEntity is added', () => {
        const mockVenueEntityCollection: IMockVenueEntity[] = [sampleWithRequiredData];
        expectedResult = service.addMockVenueEntityToCollectionIfMissing(mockVenueEntityCollection, undefined, null);
        expect(expectedResult).toEqual(mockVenueEntityCollection);
      });
    });

    describe('compareMockVenueEntity', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMockVenueEntity(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMockVenueEntity(entity1, entity2);
        const compareResult2 = service.compareMockVenueEntity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMockVenueEntity(entity1, entity2);
        const compareResult2 = service.compareMockVenueEntity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMockVenueEntity(entity1, entity2);
        const compareResult2 = service.compareMockVenueEntity(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
