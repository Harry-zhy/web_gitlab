import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActivityCompany } from '../activity-company.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../activity-company.test-samples';

import { ActivityCompanyService } from './activity-company.service';

const requireRestSample: IActivityCompany = {
  ...sampleWithRequiredData,
};

describe('ActivityCompany Service', () => {
  let service: ActivityCompanyService;
  let httpMock: HttpTestingController;
  let expectedResult: IActivityCompany | IActivityCompany[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActivityCompanyService);
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

    it('should create a ActivityCompany', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const activityCompany = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(activityCompany).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ActivityCompany', () => {
      const activityCompany = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(activityCompany).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ActivityCompany', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ActivityCompany', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ActivityCompany', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActivityCompanyToCollectionIfMissing', () => {
      it('should add a ActivityCompany to an empty array', () => {
        const activityCompany: IActivityCompany = sampleWithRequiredData;
        expectedResult = service.addActivityCompanyToCollectionIfMissing([], activityCompany);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activityCompany);
      });

      it('should not add a ActivityCompany to an array that contains it', () => {
        const activityCompany: IActivityCompany = sampleWithRequiredData;
        const activityCompanyCollection: IActivityCompany[] = [
          {
            ...activityCompany,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActivityCompanyToCollectionIfMissing(activityCompanyCollection, activityCompany);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ActivityCompany to an array that doesn't contain it", () => {
        const activityCompany: IActivityCompany = sampleWithRequiredData;
        const activityCompanyCollection: IActivityCompany[] = [sampleWithPartialData];
        expectedResult = service.addActivityCompanyToCollectionIfMissing(activityCompanyCollection, activityCompany);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activityCompany);
      });

      it('should add only unique ActivityCompany to an array', () => {
        const activityCompanyArray: IActivityCompany[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const activityCompanyCollection: IActivityCompany[] = [sampleWithRequiredData];
        expectedResult = service.addActivityCompanyToCollectionIfMissing(activityCompanyCollection, ...activityCompanyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const activityCompany: IActivityCompany = sampleWithRequiredData;
        const activityCompany2: IActivityCompany = sampleWithPartialData;
        expectedResult = service.addActivityCompanyToCollectionIfMissing([], activityCompany, activityCompany2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activityCompany);
        expect(expectedResult).toContain(activityCompany2);
      });

      it('should accept null and undefined values', () => {
        const activityCompany: IActivityCompany = sampleWithRequiredData;
        expectedResult = service.addActivityCompanyToCollectionIfMissing([], null, activityCompany, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activityCompany);
      });

      it('should return initial array if no ActivityCompany is added', () => {
        const activityCompanyCollection: IActivityCompany[] = [sampleWithRequiredData];
        expectedResult = service.addActivityCompanyToCollectionIfMissing(activityCompanyCollection, undefined, null);
        expect(expectedResult).toEqual(activityCompanyCollection);
      });
    });

    describe('compareActivityCompany', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActivityCompany(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActivityCompany(entity1, entity2);
        const compareResult2 = service.compareActivityCompany(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActivityCompany(entity1, entity2);
        const compareResult2 = service.compareActivityCompany(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActivityCompany(entity1, entity2);
        const compareResult2 = service.compareActivityCompany(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
