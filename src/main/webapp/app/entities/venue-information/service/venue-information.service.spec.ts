import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVenueInformation } from '../venue-information.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../venue-information.test-samples';

import { VenueInformationService, RestVenueInformation } from './venue-information.service';

const requireRestSample: RestVenueInformation = {
  ...sampleWithRequiredData,
  openingTimeFrom: sampleWithRequiredData.openingTimeFrom?.toJSON(),
  openingTimeUntil: sampleWithRequiredData.openingTimeUntil?.toJSON(),
};

describe('VenueInformation Service', () => {
  let service: VenueInformationService;
  let httpMock: HttpTestingController;
  let expectedResult: IVenueInformation | IVenueInformation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VenueInformationService);
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

    it('should create a VenueInformation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const venueInformation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(venueInformation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VenueInformation', () => {
      const venueInformation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(venueInformation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VenueInformation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VenueInformation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VenueInformation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVenueInformationToCollectionIfMissing', () => {
      it('should add a VenueInformation to an empty array', () => {
        const venueInformation: IVenueInformation = sampleWithRequiredData;
        expectedResult = service.addVenueInformationToCollectionIfMissing([], venueInformation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(venueInformation);
      });

      it('should not add a VenueInformation to an array that contains it', () => {
        const venueInformation: IVenueInformation = sampleWithRequiredData;
        const venueInformationCollection: IVenueInformation[] = [
          {
            ...venueInformation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVenueInformationToCollectionIfMissing(venueInformationCollection, venueInformation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VenueInformation to an array that doesn't contain it", () => {
        const venueInformation: IVenueInformation = sampleWithRequiredData;
        const venueInformationCollection: IVenueInformation[] = [sampleWithPartialData];
        expectedResult = service.addVenueInformationToCollectionIfMissing(venueInformationCollection, venueInformation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(venueInformation);
      });

      it('should add only unique VenueInformation to an array', () => {
        const venueInformationArray: IVenueInformation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const venueInformationCollection: IVenueInformation[] = [sampleWithRequiredData];
        expectedResult = service.addVenueInformationToCollectionIfMissing(venueInformationCollection, ...venueInformationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const venueInformation: IVenueInformation = sampleWithRequiredData;
        const venueInformation2: IVenueInformation = sampleWithPartialData;
        expectedResult = service.addVenueInformationToCollectionIfMissing([], venueInformation, venueInformation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(venueInformation);
        expect(expectedResult).toContain(venueInformation2);
      });

      it('should accept null and undefined values', () => {
        const venueInformation: IVenueInformation = sampleWithRequiredData;
        expectedResult = service.addVenueInformationToCollectionIfMissing([], null, venueInformation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(venueInformation);
      });

      it('should return initial array if no VenueInformation is added', () => {
        const venueInformationCollection: IVenueInformation[] = [sampleWithRequiredData];
        expectedResult = service.addVenueInformationToCollectionIfMissing(venueInformationCollection, undefined, null);
        expect(expectedResult).toEqual(venueInformationCollection);
      });
    });

    describe('compareVenueInformation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVenueInformation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVenueInformation(entity1, entity2);
        const compareResult2 = service.compareVenueInformation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVenueInformation(entity1, entity2);
        const compareResult2 = service.compareVenueInformation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVenueInformation(entity1, entity2);
        const compareResult2 = service.compareVenueInformation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
