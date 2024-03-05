import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBookedCaterer } from '../booked-caterer.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../booked-caterer.test-samples';

import { BookedCatererService } from './booked-caterer.service';

const requireRestSample: IBookedCaterer = {
  ...sampleWithRequiredData,
};

describe('BookedCaterer Service', () => {
  let service: BookedCatererService;
  let httpMock: HttpTestingController;
  let expectedResult: IBookedCaterer | IBookedCaterer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BookedCatererService);
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

    it('should create a BookedCaterer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const bookedCaterer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bookedCaterer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BookedCaterer', () => {
      const bookedCaterer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bookedCaterer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BookedCaterer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BookedCaterer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BookedCaterer', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBookedCatererToCollectionIfMissing', () => {
      it('should add a BookedCaterer to an empty array', () => {
        const bookedCaterer: IBookedCaterer = sampleWithRequiredData;
        expectedResult = service.addBookedCatererToCollectionIfMissing([], bookedCaterer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bookedCaterer);
      });

      it('should not add a BookedCaterer to an array that contains it', () => {
        const bookedCaterer: IBookedCaterer = sampleWithRequiredData;
        const bookedCatererCollection: IBookedCaterer[] = [
          {
            ...bookedCaterer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBookedCatererToCollectionIfMissing(bookedCatererCollection, bookedCaterer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BookedCaterer to an array that doesn't contain it", () => {
        const bookedCaterer: IBookedCaterer = sampleWithRequiredData;
        const bookedCatererCollection: IBookedCaterer[] = [sampleWithPartialData];
        expectedResult = service.addBookedCatererToCollectionIfMissing(bookedCatererCollection, bookedCaterer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bookedCaterer);
      });

      it('should add only unique BookedCaterer to an array', () => {
        const bookedCatererArray: IBookedCaterer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bookedCatererCollection: IBookedCaterer[] = [sampleWithRequiredData];
        expectedResult = service.addBookedCatererToCollectionIfMissing(bookedCatererCollection, ...bookedCatererArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bookedCaterer: IBookedCaterer = sampleWithRequiredData;
        const bookedCaterer2: IBookedCaterer = sampleWithPartialData;
        expectedResult = service.addBookedCatererToCollectionIfMissing([], bookedCaterer, bookedCaterer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bookedCaterer);
        expect(expectedResult).toContain(bookedCaterer2);
      });

      it('should accept null and undefined values', () => {
        const bookedCaterer: IBookedCaterer = sampleWithRequiredData;
        expectedResult = service.addBookedCatererToCollectionIfMissing([], null, bookedCaterer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bookedCaterer);
      });

      it('should return initial array if no BookedCaterer is added', () => {
        const bookedCatererCollection: IBookedCaterer[] = [sampleWithRequiredData];
        expectedResult = service.addBookedCatererToCollectionIfMissing(bookedCatererCollection, undefined, null);
        expect(expectedResult).toEqual(bookedCatererCollection);
      });
    });

    describe('compareBookedCaterer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBookedCaterer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBookedCaterer(entity1, entity2);
        const compareResult2 = service.compareBookedCaterer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBookedCaterer(entity1, entity2);
        const compareResult2 = service.compareBookedCaterer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBookedCaterer(entity1, entity2);
        const compareResult2 = service.compareBookedCaterer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
