import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActivityIdea } from '../activity-idea.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../activity-idea.test-samples';

import { ActivityIdeaService } from './activity-idea.service';

const requireRestSample: IActivityIdea = {
  ...sampleWithRequiredData,
};

describe('ActivityIdea Service', () => {
  let service: ActivityIdeaService;
  let httpMock: HttpTestingController;
  let expectedResult: IActivityIdea | IActivityIdea[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActivityIdeaService);
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

    it('should create a ActivityIdea', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const activityIdea = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(activityIdea).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ActivityIdea', () => {
      const activityIdea = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(activityIdea).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ActivityIdea', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ActivityIdea', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ActivityIdea', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActivityIdeaToCollectionIfMissing', () => {
      it('should add a ActivityIdea to an empty array', () => {
        const activityIdea: IActivityIdea = sampleWithRequiredData;
        expectedResult = service.addActivityIdeaToCollectionIfMissing([], activityIdea);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activityIdea);
      });

      it('should not add a ActivityIdea to an array that contains it', () => {
        const activityIdea: IActivityIdea = sampleWithRequiredData;
        const activityIdeaCollection: IActivityIdea[] = [
          {
            ...activityIdea,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActivityIdeaToCollectionIfMissing(activityIdeaCollection, activityIdea);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ActivityIdea to an array that doesn't contain it", () => {
        const activityIdea: IActivityIdea = sampleWithRequiredData;
        const activityIdeaCollection: IActivityIdea[] = [sampleWithPartialData];
        expectedResult = service.addActivityIdeaToCollectionIfMissing(activityIdeaCollection, activityIdea);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activityIdea);
      });

      it('should add only unique ActivityIdea to an array', () => {
        const activityIdeaArray: IActivityIdea[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const activityIdeaCollection: IActivityIdea[] = [sampleWithRequiredData];
        expectedResult = service.addActivityIdeaToCollectionIfMissing(activityIdeaCollection, ...activityIdeaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const activityIdea: IActivityIdea = sampleWithRequiredData;
        const activityIdea2: IActivityIdea = sampleWithPartialData;
        expectedResult = service.addActivityIdeaToCollectionIfMissing([], activityIdea, activityIdea2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activityIdea);
        expect(expectedResult).toContain(activityIdea2);
      });

      it('should accept null and undefined values', () => {
        const activityIdea: IActivityIdea = sampleWithRequiredData;
        expectedResult = service.addActivityIdeaToCollectionIfMissing([], null, activityIdea, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activityIdea);
      });

      it('should return initial array if no ActivityIdea is added', () => {
        const activityIdeaCollection: IActivityIdea[] = [sampleWithRequiredData];
        expectedResult = service.addActivityIdeaToCollectionIfMissing(activityIdeaCollection, undefined, null);
        expect(expectedResult).toEqual(activityIdeaCollection);
      });
    });

    describe('compareActivityIdea', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActivityIdea(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActivityIdea(entity1, entity2);
        const compareResult2 = service.compareActivityIdea(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActivityIdea(entity1, entity2);
        const compareResult2 = service.compareActivityIdea(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActivityIdea(entity1, entity2);
        const compareResult2 = service.compareActivityIdea(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
