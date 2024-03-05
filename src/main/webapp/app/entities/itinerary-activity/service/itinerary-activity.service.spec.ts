import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItineraryActivity } from '../itinerary-activity.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../itinerary-activity.test-samples';

import { ItineraryActivityService, RestItineraryActivity } from './itinerary-activity.service';

const requireRestSample: RestItineraryActivity = {
  ...sampleWithRequiredData,
  activityTime: sampleWithRequiredData.activityTime?.toJSON(),
};

describe('ItineraryActivity Service', () => {
  let service: ItineraryActivityService;
  let httpMock: HttpTestingController;
  let expectedResult: IItineraryActivity | IItineraryActivity[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItineraryActivityService);
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

    it('should create a ItineraryActivity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itineraryActivity = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itineraryActivity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItineraryActivity', () => {
      const itineraryActivity = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itineraryActivity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItineraryActivity', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItineraryActivity', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItineraryActivity', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItineraryActivityToCollectionIfMissing', () => {
      it('should add a ItineraryActivity to an empty array', () => {
        const itineraryActivity: IItineraryActivity = sampleWithRequiredData;
        expectedResult = service.addItineraryActivityToCollectionIfMissing([], itineraryActivity);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itineraryActivity);
      });

      it('should not add a ItineraryActivity to an array that contains it', () => {
        const itineraryActivity: IItineraryActivity = sampleWithRequiredData;
        const itineraryActivityCollection: IItineraryActivity[] = [
          {
            ...itineraryActivity,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItineraryActivityToCollectionIfMissing(itineraryActivityCollection, itineraryActivity);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItineraryActivity to an array that doesn't contain it", () => {
        const itineraryActivity: IItineraryActivity = sampleWithRequiredData;
        const itineraryActivityCollection: IItineraryActivity[] = [sampleWithPartialData];
        expectedResult = service.addItineraryActivityToCollectionIfMissing(itineraryActivityCollection, itineraryActivity);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itineraryActivity);
      });

      it('should add only unique ItineraryActivity to an array', () => {
        const itineraryActivityArray: IItineraryActivity[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itineraryActivityCollection: IItineraryActivity[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryActivityToCollectionIfMissing(itineraryActivityCollection, ...itineraryActivityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itineraryActivity: IItineraryActivity = sampleWithRequiredData;
        const itineraryActivity2: IItineraryActivity = sampleWithPartialData;
        expectedResult = service.addItineraryActivityToCollectionIfMissing([], itineraryActivity, itineraryActivity2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itineraryActivity);
        expect(expectedResult).toContain(itineraryActivity2);
      });

      it('should accept null and undefined values', () => {
        const itineraryActivity: IItineraryActivity = sampleWithRequiredData;
        expectedResult = service.addItineraryActivityToCollectionIfMissing([], null, itineraryActivity, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itineraryActivity);
      });

      it('should return initial array if no ItineraryActivity is added', () => {
        const itineraryActivityCollection: IItineraryActivity[] = [sampleWithRequiredData];
        expectedResult = service.addItineraryActivityToCollectionIfMissing(itineraryActivityCollection, undefined, null);
        expect(expectedResult).toEqual(itineraryActivityCollection);
      });
    });

    describe('compareItineraryActivity', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItineraryActivity(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItineraryActivity(entity1, entity2);
        const compareResult2 = service.compareItineraryActivity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItineraryActivity(entity1, entity2);
        const compareResult2 = service.compareItineraryActivity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItineraryActivity(entity1, entity2);
        const compareResult2 = service.compareItineraryActivity(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
