import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICuisine } from '../cuisine.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../cuisine.test-samples';

import { CuisineService } from './cuisine.service';

const requireRestSample: ICuisine = {
  ...sampleWithRequiredData,
};

describe('Cuisine Service', () => {
  let service: CuisineService;
  let httpMock: HttpTestingController;
  let expectedResult: ICuisine | ICuisine[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CuisineService);
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

    it('should create a Cuisine', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cuisine = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(cuisine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cuisine', () => {
      const cuisine = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(cuisine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cuisine', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cuisine', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Cuisine', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCuisineToCollectionIfMissing', () => {
      it('should add a Cuisine to an empty array', () => {
        const cuisine: ICuisine = sampleWithRequiredData;
        expectedResult = service.addCuisineToCollectionIfMissing([], cuisine);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cuisine);
      });

      it('should not add a Cuisine to an array that contains it', () => {
        const cuisine: ICuisine = sampleWithRequiredData;
        const cuisineCollection: ICuisine[] = [
          {
            ...cuisine,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCuisineToCollectionIfMissing(cuisineCollection, cuisine);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cuisine to an array that doesn't contain it", () => {
        const cuisine: ICuisine = sampleWithRequiredData;
        const cuisineCollection: ICuisine[] = [sampleWithPartialData];
        expectedResult = service.addCuisineToCollectionIfMissing(cuisineCollection, cuisine);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cuisine);
      });

      it('should add only unique Cuisine to an array', () => {
        const cuisineArray: ICuisine[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cuisineCollection: ICuisine[] = [sampleWithRequiredData];
        expectedResult = service.addCuisineToCollectionIfMissing(cuisineCollection, ...cuisineArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cuisine: ICuisine = sampleWithRequiredData;
        const cuisine2: ICuisine = sampleWithPartialData;
        expectedResult = service.addCuisineToCollectionIfMissing([], cuisine, cuisine2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cuisine);
        expect(expectedResult).toContain(cuisine2);
      });

      it('should accept null and undefined values', () => {
        const cuisine: ICuisine = sampleWithRequiredData;
        expectedResult = service.addCuisineToCollectionIfMissing([], null, cuisine, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cuisine);
      });

      it('should return initial array if no Cuisine is added', () => {
        const cuisineCollection: ICuisine[] = [sampleWithRequiredData];
        expectedResult = service.addCuisineToCollectionIfMissing(cuisineCollection, undefined, null);
        expect(expectedResult).toEqual(cuisineCollection);
      });
    });

    describe('compareCuisine', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCuisine(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCuisine(entity1, entity2);
        const compareResult2 = service.compareCuisine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCuisine(entity1, entity2);
        const compareResult2 = service.compareCuisine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCuisine(entity1, entity2);
        const compareResult2 = service.compareCuisine(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
