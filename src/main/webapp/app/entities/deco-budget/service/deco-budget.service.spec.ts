import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDecoBudget } from '../deco-budget.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../deco-budget.test-samples';

import { DecoBudgetService } from './deco-budget.service';

const requireRestSample: IDecoBudget = {
  ...sampleWithRequiredData,
};

describe('DecoBudget Service', () => {
  let service: DecoBudgetService;
  let httpMock: HttpTestingController;
  let expectedResult: IDecoBudget | IDecoBudget[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DecoBudgetService);
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

    it('should create a DecoBudget', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const decoBudget = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(decoBudget).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DecoBudget', () => {
      const decoBudget = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(decoBudget).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DecoBudget', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DecoBudget', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DecoBudget', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDecoBudgetToCollectionIfMissing', () => {
      it('should add a DecoBudget to an empty array', () => {
        const decoBudget: IDecoBudget = sampleWithRequiredData;
        expectedResult = service.addDecoBudgetToCollectionIfMissing([], decoBudget);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoBudget);
      });

      it('should not add a DecoBudget to an array that contains it', () => {
        const decoBudget: IDecoBudget = sampleWithRequiredData;
        const decoBudgetCollection: IDecoBudget[] = [
          {
            ...decoBudget,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDecoBudgetToCollectionIfMissing(decoBudgetCollection, decoBudget);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DecoBudget to an array that doesn't contain it", () => {
        const decoBudget: IDecoBudget = sampleWithRequiredData;
        const decoBudgetCollection: IDecoBudget[] = [sampleWithPartialData];
        expectedResult = service.addDecoBudgetToCollectionIfMissing(decoBudgetCollection, decoBudget);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoBudget);
      });

      it('should add only unique DecoBudget to an array', () => {
        const decoBudgetArray: IDecoBudget[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const decoBudgetCollection: IDecoBudget[] = [sampleWithRequiredData];
        expectedResult = service.addDecoBudgetToCollectionIfMissing(decoBudgetCollection, ...decoBudgetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const decoBudget: IDecoBudget = sampleWithRequiredData;
        const decoBudget2: IDecoBudget = sampleWithPartialData;
        expectedResult = service.addDecoBudgetToCollectionIfMissing([], decoBudget, decoBudget2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoBudget);
        expect(expectedResult).toContain(decoBudget2);
      });

      it('should accept null and undefined values', () => {
        const decoBudget: IDecoBudget = sampleWithRequiredData;
        expectedResult = service.addDecoBudgetToCollectionIfMissing([], null, decoBudget, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoBudget);
      });

      it('should return initial array if no DecoBudget is added', () => {
        const decoBudgetCollection: IDecoBudget[] = [sampleWithRequiredData];
        expectedResult = service.addDecoBudgetToCollectionIfMissing(decoBudgetCollection, undefined, null);
        expect(expectedResult).toEqual(decoBudgetCollection);
      });
    });

    describe('compareDecoBudget', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDecoBudget(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDecoBudget(entity1, entity2);
        const compareResult2 = service.compareDecoBudget(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDecoBudget(entity1, entity2);
        const compareResult2 = service.compareDecoBudget(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDecoBudget(entity1, entity2);
        const compareResult2 = service.compareDecoBudget(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
