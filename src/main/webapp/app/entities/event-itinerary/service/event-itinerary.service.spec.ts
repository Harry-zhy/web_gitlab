import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEventItinerary } from '../event-itinerary.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../event-itinerary.test-samples';

import { EventItineraryService } from './event-itinerary.service';

const requireRestSample: IEventItinerary = {
  ...sampleWithRequiredData,
};

describe('EventItinerary Service', () => {
  let service: EventItineraryService;
  let httpMock: HttpTestingController;
  let expectedResult: IEventItinerary | IEventItinerary[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventItineraryService);
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

    it('should create a EventItinerary', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const eventItinerary = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(eventItinerary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventItinerary', () => {
      const eventItinerary = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(eventItinerary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EventItinerary', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EventItinerary', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EventItinerary', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEventItineraryToCollectionIfMissing', () => {
      it('should add a EventItinerary to an empty array', () => {
        const eventItinerary: IEventItinerary = sampleWithRequiredData;
        expectedResult = service.addEventItineraryToCollectionIfMissing([], eventItinerary);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventItinerary);
      });

      it('should not add a EventItinerary to an array that contains it', () => {
        const eventItinerary: IEventItinerary = sampleWithRequiredData;
        const eventItineraryCollection: IEventItinerary[] = [
          {
            ...eventItinerary,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEventItineraryToCollectionIfMissing(eventItineraryCollection, eventItinerary);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventItinerary to an array that doesn't contain it", () => {
        const eventItinerary: IEventItinerary = sampleWithRequiredData;
        const eventItineraryCollection: IEventItinerary[] = [sampleWithPartialData];
        expectedResult = service.addEventItineraryToCollectionIfMissing(eventItineraryCollection, eventItinerary);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventItinerary);
      });

      it('should add only unique EventItinerary to an array', () => {
        const eventItineraryArray: IEventItinerary[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const eventItineraryCollection: IEventItinerary[] = [sampleWithRequiredData];
        expectedResult = service.addEventItineraryToCollectionIfMissing(eventItineraryCollection, ...eventItineraryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventItinerary: IEventItinerary = sampleWithRequiredData;
        const eventItinerary2: IEventItinerary = sampleWithPartialData;
        expectedResult = service.addEventItineraryToCollectionIfMissing([], eventItinerary, eventItinerary2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventItinerary);
        expect(expectedResult).toContain(eventItinerary2);
      });

      it('should accept null and undefined values', () => {
        const eventItinerary: IEventItinerary = sampleWithRequiredData;
        expectedResult = service.addEventItineraryToCollectionIfMissing([], null, eventItinerary, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventItinerary);
      });

      it('should return initial array if no EventItinerary is added', () => {
        const eventItineraryCollection: IEventItinerary[] = [sampleWithRequiredData];
        expectedResult = service.addEventItineraryToCollectionIfMissing(eventItineraryCollection, undefined, null);
        expect(expectedResult).toEqual(eventItineraryCollection);
      });
    });

    describe('compareEventItinerary', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEventItinerary(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEventItinerary(entity1, entity2);
        const compareResult2 = service.compareEventItinerary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEventItinerary(entity1, entity2);
        const compareResult2 = service.compareEventItinerary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEventItinerary(entity1, entity2);
        const compareResult2 = service.compareEventItinerary(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
