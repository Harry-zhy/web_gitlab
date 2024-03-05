import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDecoContactDetails } from '../deco-contact-details.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../deco-contact-details.test-samples';

import { DecoContactDetailsService } from './deco-contact-details.service';

const requireRestSample: IDecoContactDetails = {
  ...sampleWithRequiredData,
};

describe('DecoContactDetails Service', () => {
  let service: DecoContactDetailsService;
  let httpMock: HttpTestingController;
  let expectedResult: IDecoContactDetails | IDecoContactDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DecoContactDetailsService);
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

    it('should create a DecoContactDetails', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const decoContactDetails = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(decoContactDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DecoContactDetails', () => {
      const decoContactDetails = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(decoContactDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DecoContactDetails', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DecoContactDetails', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DecoContactDetails', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDecoContactDetailsToCollectionIfMissing', () => {
      it('should add a DecoContactDetails to an empty array', () => {
        const decoContactDetails: IDecoContactDetails = sampleWithRequiredData;
        expectedResult = service.addDecoContactDetailsToCollectionIfMissing([], decoContactDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoContactDetails);
      });

      it('should not add a DecoContactDetails to an array that contains it', () => {
        const decoContactDetails: IDecoContactDetails = sampleWithRequiredData;
        const decoContactDetailsCollection: IDecoContactDetails[] = [
          {
            ...decoContactDetails,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDecoContactDetailsToCollectionIfMissing(decoContactDetailsCollection, decoContactDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DecoContactDetails to an array that doesn't contain it", () => {
        const decoContactDetails: IDecoContactDetails = sampleWithRequiredData;
        const decoContactDetailsCollection: IDecoContactDetails[] = [sampleWithPartialData];
        expectedResult = service.addDecoContactDetailsToCollectionIfMissing(decoContactDetailsCollection, decoContactDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoContactDetails);
      });

      it('should add only unique DecoContactDetails to an array', () => {
        const decoContactDetailsArray: IDecoContactDetails[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const decoContactDetailsCollection: IDecoContactDetails[] = [sampleWithRequiredData];
        expectedResult = service.addDecoContactDetailsToCollectionIfMissing(decoContactDetailsCollection, ...decoContactDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const decoContactDetails: IDecoContactDetails = sampleWithRequiredData;
        const decoContactDetails2: IDecoContactDetails = sampleWithPartialData;
        expectedResult = service.addDecoContactDetailsToCollectionIfMissing([], decoContactDetails, decoContactDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoContactDetails);
        expect(expectedResult).toContain(decoContactDetails2);
      });

      it('should accept null and undefined values', () => {
        const decoContactDetails: IDecoContactDetails = sampleWithRequiredData;
        expectedResult = service.addDecoContactDetailsToCollectionIfMissing([], null, decoContactDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoContactDetails);
      });

      it('should return initial array if no DecoContactDetails is added', () => {
        const decoContactDetailsCollection: IDecoContactDetails[] = [sampleWithRequiredData];
        expectedResult = service.addDecoContactDetailsToCollectionIfMissing(decoContactDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(decoContactDetailsCollection);
      });
    });

    describe('compareDecoContactDetails', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDecoContactDetails(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDecoContactDetails(entity1, entity2);
        const compareResult2 = service.compareDecoContactDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDecoContactDetails(entity1, entity2);
        const compareResult2 = service.compareDecoContactDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDecoContactDetails(entity1, entity2);
        const compareResult2 = service.compareDecoContactDetails(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
