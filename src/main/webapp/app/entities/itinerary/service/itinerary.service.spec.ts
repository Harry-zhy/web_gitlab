import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItinerary } from '../itinerary.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../itinerary.test-samples';

import { ItineraryService, RestItinerary } from './itinerary.service';

const requireRestSample: RestItinerary = {
  ...sampleWithRequiredData,
  startTime: sampleWithRequiredData.startTime?.toJSON(),
  endTime: sampleWithRequiredData.endTime?.toJSON(),
};

describe('Itinerary Service', () => {
  let service: ItineraryService;
  let httpMock: HttpTestingController;
  let expectedResult: IItinerary | IItinerary[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItineraryService);
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

    it('should create a Itinerary', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itinerary = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itinerary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Itinerary', () => {
      const itinerary = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itinerary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Itinerary', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Itinerary', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Itinerary', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItineraryToCollectionIfMissing', () => {
      it('should add a Itinerary to an empty array', () => {
        const itinerary: IItinerary = sampleWithRequiredData;
        expectedResult = service.addItineraryToCollectionIfMissing([], itinerary);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itinerary);
      });

      it('should not add a Itinerary to an array that contains it', () => {
        const itinerary: IItinerary = sampleWithRequiredData;
        const itineraryCollection: IItinerary[] = [
          {
            ...itinerary,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItineraryToCollectionIfMissing(itineraryCollection, itinerary);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Itinerary to an array that doesn't contain it", () => {
        const itinerary: IItinerary = sampleWithRequiredData;
        const itineraryCollection: IItinerary[] = [sampleWithPartialData];
        expectedResult = service.addItineraryToCollectionIfMissing(itineraryCollection, itinerary);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itinerary);
      });

      it('should add only unique Itinerary to an array', () => {
        const itineraryArray: IItinerary[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itineraryCollection: IItinerary[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryToCollectionIfMissing(itineraryCollection, ...itineraryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itinerary: IItinerary = sampleWithRequiredData;
        const itinerary2: IItinerary = sampleWithPartialData;
        expectedResult = service.addItineraryToCollectionIfMissing([], itinerary, itinerary2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itinerary);
        expect(expectedResult).toContain(itinerary2);
      });

      it('should accept null and undefined values', () => {
        const itinerary: IItinerary = sampleWithRequiredData;
        expectedResult = service.addItineraryToCollectionIfMissing([], null, itinerary, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itinerary);
      });

      it('should return initial array if no Itinerary is added', () => {
        const itineraryCollection: IItinerary[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryToCollectionIfMissing(itineraryCollection, undefined, null);
        expect(expectedResult).toEqual(itineraryCollection);
      });
    });

    describe('compareItinerary', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItinerary(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItinerary(entity1, entity2);
        const compareResult2 = service.compareItinerary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItinerary(entity1, entity2);
        const compareResult2 = service.compareItinerary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItinerary(entity1, entity2);
        const compareResult2 = service.compareItinerary(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
