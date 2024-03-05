import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMockCatererEntity } from '../mock-caterer-entity.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mock-caterer-entity.test-samples';

import { MockCatererEntityService } from './mock-caterer-entity.service';

const requireRestSample: IMockCatererEntity = {
  ...sampleWithRequiredData,
};

describe('MockCatererEntity Service', () => {
  let service: MockCatererEntityService;
  let httpMock: HttpTestingController;
  let expectedResult: IMockCatererEntity | IMockCatererEntity[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MockCatererEntityService);
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

    it('should create a MockCatererEntity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mockCatererEntity = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mockCatererEntity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MockCatererEntity', () => {
      const mockCatererEntity = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mockCatererEntity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MockCatererEntity', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MockCatererEntity', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MockCatererEntity', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMockCatererEntityToCollectionIfMissing', () => {
      it('should add a MockCatererEntity to an empty array', () => {
        const mockCatererEntity: IMockCatererEntity = sampleWithRequiredData;
        expectedResult = service.addMockCatererEntityToCollectionIfMissing([], mockCatererEntity);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mockCatererEntity);
      });

      it('should not add a MockCatererEntity to an array that contains it', () => {
        const mockCatererEntity: IMockCatererEntity = sampleWithRequiredData;
        const mockCatererEntityCollection: IMockCatererEntity[] = [
          {
            ...mockCatererEntity,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMockCatererEntityToCollectionIfMissing(mockCatererEntityCollection, mockCatererEntity);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MockCatererEntity to an array that doesn't contain it", () => {
        const mockCatererEntity: IMockCatererEntity = sampleWithRequiredData;
        const mockCatererEntityCollection: IMockCatererEntity[] = [sampleWithPartialData];
        expectedResult = service.addMockCatererEntityToCollectionIfMissing(mockCatererEntityCollection, mockCatererEntity);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mockCatererEntity);
      });

      it('should add only unique MockCatererEntity to an array', () => {
        const mockCatererEntityArray: IMockCatererEntity[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mockCatererEntityCollection: IMockCatererEntity[] = [sampleWithRequiredData];
        expectedResult = service.addMockCatererEntityToCollectionIfMissing(mockCatererEntityCollection, ...mockCatererEntityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mockCatererEntity: IMockCatererEntity = sampleWithRequiredData;
        const mockCatererEntity2: IMockCatererEntity = sampleWithPartialData;
        expectedResult = service.addMockCatererEntityToCollectionIfMissing([], mockCatererEntity, mockCatererEntity2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mockCatererEntity);
        expect(expectedResult).toContain(mockCatererEntity2);
      });

      it('should accept null and undefined values', () => {
        const mockCatererEntity: IMockCatererEntity = sampleWithRequiredData;
        expectedResult = service.addMockCatererEntityToCollectionIfMissing([], null, mockCatererEntity, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mockCatererEntity);
      });

      it('should return initial array if no MockCatererEntity is added', () => {
        const mockCatererEntityCollection: IMockCatererEntity[] = [sampleWithRequiredData];
        expectedResult = service.addMockCatererEntityToCollectionIfMissing(mockCatererEntityCollection, undefined, null);
        expect(expectedResult).toEqual(mockCatererEntityCollection);
      });
    });

    describe('compareMockCatererEntity', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMockCatererEntity(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMockCatererEntity(entity1, entity2);
        const compareResult2 = service.compareMockCatererEntity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMockCatererEntity(entity1, entity2);
        const compareResult2 = service.compareMockCatererEntity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMockCatererEntity(entity1, entity2);
        const compareResult2 = service.compareMockCatererEntity(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
