import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItineraryCaterer } from '../itinerary-caterer.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../itinerary-caterer.test-samples';

import { ItineraryCatererService, RestItineraryCaterer } from './itinerary-caterer.service';

const requireRestSample: RestItineraryCaterer = {
  ...sampleWithRequiredData,
  catererTime: sampleWithRequiredData.catererTime?.toJSON(),
};

describe('ItineraryCaterer Service', () => {
  let service: ItineraryCatererService;
  let httpMock: HttpTestingController;
  let expectedResult: IItineraryCaterer | IItineraryCaterer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItineraryCatererService);
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

    it('should create a ItineraryCaterer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itineraryCaterer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itineraryCaterer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItineraryCaterer', () => {
      const itineraryCaterer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itineraryCaterer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItineraryCaterer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItineraryCaterer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItineraryCaterer', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItineraryCatererToCollectionIfMissing', () => {
      it('should add a ItineraryCaterer to an empty array', () => {
        const itineraryCaterer: IItineraryCaterer = sampleWithRequiredData;
        expectedResult = service.addItineraryCatererToCollectionIfMissing([], itineraryCaterer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itineraryCaterer);
      });

      it('should not add a ItineraryCaterer to an array that contains it', () => {
        const itineraryCaterer: IItineraryCaterer = sampleWithRequiredData;
        const itineraryCatererCollection: IItineraryCaterer[] = [
          {
            ...itineraryCaterer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItineraryCatererToCollectionIfMissing(itineraryCatererCollection, itineraryCaterer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItineraryCaterer to an array that doesn't contain it", () => {
        const itineraryCaterer: IItineraryCaterer = sampleWithRequiredData;
        const itineraryCatererCollection: IItineraryCaterer[] = [sampleWithPartialData];
        expectedResult = service.addItineraryCatererToCollectionIfMissing(itineraryCatererCollection, itineraryCaterer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itineraryCaterer);
      });

      it('should add only unique ItineraryCaterer to an array', () => {
        const itineraryCatererArray: IItineraryCaterer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itineraryCatererCollection: IItineraryCaterer[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryCatererToCollectionIfMissing(itineraryCatererCollection, ...itineraryCatererArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itineraryCaterer: IItineraryCaterer = sampleWithRequiredData;
        const itineraryCaterer2: IItineraryCaterer = sampleWithPartialData;
        expectedResult = service.addItineraryCatererToCollectionIfMissing([], itineraryCaterer, itineraryCaterer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itineraryCaterer);
        expect(expectedResult).toContain(itineraryCaterer2);
      });

      it('should accept null and undefined values', () => {
        const itineraryCaterer: IItineraryCaterer = sampleWithRequiredData;
        expectedResult = service.addItineraryCatererToCollectionIfMissing([], null, itineraryCaterer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itineraryCaterer);
      });

      it('should return initial array if no ItineraryCaterer is added', () => {
        const itineraryCatererCollection: IItineraryCaterer[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryCatererToCollectionIfMissing(itineraryCatererCollection, undefined, null);
        expect(expectedResult).toEqual(itineraryCatererCollection);
      });
    });

    describe('compareItineraryCaterer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItineraryCaterer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItineraryCaterer(entity1, entity2);
        const compareResult2 = service.compareItineraryCaterer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItineraryCaterer(entity1, entity2);
        const compareResult2 = service.compareItineraryCaterer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItineraryCaterer(entity1, entity2);
        const compareResult2 = service.compareItineraryCaterer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
