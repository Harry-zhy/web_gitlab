import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMockActivityEntity } from '../mock-activity-entity.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mock-activity-entity.test-samples';

import { MockActivityEntityService } from './mock-activity-entity.service';

const requireRestSample: IMockActivityEntity = {
  ...sampleWithRequiredData,
};

describe('MockActivityEntity Service', () => {
  let service: MockActivityEntityService;
  let httpMock: HttpTestingController;
  let expectedResult: IMockActivityEntity | IMockActivityEntity[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MockActivityEntityService);
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

    it('should create a MockActivityEntity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mockActivityEntity = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mockActivityEntity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MockActivityEntity', () => {
      const mockActivityEntity = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mockActivityEntity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MockActivityEntity', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MockActivityEntity', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MockActivityEntity', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMockActivityEntityToCollectionIfMissing', () => {
      it('should add a MockActivityEntity to an empty array', () => {
        const mockActivityEntity: IMockActivityEntity = sampleWithRequiredData;
        expectedResult = service.addMockActivityEntityToCollectionIfMissing([], mockActivityEntity);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mockActivityEntity);
      });

      it('should not add a MockActivityEntity to an array that contains it', () => {
        const mockActivityEntity: IMockActivityEntity = sampleWithRequiredData;
        const mockActivityEntityCollection: IMockActivityEntity[] = [
          {
            ...mockActivityEntity,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMockActivityEntityToCollectionIfMissing(mockActivityEntityCollection, mockActivityEntity);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MockActivityEntity to an array that doesn't contain it", () => {
        const mockActivityEntity: IMockActivityEntity = sampleWithRequiredData;
        const mockActivityEntityCollection: IMockActivityEntity[] = [sampleWithPartialData];
        expectedResult = service.addMockActivityEntityToCollectionIfMissing(mockActivityEntityCollection, mockActivityEntity);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mockActivityEntity);
      });

      it('should add only unique MockActivityEntity to an array', () => {
        const mockActivityEntityArray: IMockActivityEntity[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mockActivityEntityCollection: IMockActivityEntity[] = [sampleWithRequiredData];
        expectedResult = service.addMockActivityEntityToCollectionIfMissing(mockActivityEntityCollection, ...mockActivityEntityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mockActivityEntity: IMockActivityEntity = sampleWithRequiredData;
        const mockActivityEntity2: IMockActivityEntity = sampleWithPartialData;
        expectedResult = service.addMockActivityEntityToCollectionIfMissing([], mockActivityEntity, mockActivityEntity2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mockActivityEntity);
        expect(expectedResult).toContain(mockActivityEntity2);
      });

      it('should accept null and undefined values', () => {
        const mockActivityEntity: IMockActivityEntity = sampleWithRequiredData;
        expectedResult = service.addMockActivityEntityToCollectionIfMissing([], null, mockActivityEntity, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mockActivityEntity);
      });

      it('should return initial array if no MockActivityEntity is added', () => {
        const mockActivityEntityCollection: IMockActivityEntity[] = [sampleWithRequiredData];
        expectedResult = service.addMockActivityEntityToCollectionIfMissing(mockActivityEntityCollection, undefined, null);
        expect(expectedResult).toEqual(mockActivityEntityCollection);
      });
    });

    describe('compareMockActivityEntity', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMockActivityEntity(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMockActivityEntity(entity1, entity2);
        const compareResult2 = service.compareMockActivityEntity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMockActivityEntity(entity1, entity2);
        const compareResult2 = service.compareMockActivityEntity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMockActivityEntity(entity1, entity2);
        const compareResult2 = service.compareMockActivityEntity(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
