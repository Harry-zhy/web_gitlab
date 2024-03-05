import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItineraryVenue } from '../itinerary-venue.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../itinerary-venue.test-samples';

import { ItineraryVenueService } from './itinerary-venue.service';

const requireRestSample: IItineraryVenue = {
  ...sampleWithRequiredData,
};

describe('ItineraryVenue Service', () => {
  let service: ItineraryVenueService;
  let httpMock: HttpTestingController;
  let expectedResult: IItineraryVenue | IItineraryVenue[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItineraryVenueService);
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

    it('should create a ItineraryVenue', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itineraryVenue = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itineraryVenue).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItineraryVenue', () => {
      const itineraryVenue = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itineraryVenue).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItineraryVenue', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItineraryVenue', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItineraryVenue', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItineraryVenueToCollectionIfMissing', () => {
      it('should add a ItineraryVenue to an empty array', () => {
        const itineraryVenue: IItineraryVenue = sampleWithRequiredData;
        expectedResult = service.addItineraryVenueToCollectionIfMissing([], itineraryVenue);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itineraryVenue);
      });

      it('should not add a ItineraryVenue to an array that contains it', () => {
        const itineraryVenue: IItineraryVenue = sampleWithRequiredData;
        const itineraryVenueCollection: IItineraryVenue[] = [
          {
            ...itineraryVenue,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItineraryVenueToCollectionIfMissing(itineraryVenueCollection, itineraryVenue);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItineraryVenue to an array that doesn't contain it", () => {
        const itineraryVenue: IItineraryVenue = sampleWithRequiredData;
        const itineraryVenueCollection: IItineraryVenue[] = [sampleWithPartialData];
        expectedResult = service.addItineraryVenueToCollectionIfMissing(itineraryVenueCollection, itineraryVenue);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itineraryVenue);
      });

      it('should add only unique ItineraryVenue to an array', () => {
        const itineraryVenueArray: IItineraryVenue[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itineraryVenueCollection: IItineraryVenue[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryVenueToCollectionIfMissing(itineraryVenueCollection, ...itineraryVenueArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itineraryVenue: IItineraryVenue = sampleWithRequiredData;
        const itineraryVenue2: IItineraryVenue = sampleWithPartialData;
        expectedResult = service.addItineraryVenueToCollectionIfMissing([], itineraryVenue, itineraryVenue2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itineraryVenue);
        expect(expectedResult).toContain(itineraryVenue2);
      });

      it('should accept null and undefined values', () => {
        const itineraryVenue: IItineraryVenue = sampleWithRequiredData;
        expectedResult = service.addItineraryVenueToCollectionIfMissing([], null, itineraryVenue, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itineraryVenue);
      });

      it('should return initial array if no ItineraryVenue is added', () => {
        const itineraryVenueCollection: IItineraryVenue[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryVenueToCollectionIfMissing(itineraryVenueCollection, undefined, null);
        expect(expectedResult).toEqual(itineraryVenueCollection);
      });
    });

    describe('compareItineraryVenue', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItineraryVenue(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItineraryVenue(entity1, entity2);
        const compareResult2 = service.compareItineraryVenue(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItineraryVenue(entity1, entity2);
        const compareResult2 = service.compareItineraryVenue(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItineraryVenue(entity1, entity2);
        const compareResult2 = service.compareItineraryVenue(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
