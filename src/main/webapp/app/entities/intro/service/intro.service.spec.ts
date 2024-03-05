import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIntro } from '../intro.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../intro.test-samples';

import { IntroService } from './intro.service';

const requireRestSample: IIntro = {
  ...sampleWithRequiredData,
};

describe('Intro Service', () => {
  let service: IntroService;
  let httpMock: HttpTestingController;
  let expectedResult: IIntro | IIntro[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IntroService);
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

    it('should create a Intro', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const intro = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(intro).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Intro', () => {
      const intro = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(intro).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Intro', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Intro', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Intro', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addIntroToCollectionIfMissing', () => {
      it('should add a Intro to an empty array', () => {
        const intro: IIntro = sampleWithRequiredData;
        expectedResult = service.addIntroToCollectionIfMissing([], intro);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(intro);
      });

      it('should not add a Intro to an array that contains it', () => {
        const intro: IIntro = sampleWithRequiredData;
        const introCollection: IIntro[] = [
          {
            ...intro,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addIntroToCollectionIfMissing(introCollection, intro);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Intro to an array that doesn't contain it", () => {
        const intro: IIntro = sampleWithRequiredData;
        const introCollection: IIntro[] = [sampleWithPartialData];
        expectedResult = service.addIntroToCollectionIfMissing(introCollection, intro);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(intro);
      });

      it('should add only unique Intro to an array', () => {
        const introArray: IIntro[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const introCollection: IIntro[] = [sampleWithRequiredData];
        expectedResult = service.addIntroToCollectionIfMissing(introCollection, ...introArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const intro: IIntro = sampleWithRequiredData;
        const intro2: IIntro = sampleWithPartialData;
        expectedResult = service.addIntroToCollectionIfMissing([], intro, intro2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(intro);
        expect(expectedResult).toContain(intro2);
      });

      it('should accept null and undefined values', () => {
        const intro: IIntro = sampleWithRequiredData;
        expectedResult = service.addIntroToCollectionIfMissing([], null, intro, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(intro);
      });

      it('should return initial array if no Intro is added', () => {
        const introCollection: IIntro[] = [sampleWithRequiredData];
        expectedResult = service.addIntroToCollectionIfMissing(introCollection, undefined, null);
        expect(expectedResult).toEqual(introCollection);
      });
    });

    describe('compareIntro', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareIntro(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareIntro(entity1, entity2);
        const compareResult2 = service.compareIntro(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareIntro(entity1, entity2);
        const compareResult2 = service.compareIntro(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareIntro(entity1, entity2);
        const compareResult2 = service.compareIntro(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
