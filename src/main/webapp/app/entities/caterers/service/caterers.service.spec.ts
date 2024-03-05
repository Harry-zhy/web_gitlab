import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICaterers } from '../caterers.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../caterers.test-samples';

import { CaterersService } from './caterers.service';

const requireRestSample: ICaterers = {
  ...sampleWithRequiredData,
};

describe('Caterers Service', () => {
  let service: CaterersService;
  let httpMock: HttpTestingController;
  let expectedResult: ICaterers | ICaterers[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CaterersService);
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

    it('should create a Caterers', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const caterers = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(caterers).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Caterers', () => {
      const caterers = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(caterers).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Caterers', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Caterers', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Caterers', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCaterersToCollectionIfMissing', () => {
      it('should add a Caterers to an empty array', () => {
        const caterers: ICaterers = sampleWithRequiredData;
        expectedResult = service.addCaterersToCollectionIfMissing([], caterers);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caterers);
      });

      it('should not add a Caterers to an array that contains it', () => {
        const caterers: ICaterers = sampleWithRequiredData;
        const caterersCollection: ICaterers[] = [
          {
            ...caterers,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCaterersToCollectionIfMissing(caterersCollection, caterers);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Caterers to an array that doesn't contain it", () => {
        const caterers: ICaterers = sampleWithRequiredData;
        const caterersCollection: ICaterers[] = [sampleWithPartialData];
        expectedResult = service.addCaterersToCollectionIfMissing(caterersCollection, caterers);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caterers);
      });

      it('should add only unique Caterers to an array', () => {
        const caterersArray: ICaterers[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const caterersCollection: ICaterers[] = [sampleWithRequiredData];
        expectedResult = service.addCaterersToCollectionIfMissing(caterersCollection, ...caterersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const caterers: ICaterers = sampleWithRequiredData;
        const caterers2: ICaterers = sampleWithPartialData;
        expectedResult = service.addCaterersToCollectionIfMissing([], caterers, caterers2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caterers);
        expect(expectedResult).toContain(caterers2);
      });

      it('should accept null and undefined values', () => {
        const caterers: ICaterers = sampleWithRequiredData;
        expectedResult = service.addCaterersToCollectionIfMissing([], null, caterers, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caterers);
      });

      it('should return initial array if no Caterers is added', () => {
        const caterersCollection: ICaterers[] = [sampleWithRequiredData];
        expectedResult = service.addCaterersToCollectionIfMissing(caterersCollection, undefined, null);
        expect(expectedResult).toEqual(caterersCollection);
      });
    });

    describe('compareCaterers', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCaterers(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCaterers(entity1, entity2);
        const compareResult2 = service.compareCaterers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCaterers(entity1, entity2);
        const compareResult2 = service.compareCaterers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCaterers(entity1, entity2);
        const compareResult2 = service.compareCaterers(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
