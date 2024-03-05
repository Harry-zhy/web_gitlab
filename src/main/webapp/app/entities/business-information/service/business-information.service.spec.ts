import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBusinessInformation } from '../business-information.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../business-information.test-samples';

import { BusinessInformationService } from './business-information.service';

const requireRestSample: IBusinessInformation = {
  ...sampleWithRequiredData,
};

describe('BusinessInformation Service', () => {
  let service: BusinessInformationService;
  let httpMock: HttpTestingController;
  let expectedResult: IBusinessInformation | IBusinessInformation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BusinessInformationService);
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

    it('should create a BusinessInformation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const businessInformation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(businessInformation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BusinessInformation', () => {
      const businessInformation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(businessInformation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BusinessInformation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BusinessInformation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BusinessInformation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBusinessInformationToCollectionIfMissing', () => {
      it('should add a BusinessInformation to an empty array', () => {
        const businessInformation: IBusinessInformation = sampleWithRequiredData;
        expectedResult = service.addBusinessInformationToCollectionIfMissing([], businessInformation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessInformation);
      });

      it('should not add a BusinessInformation to an array that contains it', () => {
        const businessInformation: IBusinessInformation = sampleWithRequiredData;
        const businessInformationCollection: IBusinessInformation[] = [
          {
            ...businessInformation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBusinessInformationToCollectionIfMissing(businessInformationCollection, businessInformation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BusinessInformation to an array that doesn't contain it", () => {
        const businessInformation: IBusinessInformation = sampleWithRequiredData;
        const businessInformationCollection: IBusinessInformation[] = [sampleWithPartialData];
        expectedResult = service.addBusinessInformationToCollectionIfMissing(businessInformationCollection, businessInformation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessInformation);
      });

      it('should add only unique BusinessInformation to an array', () => {
        const businessInformationArray: IBusinessInformation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const businessInformationCollection: IBusinessInformation[] = [sampleWithRequiredData];
        expectedResult = service.addBusinessInformationToCollectionIfMissing(businessInformationCollection, ...businessInformationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const businessInformation: IBusinessInformation = sampleWithRequiredData;
        const businessInformation2: IBusinessInformation = sampleWithPartialData;
        expectedResult = service.addBusinessInformationToCollectionIfMissing([], businessInformation, businessInformation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessInformation);
        expect(expectedResult).toContain(businessInformation2);
      });

      it('should accept null and undefined values', () => {
        const businessInformation: IBusinessInformation = sampleWithRequiredData;
        expectedResult = service.addBusinessInformationToCollectionIfMissing([], null, businessInformation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessInformation);
      });

      it('should return initial array if no BusinessInformation is added', () => {
        const businessInformationCollection: IBusinessInformation[] = [sampleWithRequiredData];
        expectedResult = service.addBusinessInformationToCollectionIfMissing(businessInformationCollection, undefined, null);
        expect(expectedResult).toEqual(businessInformationCollection);
      });
    });

    describe('compareBusinessInformation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBusinessInformation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBusinessInformation(entity1, entity2);
        const compareResult2 = service.compareBusinessInformation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBusinessInformation(entity1, entity2);
        const compareResult2 = service.compareBusinessInformation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBusinessInformation(entity1, entity2);
        const compareResult2 = service.compareBusinessInformation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
