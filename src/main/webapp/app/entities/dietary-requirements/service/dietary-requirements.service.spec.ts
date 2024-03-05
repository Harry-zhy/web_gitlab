import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDietaryRequirements } from '../dietary-requirements.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../dietary-requirements.test-samples';

import { DietaryRequirementsService } from './dietary-requirements.service';

const requireRestSample: IDietaryRequirements = {
  ...sampleWithRequiredData,
};

describe('DietaryRequirements Service', () => {
  let service: DietaryRequirementsService;
  let httpMock: HttpTestingController;
  let expectedResult: IDietaryRequirements | IDietaryRequirements[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DietaryRequirementsService);
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

    it('should create a DietaryRequirements', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dietaryRequirements = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(dietaryRequirements).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DietaryRequirements', () => {
      const dietaryRequirements = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(dietaryRequirements).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DietaryRequirements', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DietaryRequirements', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DietaryRequirements', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDietaryRequirementsToCollectionIfMissing', () => {
      it('should add a DietaryRequirements to an empty array', () => {
        const dietaryRequirements: IDietaryRequirements = sampleWithRequiredData;
        expectedResult = service.addDietaryRequirementsToCollectionIfMissing([], dietaryRequirements);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dietaryRequirements);
      });

      it('should not add a DietaryRequirements to an array that contains it', () => {
        const dietaryRequirements: IDietaryRequirements = sampleWithRequiredData;
        const dietaryRequirementsCollection: IDietaryRequirements[] = [
          {
            ...dietaryRequirements,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDietaryRequirementsToCollectionIfMissing(dietaryRequirementsCollection, dietaryRequirements);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DietaryRequirements to an array that doesn't contain it", () => {
        const dietaryRequirements: IDietaryRequirements = sampleWithRequiredData;
        const dietaryRequirementsCollection: IDietaryRequirements[] = [sampleWithPartialData];
        expectedResult = service.addDietaryRequirementsToCollectionIfMissing(dietaryRequirementsCollection, dietaryRequirements);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dietaryRequirements);
      });

      it('should add only unique DietaryRequirements to an array', () => {
        const dietaryRequirementsArray: IDietaryRequirements[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const dietaryRequirementsCollection: IDietaryRequirements[] = [sampleWithRequiredData];
        expectedResult = service.addDietaryRequirementsToCollectionIfMissing(dietaryRequirementsCollection, ...dietaryRequirementsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const dietaryRequirements: IDietaryRequirements = sampleWithRequiredData;
        const dietaryRequirements2: IDietaryRequirements = sampleWithPartialData;
        expectedResult = service.addDietaryRequirementsToCollectionIfMissing([], dietaryRequirements, dietaryRequirements2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dietaryRequirements);
        expect(expectedResult).toContain(dietaryRequirements2);
      });

      it('should accept null and undefined values', () => {
        const dietaryRequirements: IDietaryRequirements = sampleWithRequiredData;
        expectedResult = service.addDietaryRequirementsToCollectionIfMissing([], null, dietaryRequirements, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dietaryRequirements);
      });

      it('should return initial array if no DietaryRequirements is added', () => {
        const dietaryRequirementsCollection: IDietaryRequirements[] = [sampleWithRequiredData];
        expectedResult = service.addDietaryRequirementsToCollectionIfMissing(dietaryRequirementsCollection, undefined, null);
        expect(expectedResult).toEqual(dietaryRequirementsCollection);
      });
    });

    describe('compareDietaryRequirements', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDietaryRequirements(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDietaryRequirements(entity1, entity2);
        const compareResult2 = service.compareDietaryRequirements(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDietaryRequirements(entity1, entity2);
        const compareResult2 = service.compareDietaryRequirements(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDietaryRequirements(entity1, entity2);
        const compareResult2 = service.compareDietaryRequirements(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
