import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOneFeedback } from '../one-feedback.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../one-feedback.test-samples';

import { OneFeedbackService } from './one-feedback.service';

const requireRestSample: IOneFeedback = {
  ...sampleWithRequiredData,
};

describe('OneFeedback Service', () => {
  let service: OneFeedbackService;
  let httpMock: HttpTestingController;
  let expectedResult: IOneFeedback | IOneFeedback[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OneFeedbackService);
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

    it('should create a OneFeedback', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const oneFeedback = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(oneFeedback).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OneFeedback', () => {
      const oneFeedback = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(oneFeedback).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OneFeedback', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OneFeedback', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OneFeedback', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOneFeedbackToCollectionIfMissing', () => {
      it('should add a OneFeedback to an empty array', () => {
        const oneFeedback: IOneFeedback = sampleWithRequiredData;
        expectedResult = service.addOneFeedbackToCollectionIfMissing([], oneFeedback);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(oneFeedback);
      });

      it('should not add a OneFeedback to an array that contains it', () => {
        const oneFeedback: IOneFeedback = sampleWithRequiredData;
        const oneFeedbackCollection: IOneFeedback[] = [
          {
            ...oneFeedback,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOneFeedbackToCollectionIfMissing(oneFeedbackCollection, oneFeedback);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OneFeedback to an array that doesn't contain it", () => {
        const oneFeedback: IOneFeedback = sampleWithRequiredData;
        const oneFeedbackCollection: IOneFeedback[] = [sampleWithPartialData];
        expectedResult = service.addOneFeedbackToCollectionIfMissing(oneFeedbackCollection, oneFeedback);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(oneFeedback);
      });

      it('should add only unique OneFeedback to an array', () => {
        const oneFeedbackArray: IOneFeedback[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const oneFeedbackCollection: IOneFeedback[] = [sampleWithRequiredData];
        expectedResult = service.addOneFeedbackToCollectionIfMissing(oneFeedbackCollection, ...oneFeedbackArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const oneFeedback: IOneFeedback = sampleWithRequiredData;
        const oneFeedback2: IOneFeedback = sampleWithPartialData;
        expectedResult = service.addOneFeedbackToCollectionIfMissing([], oneFeedback, oneFeedback2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(oneFeedback);
        expect(expectedResult).toContain(oneFeedback2);
      });

      it('should accept null and undefined values', () => {
        const oneFeedback: IOneFeedback = sampleWithRequiredData;
        expectedResult = service.addOneFeedbackToCollectionIfMissing([], null, oneFeedback, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(oneFeedback);
      });

      it('should return initial array if no OneFeedback is added', () => {
        const oneFeedbackCollection: IOneFeedback[] = [sampleWithRequiredData];
        expectedResult = service.addOneFeedbackToCollectionIfMissing(oneFeedbackCollection, undefined, null);
        expect(expectedResult).toEqual(oneFeedbackCollection);
      });
    });

    describe('compareOneFeedback', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOneFeedback(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOneFeedback(entity1, entity2);
        const compareResult2 = service.compareOneFeedback(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOneFeedback(entity1, entity2);
        const compareResult2 = service.compareOneFeedback(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOneFeedback(entity1, entity2);
        const compareResult2 = service.compareOneFeedback(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
