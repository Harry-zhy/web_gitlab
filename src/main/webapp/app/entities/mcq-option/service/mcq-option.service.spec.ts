import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMCQOption } from '../mcq-option.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mcq-option.test-samples';

import { MCQOptionService } from './mcq-option.service';

const requireRestSample: IMCQOption = {
  ...sampleWithRequiredData,
};

describe('MCQOption Service', () => {
  let service: MCQOptionService;
  let httpMock: HttpTestingController;
  let expectedResult: IMCQOption | IMCQOption[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MCQOptionService);
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

    it('should create a MCQOption', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mCQOption = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mCQOption).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MCQOption', () => {
      const mCQOption = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mCQOption).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MCQOption', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MCQOption', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MCQOption', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMCQOptionToCollectionIfMissing', () => {
      it('should add a MCQOption to an empty array', () => {
        const mCQOption: IMCQOption = sampleWithRequiredData;
        expectedResult = service.addMCQOptionToCollectionIfMissing([], mCQOption);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mCQOption);
      });

      it('should not add a MCQOption to an array that contains it', () => {
        const mCQOption: IMCQOption = sampleWithRequiredData;
        const mCQOptionCollection: IMCQOption[] = [
          {
            ...mCQOption,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMCQOptionToCollectionIfMissing(mCQOptionCollection, mCQOption);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MCQOption to an array that doesn't contain it", () => {
        const mCQOption: IMCQOption = sampleWithRequiredData;
        const mCQOptionCollection: IMCQOption[] = [sampleWithPartialData];
        expectedResult = service.addMCQOptionToCollectionIfMissing(mCQOptionCollection, mCQOption);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mCQOption);
      });

      it('should add only unique MCQOption to an array', () => {
        const mCQOptionArray: IMCQOption[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mCQOptionCollection: IMCQOption[] = [sampleWithRequiredData];
        expectedResult = service.addMCQOptionToCollectionIfMissing(mCQOptionCollection, ...mCQOptionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mCQOption: IMCQOption = sampleWithRequiredData;
        const mCQOption2: IMCQOption = sampleWithPartialData;
        expectedResult = service.addMCQOptionToCollectionIfMissing([], mCQOption, mCQOption2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mCQOption);
        expect(expectedResult).toContain(mCQOption2);
      });

      it('should accept null and undefined values', () => {
        const mCQOption: IMCQOption = sampleWithRequiredData;
        expectedResult = service.addMCQOptionToCollectionIfMissing([], null, mCQOption, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mCQOption);
      });

      it('should return initial array if no MCQOption is added', () => {
        const mCQOptionCollection: IMCQOption[] = [sampleWithRequiredData];
        expectedResult = service.addMCQOptionToCollectionIfMissing(mCQOptionCollection, undefined, null);
        expect(expectedResult).toEqual(mCQOptionCollection);
      });
    });

    describe('compareMCQOption', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMCQOption(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMCQOption(entity1, entity2);
        const compareResult2 = service.compareMCQOption(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMCQOption(entity1, entity2);
        const compareResult2 = service.compareMCQOption(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMCQOption(entity1, entity2);
        const compareResult2 = service.compareMCQOption(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
