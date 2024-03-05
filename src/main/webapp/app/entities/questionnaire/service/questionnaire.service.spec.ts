import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IQuestionnaire } from '../questionnaire.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../questionnaire.test-samples';

import { QuestionnaireService, RestQuestionnaire } from './questionnaire.service';

const requireRestSample: RestQuestionnaire = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('Questionnaire Service', () => {
  let service: QuestionnaireService;
  let httpMock: HttpTestingController;
  let expectedResult: IQuestionnaire | IQuestionnaire[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(QuestionnaireService);
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

    it('should create a Questionnaire', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const questionnaire = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(questionnaire).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Questionnaire', () => {
      const questionnaire = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(questionnaire).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Questionnaire', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Questionnaire', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Questionnaire', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addQuestionnaireToCollectionIfMissing', () => {
      it('should add a Questionnaire to an empty array', () => {
        const questionnaire: IQuestionnaire = sampleWithRequiredData;
        expectedResult = service.addQuestionnaireToCollectionIfMissing([], questionnaire);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(questionnaire);
      });

      it('should not add a Questionnaire to an array that contains it', () => {
        const questionnaire: IQuestionnaire = sampleWithRequiredData;
        const questionnaireCollection: IQuestionnaire[] = [
          {
            ...questionnaire,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addQuestionnaireToCollectionIfMissing(questionnaireCollection, questionnaire);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Questionnaire to an array that doesn't contain it", () => {
        const questionnaire: IQuestionnaire = sampleWithRequiredData;
        const questionnaireCollection: IQuestionnaire[] = [sampleWithPartialData];
        expectedResult = service.addQuestionnaireToCollectionIfMissing(questionnaireCollection, questionnaire);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(questionnaire);
      });

      it('should add only unique Questionnaire to an array', () => {
        const questionnaireArray: IQuestionnaire[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const questionnaireCollection: IQuestionnaire[] = [sampleWithRequiredData];
        expectedResult = service.addQuestionnaireToCollectionIfMissing(questionnaireCollection, ...questionnaireArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const questionnaire: IQuestionnaire = sampleWithRequiredData;
        const questionnaire2: IQuestionnaire = sampleWithPartialData;
        expectedResult = service.addQuestionnaireToCollectionIfMissing([], questionnaire, questionnaire2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(questionnaire);
        expect(expectedResult).toContain(questionnaire2);
      });

      it('should accept null and undefined values', () => {
        const questionnaire: IQuestionnaire = sampleWithRequiredData;
        expectedResult = service.addQuestionnaireToCollectionIfMissing([], null, questionnaire, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(questionnaire);
      });

      it('should return initial array if no Questionnaire is added', () => {
        const questionnaireCollection: IQuestionnaire[] = [sampleWithRequiredData];
        expectedResult = service.addQuestionnaireToCollectionIfMissing(questionnaireCollection, undefined, null);
        expect(expectedResult).toEqual(questionnaireCollection);
      });
    });

    describe('compareQuestionnaire', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareQuestionnaire(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareQuestionnaire(entity1, entity2);
        const compareResult2 = service.compareQuestionnaire(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareQuestionnaire(entity1, entity2);
        const compareResult2 = service.compareQuestionnaire(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareQuestionnaire(entity1, entity2);
        const compareResult2 = service.compareQuestionnaire(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
