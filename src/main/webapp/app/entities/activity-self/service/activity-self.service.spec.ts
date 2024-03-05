import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActivitySelf } from '../activity-self.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../activity-self.test-samples';

import { ActivitySelfService } from './activity-self.service';

const requireRestSample: IActivitySelf = {
  ...sampleWithRequiredData,
};

describe('ActivitySelf Service', () => {
  let service: ActivitySelfService;
  let httpMock: HttpTestingController;
  let expectedResult: IActivitySelf | IActivitySelf[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActivitySelfService);
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

    it('should create a ActivitySelf', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const activitySelf = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(activitySelf).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ActivitySelf', () => {
      const activitySelf = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(activitySelf).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ActivitySelf', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ActivitySelf', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ActivitySelf', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActivitySelfToCollectionIfMissing', () => {
      it('should add a ActivitySelf to an empty array', () => {
        const activitySelf: IActivitySelf = sampleWithRequiredData;
        expectedResult = service.addActivitySelfToCollectionIfMissing([], activitySelf);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activitySelf);
      });

      it('should not add a ActivitySelf to an array that contains it', () => {
        const activitySelf: IActivitySelf = sampleWithRequiredData;
        const activitySelfCollection: IActivitySelf[] = [
          {
            ...activitySelf,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActivitySelfToCollectionIfMissing(activitySelfCollection, activitySelf);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ActivitySelf to an array that doesn't contain it", () => {
        const activitySelf: IActivitySelf = sampleWithRequiredData;
        const activitySelfCollection: IActivitySelf[] = [sampleWithPartialData];
        expectedResult = service.addActivitySelfToCollectionIfMissing(activitySelfCollection, activitySelf);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activitySelf);
      });

      it('should add only unique ActivitySelf to an array', () => {
        const activitySelfArray: IActivitySelf[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const activitySelfCollection: IActivitySelf[] = [sampleWithRequiredData];
        expectedResult = service.addActivitySelfToCollectionIfMissing(activitySelfCollection, ...activitySelfArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const activitySelf: IActivitySelf = sampleWithRequiredData;
        const activitySelf2: IActivitySelf = sampleWithPartialData;
        expectedResult = service.addActivitySelfToCollectionIfMissing([], activitySelf, activitySelf2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activitySelf);
        expect(expectedResult).toContain(activitySelf2);
      });

      it('should accept null and undefined values', () => {
        const activitySelf: IActivitySelf = sampleWithRequiredData;
        expectedResult = service.addActivitySelfToCollectionIfMissing([], null, activitySelf, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activitySelf);
      });

      it('should return initial array if no ActivitySelf is added', () => {
        const activitySelfCollection: IActivitySelf[] = [sampleWithRequiredData];
        expectedResult = service.addActivitySelfToCollectionIfMissing(activitySelfCollection, undefined, null);
        expect(expectedResult).toEqual(activitySelfCollection);
      });
    });

    describe('compareActivitySelf', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActivitySelf(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActivitySelf(entity1, entity2);
        const compareResult2 = service.compareActivitySelf(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActivitySelf(entity1, entity2);
        const compareResult2 = service.compareActivitySelf(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActivitySelf(entity1, entity2);
        const compareResult2 = service.compareActivitySelf(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
