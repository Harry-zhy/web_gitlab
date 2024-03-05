import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActivitySaved } from '../activity-saved.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../activity-saved.test-samples';

import { ActivitySavedService, RestActivitySaved } from './activity-saved.service';

const requireRestSample: RestActivitySaved = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('ActivitySaved Service', () => {
  let service: ActivitySavedService;
  let httpMock: HttpTestingController;
  let expectedResult: IActivitySaved | IActivitySaved[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActivitySavedService);
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

    it('should create a ActivitySaved', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const activitySaved = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(activitySaved).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ActivitySaved', () => {
      const activitySaved = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(activitySaved).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ActivitySaved', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ActivitySaved', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ActivitySaved', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActivitySavedToCollectionIfMissing', () => {
      it('should add a ActivitySaved to an empty array', () => {
        const activitySaved: IActivitySaved = sampleWithRequiredData;
        expectedResult = service.addActivitySavedToCollectionIfMissing([], activitySaved);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activitySaved);
      });

      it('should not add a ActivitySaved to an array that contains it', () => {
        const activitySaved: IActivitySaved = sampleWithRequiredData;
        const activitySavedCollection: IActivitySaved[] = [
          {
            ...activitySaved,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActivitySavedToCollectionIfMissing(activitySavedCollection, activitySaved);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ActivitySaved to an array that doesn't contain it", () => {
        const activitySaved: IActivitySaved = sampleWithRequiredData;
        const activitySavedCollection: IActivitySaved[] = [sampleWithPartialData];
        expectedResult = service.addActivitySavedToCollectionIfMissing(activitySavedCollection, activitySaved);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activitySaved);
      });

      it('should add only unique ActivitySaved to an array', () => {
        const activitySavedArray: IActivitySaved[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const activitySavedCollection: IActivitySaved[] = [sampleWithRequiredData];
        expectedResult = service.addActivitySavedToCollectionIfMissing(activitySavedCollection, ...activitySavedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const activitySaved: IActivitySaved = sampleWithRequiredData;
        const activitySaved2: IActivitySaved = sampleWithPartialData;
        expectedResult = service.addActivitySavedToCollectionIfMissing([], activitySaved, activitySaved2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activitySaved);
        expect(expectedResult).toContain(activitySaved2);
      });

      it('should accept null and undefined values', () => {
        const activitySaved: IActivitySaved = sampleWithRequiredData;
        expectedResult = service.addActivitySavedToCollectionIfMissing([], null, activitySaved, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activitySaved);
      });

      it('should return initial array if no ActivitySaved is added', () => {
        const activitySavedCollection: IActivitySaved[] = [sampleWithRequiredData];
        expectedResult = service.addActivitySavedToCollectionIfMissing(activitySavedCollection, undefined, null);
        expect(expectedResult).toEqual(activitySavedCollection);
      });
    });

    describe('compareActivitySaved', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActivitySaved(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActivitySaved(entity1, entity2);
        const compareResult2 = service.compareActivitySaved(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActivitySaved(entity1, entity2);
        const compareResult2 = service.compareActivitySaved(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActivitySaved(entity1, entity2);
        const compareResult2 = service.compareActivitySaved(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
