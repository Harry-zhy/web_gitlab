import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDecoThemes } from '../deco-themes.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../deco-themes.test-samples';

import { DecoThemesService } from './deco-themes.service';

const requireRestSample: IDecoThemes = {
  ...sampleWithRequiredData,
};

describe('DecoThemes Service', () => {
  let service: DecoThemesService;
  let httpMock: HttpTestingController;
  let expectedResult: IDecoThemes | IDecoThemes[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DecoThemesService);
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

    it('should create a DecoThemes', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const decoThemes = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(decoThemes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DecoThemes', () => {
      const decoThemes = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(decoThemes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DecoThemes', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DecoThemes', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DecoThemes', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDecoThemesToCollectionIfMissing', () => {
      it('should add a DecoThemes to an empty array', () => {
        const decoThemes: IDecoThemes = sampleWithRequiredData;
        expectedResult = service.addDecoThemesToCollectionIfMissing([], decoThemes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoThemes);
      });

      it('should not add a DecoThemes to an array that contains it', () => {
        const decoThemes: IDecoThemes = sampleWithRequiredData;
        const decoThemesCollection: IDecoThemes[] = [
          {
            ...decoThemes,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDecoThemesToCollectionIfMissing(decoThemesCollection, decoThemes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DecoThemes to an array that doesn't contain it", () => {
        const decoThemes: IDecoThemes = sampleWithRequiredData;
        const decoThemesCollection: IDecoThemes[] = [sampleWithPartialData];
        expectedResult = service.addDecoThemesToCollectionIfMissing(decoThemesCollection, decoThemes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoThemes);
      });

      it('should add only unique DecoThemes to an array', () => {
        const decoThemesArray: IDecoThemes[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const decoThemesCollection: IDecoThemes[] = [sampleWithRequiredData];
        expectedResult = service.addDecoThemesToCollectionIfMissing(decoThemesCollection, ...decoThemesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const decoThemes: IDecoThemes = sampleWithRequiredData;
        const decoThemes2: IDecoThemes = sampleWithPartialData;
        expectedResult = service.addDecoThemesToCollectionIfMissing([], decoThemes, decoThemes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoThemes);
        expect(expectedResult).toContain(decoThemes2);
      });

      it('should accept null and undefined values', () => {
        const decoThemes: IDecoThemes = sampleWithRequiredData;
        expectedResult = service.addDecoThemesToCollectionIfMissing([], null, decoThemes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoThemes);
      });

      it('should return initial array if no DecoThemes is added', () => {
        const decoThemesCollection: IDecoThemes[] = [sampleWithRequiredData];
        expectedResult = service.addDecoThemesToCollectionIfMissing(decoThemesCollection, undefined, null);
        expect(expectedResult).toEqual(decoThemesCollection);
      });
    });

    describe('compareDecoThemes', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDecoThemes(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDecoThemes(entity1, entity2);
        const compareResult2 = service.compareDecoThemes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDecoThemes(entity1, entity2);
        const compareResult2 = service.compareDecoThemes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDecoThemes(entity1, entity2);
        const compareResult2 = service.compareDecoThemes(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
