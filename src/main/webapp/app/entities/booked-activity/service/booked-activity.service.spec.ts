import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBookedActivity } from '../booked-activity.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../booked-activity.test-samples';

import { BookedActivityService } from './booked-activity.service';

const requireRestSample: IBookedActivity = {
  ...sampleWithRequiredData,
};

describe('BookedActivity Service', () => {
  let service: BookedActivityService;
  let httpMock: HttpTestingController;
  let expectedResult: IBookedActivity | IBookedActivity[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BookedActivityService);
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

    it('should create a BookedActivity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const bookedActivity = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bookedActivity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BookedActivity', () => {
      const bookedActivity = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bookedActivity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BookedActivity', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BookedActivity', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BookedActivity', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBookedActivityToCollectionIfMissing', () => {
      it('should add a BookedActivity to an empty array', () => {
        const bookedActivity: IBookedActivity = sampleWithRequiredData;
        expectedResult = service.addBookedActivityToCollectionIfMissing([], bookedActivity);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bookedActivity);
      });

      it('should not add a BookedActivity to an array that contains it', () => {
        const bookedActivity: IBookedActivity = sampleWithRequiredData;
        const bookedActivityCollection: IBookedActivity[] = [
          {
            ...bookedActivity,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBookedActivityToCollectionIfMissing(bookedActivityCollection, bookedActivity);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BookedActivity to an array that doesn't contain it", () => {
        const bookedActivity: IBookedActivity = sampleWithRequiredData;
        const bookedActivityCollection: IBookedActivity[] = [sampleWithPartialData];
        expectedResult = service.addBookedActivityToCollectionIfMissing(bookedActivityCollection, bookedActivity);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bookedActivity);
      });

      it('should add only unique BookedActivity to an array', () => {
        const bookedActivityArray: IBookedActivity[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bookedActivityCollection: IBookedActivity[] = [sampleWithRequiredData];
        expectedResult = service.addBookedActivityToCollectionIfMissing(bookedActivityCollection, ...bookedActivityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bookedActivity: IBookedActivity = sampleWithRequiredData;
        const bookedActivity2: IBookedActivity = sampleWithPartialData;
        expectedResult = service.addBookedActivityToCollectionIfMissing([], bookedActivity, bookedActivity2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bookedActivity);
        expect(expectedResult).toContain(bookedActivity2);
      });

      it('should accept null and undefined values', () => {
        const bookedActivity: IBookedActivity = sampleWithRequiredData;
        expectedResult = service.addBookedActivityToCollectionIfMissing([], null, bookedActivity, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bookedActivity);
      });

      it('should return initial array if no BookedActivity is added', () => {
        const bookedActivityCollection: IBookedActivity[] = [sampleWithRequiredData];
        expectedResult = service.addBookedActivityToCollectionIfMissing(bookedActivityCollection, undefined, null);
        expect(expectedResult).toEqual(bookedActivityCollection);
      });
    });

    describe('compareBookedActivity', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBookedActivity(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBookedActivity(entity1, entity2);
        const compareResult2 = service.compareBookedActivity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBookedActivity(entity1, entity2);
        const compareResult2 = service.compareBookedActivity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBookedActivity(entity1, entity2);
        const compareResult2 = service.compareBookedActivity(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
