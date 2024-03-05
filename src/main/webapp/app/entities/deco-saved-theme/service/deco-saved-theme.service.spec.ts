import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDecoSavedTheme } from '../deco-saved-theme.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../deco-saved-theme.test-samples';

import { DecoSavedThemeService } from './deco-saved-theme.service';

const requireRestSample: IDecoSavedTheme = {
  ...sampleWithRequiredData,
};

describe('DecoSavedTheme Service', () => {
  let service: DecoSavedThemeService;
  let httpMock: HttpTestingController;
  let expectedResult: IDecoSavedTheme | IDecoSavedTheme[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DecoSavedThemeService);
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

    it('should create a DecoSavedTheme', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const decoSavedTheme = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(decoSavedTheme).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DecoSavedTheme', () => {
      const decoSavedTheme = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(decoSavedTheme).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DecoSavedTheme', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DecoSavedTheme', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DecoSavedTheme', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDecoSavedThemeToCollectionIfMissing', () => {
      it('should add a DecoSavedTheme to an empty array', () => {
        const decoSavedTheme: IDecoSavedTheme = sampleWithRequiredData;
        expectedResult = service.addDecoSavedThemeToCollectionIfMissing([], decoSavedTheme);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoSavedTheme);
      });

      it('should not add a DecoSavedTheme to an array that contains it', () => {
        const decoSavedTheme: IDecoSavedTheme = sampleWithRequiredData;
        const decoSavedThemeCollection: IDecoSavedTheme[] = [
          {
            ...decoSavedTheme,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDecoSavedThemeToCollectionIfMissing(decoSavedThemeCollection, decoSavedTheme);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DecoSavedTheme to an array that doesn't contain it", () => {
        const decoSavedTheme: IDecoSavedTheme = sampleWithRequiredData;
        const decoSavedThemeCollection: IDecoSavedTheme[] = [sampleWithPartialData];
        expectedResult = service.addDecoSavedThemeToCollectionIfMissing(decoSavedThemeCollection, decoSavedTheme);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoSavedTheme);
      });

      it('should add only unique DecoSavedTheme to an array', () => {
        const decoSavedThemeArray: IDecoSavedTheme[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const decoSavedThemeCollection: IDecoSavedTheme[] = [sampleWithRequiredData];
        expectedResult = service.addDecoSavedThemeToCollectionIfMissing(decoSavedThemeCollection, ...decoSavedThemeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const decoSavedTheme: IDecoSavedTheme = sampleWithRequiredData;
        const decoSavedTheme2: IDecoSavedTheme = sampleWithPartialData;
        expectedResult = service.addDecoSavedThemeToCollectionIfMissing([], decoSavedTheme, decoSavedTheme2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoSavedTheme);
        expect(expectedResult).toContain(decoSavedTheme2);
      });

      it('should accept null and undefined values', () => {
        const decoSavedTheme: IDecoSavedTheme = sampleWithRequiredData;
        expectedResult = service.addDecoSavedThemeToCollectionIfMissing([], null, decoSavedTheme, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoSavedTheme);
      });

      it('should return initial array if no DecoSavedTheme is added', () => {
        const decoSavedThemeCollection: IDecoSavedTheme[] = [sampleWithRequiredData];
        expectedResult = service.addDecoSavedThemeToCollectionIfMissing(decoSavedThemeCollection, undefined, null);
        expect(expectedResult).toEqual(decoSavedThemeCollection);
      });
    });

    describe('compareDecoSavedTheme', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDecoSavedTheme(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDecoSavedTheme(entity1, entity2);
        const compareResult2 = service.compareDecoSavedTheme(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDecoSavedTheme(entity1, entity2);
        const compareResult2 = service.compareDecoSavedTheme(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDecoSavedTheme(entity1, entity2);
        const compareResult2 = service.compareDecoSavedTheme(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
