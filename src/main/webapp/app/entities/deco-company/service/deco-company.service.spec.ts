import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDecoCompany } from '../deco-company.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../deco-company.test-samples';

import { DecoCompanyService } from './deco-company.service';

const requireRestSample: IDecoCompany = {
  ...sampleWithRequiredData,
};

describe('DecoCompany Service', () => {
  let service: DecoCompanyService;
  let httpMock: HttpTestingController;
  let expectedResult: IDecoCompany | IDecoCompany[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DecoCompanyService);
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

    it('should create a DecoCompany', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const decoCompany = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(decoCompany).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DecoCompany', () => {
      const decoCompany = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(decoCompany).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DecoCompany', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DecoCompany', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DecoCompany', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDecoCompanyToCollectionIfMissing', () => {
      it('should add a DecoCompany to an empty array', () => {
        const decoCompany: IDecoCompany = sampleWithRequiredData;
        expectedResult = service.addDecoCompanyToCollectionIfMissing([], decoCompany);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoCompany);
      });

      it('should not add a DecoCompany to an array that contains it', () => {
        const decoCompany: IDecoCompany = sampleWithRequiredData;
        const decoCompanyCollection: IDecoCompany[] = [
          {
            ...decoCompany,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDecoCompanyToCollectionIfMissing(decoCompanyCollection, decoCompany);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DecoCompany to an array that doesn't contain it", () => {
        const decoCompany: IDecoCompany = sampleWithRequiredData;
        const decoCompanyCollection: IDecoCompany[] = [sampleWithPartialData];
        expectedResult = service.addDecoCompanyToCollectionIfMissing(decoCompanyCollection, decoCompany);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoCompany);
      });

      it('should add only unique DecoCompany to an array', () => {
        const decoCompanyArray: IDecoCompany[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const decoCompanyCollection: IDecoCompany[] = [sampleWithRequiredData];
        expectedResult = service.addDecoCompanyToCollectionIfMissing(decoCompanyCollection, ...decoCompanyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const decoCompany: IDecoCompany = sampleWithRequiredData;
        const decoCompany2: IDecoCompany = sampleWithPartialData;
        expectedResult = service.addDecoCompanyToCollectionIfMissing([], decoCompany, decoCompany2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoCompany);
        expect(expectedResult).toContain(decoCompany2);
      });

      it('should accept null and undefined values', () => {
        const decoCompany: IDecoCompany = sampleWithRequiredData;
        expectedResult = service.addDecoCompanyToCollectionIfMissing([], null, decoCompany, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoCompany);
      });

      it('should return initial array if no DecoCompany is added', () => {
        const decoCompanyCollection: IDecoCompany[] = [sampleWithRequiredData];
        expectedResult = service.addDecoCompanyToCollectionIfMissing(decoCompanyCollection, undefined, null);
        expect(expectedResult).toEqual(decoCompanyCollection);
      });
    });

    describe('compareDecoCompany', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDecoCompany(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDecoCompany(entity1, entity2);
        const compareResult2 = service.compareDecoCompany(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDecoCompany(entity1, entity2);
        const compareResult2 = service.compareDecoCompany(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDecoCompany(entity1, entity2);
        const compareResult2 = service.compareDecoCompany(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
