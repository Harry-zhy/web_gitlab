import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActivityImage } from '../activity-image.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../activity-image.test-samples';

import { ActivityImageService } from './activity-image.service';

const requireRestSample: IActivityImage = {
  ...sampleWithRequiredData,
};

describe('ActivityImage Service', () => {
  let service: ActivityImageService;
  let httpMock: HttpTestingController;
  let expectedResult: IActivityImage | IActivityImage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActivityImageService);
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

    it('should create a ActivityImage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const activityImage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(activityImage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ActivityImage', () => {
      const activityImage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(activityImage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ActivityImage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ActivityImage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ActivityImage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActivityImageToCollectionIfMissing', () => {
      it('should add a ActivityImage to an empty array', () => {
        const activityImage: IActivityImage = sampleWithRequiredData;
        expectedResult = service.addActivityImageToCollectionIfMissing([], activityImage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activityImage);
      });

      it('should not add a ActivityImage to an array that contains it', () => {
        const activityImage: IActivityImage = sampleWithRequiredData;
        const activityImageCollection: IActivityImage[] = [
          {
            ...activityImage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActivityImageToCollectionIfMissing(activityImageCollection, activityImage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ActivityImage to an array that doesn't contain it", () => {
        const activityImage: IActivityImage = sampleWithRequiredData;
        const activityImageCollection: IActivityImage[] = [sampleWithPartialData];
        expectedResult = service.addActivityImageToCollectionIfMissing(activityImageCollection, activityImage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activityImage);
      });

      it('should add only unique ActivityImage to an array', () => {
        const activityImageArray: IActivityImage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const activityImageCollection: IActivityImage[] = [sampleWithRequiredData];
        expectedResult = service.addActivityImageToCollectionIfMissing(activityImageCollection, ...activityImageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const activityImage: IActivityImage = sampleWithRequiredData;
        const activityImage2: IActivityImage = sampleWithPartialData;
        expectedResult = service.addActivityImageToCollectionIfMissing([], activityImage, activityImage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activityImage);
        expect(expectedResult).toContain(activityImage2);
      });

      it('should accept null and undefined values', () => {
        const activityImage: IActivityImage = sampleWithRequiredData;
        expectedResult = service.addActivityImageToCollectionIfMissing([], null, activityImage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activityImage);
      });

      it('should return initial array if no ActivityImage is added', () => {
        const activityImageCollection: IActivityImage[] = [sampleWithRequiredData];
        expectedResult = service.addActivityImageToCollectionIfMissing(activityImageCollection, undefined, null);
        expect(expectedResult).toEqual(activityImageCollection);
      });
    });

    describe('compareActivityImage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActivityImage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActivityImage(entity1, entity2);
        const compareResult2 = service.compareActivityImage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActivityImage(entity1, entity2);
        const compareResult2 = service.compareActivityImage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActivityImage(entity1, entity2);
        const compareResult2 = service.compareActivityImage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
