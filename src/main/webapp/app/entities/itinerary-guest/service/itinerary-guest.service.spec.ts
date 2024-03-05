import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItineraryGuest } from '../itinerary-guest.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../itinerary-guest.test-samples';

import { ItineraryGuestService } from './itinerary-guest.service';

const requireRestSample: IItineraryGuest = {
  ...sampleWithRequiredData,
};

describe('ItineraryGuest Service', () => {
  let service: ItineraryGuestService;
  let httpMock: HttpTestingController;
  let expectedResult: IItineraryGuest | IItineraryGuest[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItineraryGuestService);
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

    it('should create a ItineraryGuest', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itineraryGuest = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itineraryGuest).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItineraryGuest', () => {
      const itineraryGuest = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itineraryGuest).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItineraryGuest', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItineraryGuest', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItineraryGuest', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItineraryGuestToCollectionIfMissing', () => {
      it('should add a ItineraryGuest to an empty array', () => {
        const itineraryGuest: IItineraryGuest = sampleWithRequiredData;
        expectedResult = service.addItineraryGuestToCollectionIfMissing([], itineraryGuest);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itineraryGuest);
      });

      it('should not add a ItineraryGuest to an array that contains it', () => {
        const itineraryGuest: IItineraryGuest = sampleWithRequiredData;
        const itineraryGuestCollection: IItineraryGuest[] = [
          {
            ...itineraryGuest,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItineraryGuestToCollectionIfMissing(itineraryGuestCollection, itineraryGuest);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItineraryGuest to an array that doesn't contain it", () => {
        const itineraryGuest: IItineraryGuest = sampleWithRequiredData;
        const itineraryGuestCollection: IItineraryGuest[] = [sampleWithPartialData];
        expectedResult = service.addItineraryGuestToCollectionIfMissing(itineraryGuestCollection, itineraryGuest);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itineraryGuest);
      });

      it('should add only unique ItineraryGuest to an array', () => {
        const itineraryGuestArray: IItineraryGuest[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itineraryGuestCollection: IItineraryGuest[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryGuestToCollectionIfMissing(itineraryGuestCollection, ...itineraryGuestArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itineraryGuest: IItineraryGuest = sampleWithRequiredData;
        const itineraryGuest2: IItineraryGuest = sampleWithPartialData;
        expectedResult = service.addItineraryGuestToCollectionIfMissing([], itineraryGuest, itineraryGuest2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itineraryGuest);
        expect(expectedResult).toContain(itineraryGuest2);
      });

      it('should accept null and undefined values', () => {
        const itineraryGuest: IItineraryGuest = sampleWithRequiredData;
        expectedResult = service.addItineraryGuestToCollectionIfMissing([], null, itineraryGuest, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itineraryGuest);
      });

      it('should return initial array if no ItineraryGuest is added', () => {
        const itineraryGuestCollection: IItineraryGuest[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryGuestToCollectionIfMissing(itineraryGuestCollection, undefined, null);
        expect(expectedResult).toEqual(itineraryGuestCollection);
      });
    });

    describe('compareItineraryGuest', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItineraryGuest(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItineraryGuest(entity1, entity2);
        const compareResult2 = service.compareItineraryGuest(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItineraryGuest(entity1, entity2);
        const compareResult2 = service.compareItineraryGuest(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItineraryGuest(entity1, entity2);
        const compareResult2 = service.compareItineraryGuest(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
