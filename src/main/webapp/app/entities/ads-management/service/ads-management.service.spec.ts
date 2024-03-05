import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAdsManagement } from '../ads-management.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ads-management.test-samples';

import { AdsManagementService } from './ads-management.service';

const requireRestSample: IAdsManagement = {
  ...sampleWithRequiredData,
};

describe('AdsManagement Service', () => {
  let service: AdsManagementService;
  let httpMock: HttpTestingController;
  let expectedResult: IAdsManagement | IAdsManagement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AdsManagementService);
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

    it('should create a AdsManagement', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const adsManagement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(adsManagement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AdsManagement', () => {
      const adsManagement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(adsManagement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AdsManagement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AdsManagement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AdsManagement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAdsManagementToCollectionIfMissing', () => {
      it('should add a AdsManagement to an empty array', () => {
        const adsManagement: IAdsManagement = sampleWithRequiredData;
        expectedResult = service.addAdsManagementToCollectionIfMissing([], adsManagement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(adsManagement);
      });

      it('should not add a AdsManagement to an array that contains it', () => {
        const adsManagement: IAdsManagement = sampleWithRequiredData;
        const adsManagementCollection: IAdsManagement[] = [
          {
            ...adsManagement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAdsManagementToCollectionIfMissing(adsManagementCollection, adsManagement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AdsManagement to an array that doesn't contain it", () => {
        const adsManagement: IAdsManagement = sampleWithRequiredData;
        const adsManagementCollection: IAdsManagement[] = [sampleWithPartialData];
        expectedResult = service.addAdsManagementToCollectionIfMissing(adsManagementCollection, adsManagement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(adsManagement);
      });

      it('should add only unique AdsManagement to an array', () => {
        const adsManagementArray: IAdsManagement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const adsManagementCollection: IAdsManagement[] = [sampleWithRequiredData];
        expectedResult = service.addAdsManagementToCollectionIfMissing(adsManagementCollection, ...adsManagementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const adsManagement: IAdsManagement = sampleWithRequiredData;
        const adsManagement2: IAdsManagement = sampleWithPartialData;
        expectedResult = service.addAdsManagementToCollectionIfMissing([], adsManagement, adsManagement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(adsManagement);
        expect(expectedResult).toContain(adsManagement2);
      });

      it('should accept null and undefined values', () => {
        const adsManagement: IAdsManagement = sampleWithRequiredData;
        expectedResult = service.addAdsManagementToCollectionIfMissing([], null, adsManagement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(adsManagement);
      });

      it('should return initial array if no AdsManagement is added', () => {
        const adsManagementCollection: IAdsManagement[] = [sampleWithRequiredData];
        expectedResult = service.addAdsManagementToCollectionIfMissing(adsManagementCollection, undefined, null);
        expect(expectedResult).toEqual(adsManagementCollection);
      });
    });

    describe('compareAdsManagement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAdsManagement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAdsManagement(entity1, entity2);
        const compareResult2 = service.compareAdsManagement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAdsManagement(entity1, entity2);
        const compareResult2 = service.compareAdsManagement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAdsManagement(entity1, entity2);
        const compareResult2 = service.compareAdsManagement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
