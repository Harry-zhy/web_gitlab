import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActivityContactDetails } from '../activity-contact-details.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../activity-contact-details.test-samples';

import { ActivityContactDetailsService } from './activity-contact-details.service';

const requireRestSample: IActivityContactDetails = {
  ...sampleWithRequiredData,
};

describe('ActivityContactDetails Service', () => {
  let service: ActivityContactDetailsService;
  let httpMock: HttpTestingController;
  let expectedResult: IActivityContactDetails | IActivityContactDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActivityContactDetailsService);
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

    it('should create a ActivityContactDetails', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const activityContactDetails = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(activityContactDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ActivityContactDetails', () => {
      const activityContactDetails = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(activityContactDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ActivityContactDetails', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ActivityContactDetails', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ActivityContactDetails', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActivityContactDetailsToCollectionIfMissing', () => {
      it('should add a ActivityContactDetails to an empty array', () => {
        const activityContactDetails: IActivityContactDetails = sampleWithRequiredData;
        expectedResult = service.addActivityContactDetailsToCollectionIfMissing([], activityContactDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activityContactDetails);
      });

      it('should not add a ActivityContactDetails to an array that contains it', () => {
        const activityContactDetails: IActivityContactDetails = sampleWithRequiredData;
        const activityContactDetailsCollection: IActivityContactDetails[] = [
          {
            ...activityContactDetails,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActivityContactDetailsToCollectionIfMissing(activityContactDetailsCollection, activityContactDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ActivityContactDetails to an array that doesn't contain it", () => {
        const activityContactDetails: IActivityContactDetails = sampleWithRequiredData;
        const activityContactDetailsCollection: IActivityContactDetails[] = [sampleWithPartialData];
        expectedResult = service.addActivityContactDetailsToCollectionIfMissing(activityContactDetailsCollection, activityContactDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activityContactDetails);
      });

      it('should add only unique ActivityContactDetails to an array', () => {
        const activityContactDetailsArray: IActivityContactDetails[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const activityContactDetailsCollection: IActivityContactDetails[] = [sampleWithRequiredData];
        expectedResult = service.addActivityContactDetailsToCollectionIfMissing(
          activityContactDetailsCollection,
          ...activityContactDetailsArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const activityContactDetails: IActivityContactDetails = sampleWithRequiredData;
        const activityContactDetails2: IActivityContactDetails = sampleWithPartialData;
        expectedResult = service.addActivityContactDetailsToCollectionIfMissing([], activityContactDetails, activityContactDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activityContactDetails);
        expect(expectedResult).toContain(activityContactDetails2);
      });

      it('should accept null and undefined values', () => {
        const activityContactDetails: IActivityContactDetails = sampleWithRequiredData;
        expectedResult = service.addActivityContactDetailsToCollectionIfMissing([], null, activityContactDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activityContactDetails);
      });

      it('should return initial array if no ActivityContactDetails is added', () => {
        const activityContactDetailsCollection: IActivityContactDetails[] = [sampleWithRequiredData];
        expectedResult = service.addActivityContactDetailsToCollectionIfMissing(activityContactDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(activityContactDetailsCollection);
      });
    });

    describe('compareActivityContactDetails', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActivityContactDetails(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActivityContactDetails(entity1, entity2);
        const compareResult2 = service.compareActivityContactDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActivityContactDetails(entity1, entity2);
        const compareResult2 = service.compareActivityContactDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActivityContactDetails(entity1, entity2);
        const compareResult2 = service.compareActivityContactDetails(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
