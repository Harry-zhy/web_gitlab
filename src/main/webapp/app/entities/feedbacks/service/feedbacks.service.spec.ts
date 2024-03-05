import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFeedbacks } from '../feedbacks.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../feedbacks.test-samples';

import { FeedbacksService, RestFeedbacks } from './feedbacks.service';

const requireRestSample: RestFeedbacks = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('Feedbacks Service', () => {
  let service: FeedbacksService;
  let httpMock: HttpTestingController;
  let expectedResult: IFeedbacks | IFeedbacks[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FeedbacksService);
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

    it('should create a Feedbacks', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const feedbacks = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(feedbacks).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Feedbacks', () => {
      const feedbacks = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(feedbacks).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Feedbacks', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Feedbacks', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Feedbacks', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFeedbacksToCollectionIfMissing', () => {
      it('should add a Feedbacks to an empty array', () => {
        const feedbacks: IFeedbacks = sampleWithRequiredData;
        expectedResult = service.addFeedbacksToCollectionIfMissing([], feedbacks);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feedbacks);
      });

      it('should not add a Feedbacks to an array that contains it', () => {
        const feedbacks: IFeedbacks = sampleWithRequiredData;
        const feedbacksCollection: IFeedbacks[] = [
          {
            ...feedbacks,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFeedbacksToCollectionIfMissing(feedbacksCollection, feedbacks);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Feedbacks to an array that doesn't contain it", () => {
        const feedbacks: IFeedbacks = sampleWithRequiredData;
        const feedbacksCollection: IFeedbacks[] = [sampleWithPartialData];
        expectedResult = service.addFeedbacksToCollectionIfMissing(feedbacksCollection, feedbacks);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feedbacks);
      });

      it('should add only unique Feedbacks to an array', () => {
        const feedbacksArray: IFeedbacks[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const feedbacksCollection: IFeedbacks[] = [sampleWithRequiredData];
        expectedResult = service.addFeedbacksToCollectionIfMissing(feedbacksCollection, ...feedbacksArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const feedbacks: IFeedbacks = sampleWithRequiredData;
        const feedbacks2: IFeedbacks = sampleWithPartialData;
        expectedResult = service.addFeedbacksToCollectionIfMissing([], feedbacks, feedbacks2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(feedbacks);
        expect(expectedResult).toContain(feedbacks2);
      });

      it('should accept null and undefined values', () => {
        const feedbacks: IFeedbacks = sampleWithRequiredData;
        expectedResult = service.addFeedbacksToCollectionIfMissing([], null, feedbacks, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(feedbacks);
      });

      it('should return initial array if no Feedbacks is added', () => {
        const feedbacksCollection: IFeedbacks[] = [sampleWithRequiredData];
        expectedResult = service.addFeedbacksToCollectionIfMissing(feedbacksCollection, undefined, null);
        expect(expectedResult).toEqual(feedbacksCollection);
      });
    });

    describe('compareFeedbacks', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFeedbacks(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFeedbacks(entity1, entity2);
        const compareResult2 = service.compareFeedbacks(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFeedbacks(entity1, entity2);
        const compareResult2 = service.compareFeedbacks(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFeedbacks(entity1, entity2);
        const compareResult2 = service.compareFeedbacks(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
