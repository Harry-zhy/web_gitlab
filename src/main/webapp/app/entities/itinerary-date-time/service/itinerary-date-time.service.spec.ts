import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItineraryDateTime } from '../itinerary-date-time.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../itinerary-date-time.test-samples';

import { ItineraryDateTimeService, RestItineraryDateTime } from './itinerary-date-time.service';

const requireRestSample: RestItineraryDateTime = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
  startTime: sampleWithRequiredData.startTime?.toJSON(),
  endTime: sampleWithRequiredData.endTime?.toJSON(),
};

describe('ItineraryDateTime Service', () => {
  let service: ItineraryDateTimeService;
  let httpMock: HttpTestingController;
  let expectedResult: IItineraryDateTime | IItineraryDateTime[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItineraryDateTimeService);
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

    it('should create a ItineraryDateTime', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itineraryDateTime = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itineraryDateTime).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItineraryDateTime', () => {
      const itineraryDateTime = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itineraryDateTime).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItineraryDateTime', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItineraryDateTime', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItineraryDateTime', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItineraryDateTimeToCollectionIfMissing', () => {
      it('should add a ItineraryDateTime to an empty array', () => {
        const itineraryDateTime: IItineraryDateTime = sampleWithRequiredData;
        expectedResult = service.addItineraryDateTimeToCollectionIfMissing([], itineraryDateTime);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itineraryDateTime);
      });

      it('should not add a ItineraryDateTime to an array that contains it', () => {
        const itineraryDateTime: IItineraryDateTime = sampleWithRequiredData;
        const itineraryDateTimeCollection: IItineraryDateTime[] = [
          {
            ...itineraryDateTime,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItineraryDateTimeToCollectionIfMissing(itineraryDateTimeCollection, itineraryDateTime);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItineraryDateTime to an array that doesn't contain it", () => {
        const itineraryDateTime: IItineraryDateTime = sampleWithRequiredData;
        const itineraryDateTimeCollection: IItineraryDateTime[] = [sampleWithPartialData];
        expectedResult = service.addItineraryDateTimeToCollectionIfMissing(itineraryDateTimeCollection, itineraryDateTime);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itineraryDateTime);
      });

      it('should add only unique ItineraryDateTime to an array', () => {
        const itineraryDateTimeArray: IItineraryDateTime[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itineraryDateTimeCollection: IItineraryDateTime[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryDateTimeToCollectionIfMissing(itineraryDateTimeCollection, ...itineraryDateTimeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itineraryDateTime: IItineraryDateTime = sampleWithRequiredData;
        const itineraryDateTime2: IItineraryDateTime = sampleWithPartialData;
        expectedResult = service.addItineraryDateTimeToCollectionIfMissing([], itineraryDateTime, itineraryDateTime2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itineraryDateTime);
        expect(expectedResult).toContain(itineraryDateTime2);
      });

      it('should accept null and undefined values', () => {
        const itineraryDateTime: IItineraryDateTime = sampleWithRequiredData;
        expectedResult = service.addItineraryDateTimeToCollectionIfMissing([], null, itineraryDateTime, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itineraryDateTime);
      });

      it('should return initial array if no ItineraryDateTime is added', () => {
        const itineraryDateTimeCollection: IItineraryDateTime[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryDateTimeToCollectionIfMissing(itineraryDateTimeCollection, undefined, null);
        expect(expectedResult).toEqual(itineraryDateTimeCollection);
      });
    });

    describe('compareItineraryDateTime', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItineraryDateTime(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItineraryDateTime(entity1, entity2);
        const compareResult2 = service.compareItineraryDateTime(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItineraryDateTime(entity1, entity2);
        const compareResult2 = service.compareItineraryDateTime(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItineraryDateTime(entity1, entity2);
        const compareResult2 = service.compareItineraryDateTime(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
