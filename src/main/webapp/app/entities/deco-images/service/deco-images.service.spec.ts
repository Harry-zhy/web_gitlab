import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDecoImages } from '../deco-images.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../deco-images.test-samples';

import { DecoImagesService } from './deco-images.service';

const requireRestSample: IDecoImages = {
  ...sampleWithRequiredData,
};

describe('DecoImages Service', () => {
  let service: DecoImagesService;
  let httpMock: HttpTestingController;
  let expectedResult: IDecoImages | IDecoImages[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DecoImagesService);
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

    it('should create a DecoImages', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const decoImages = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(decoImages).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DecoImages', () => {
      const decoImages = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(decoImages).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DecoImages', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DecoImages', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DecoImages', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDecoImagesToCollectionIfMissing', () => {
      it('should add a DecoImages to an empty array', () => {
        const decoImages: IDecoImages = sampleWithRequiredData;
        expectedResult = service.addDecoImagesToCollectionIfMissing([], decoImages);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoImages);
      });

      it('should not add a DecoImages to an array that contains it', () => {
        const decoImages: IDecoImages = sampleWithRequiredData;
        const decoImagesCollection: IDecoImages[] = [
          {
            ...decoImages,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDecoImagesToCollectionIfMissing(decoImagesCollection, decoImages);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DecoImages to an array that doesn't contain it", () => {
        const decoImages: IDecoImages = sampleWithRequiredData;
        const decoImagesCollection: IDecoImages[] = [sampleWithPartialData];
        expectedResult = service.addDecoImagesToCollectionIfMissing(decoImagesCollection, decoImages);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoImages);
      });

      it('should add only unique DecoImages to an array', () => {
        const decoImagesArray: IDecoImages[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const decoImagesCollection: IDecoImages[] = [sampleWithRequiredData];
        expectedResult = service.addDecoImagesToCollectionIfMissing(decoImagesCollection, ...decoImagesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const decoImages: IDecoImages = sampleWithRequiredData;
        const decoImages2: IDecoImages = sampleWithPartialData;
        expectedResult = service.addDecoImagesToCollectionIfMissing([], decoImages, decoImages2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(decoImages);
        expect(expectedResult).toContain(decoImages2);
      });

      it('should accept null and undefined values', () => {
        const decoImages: IDecoImages = sampleWithRequiredData;
        expectedResult = service.addDecoImagesToCollectionIfMissing([], null, decoImages, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(decoImages);
      });

      it('should return initial array if no DecoImages is added', () => {
        const decoImagesCollection: IDecoImages[] = [sampleWithRequiredData];
        expectedResult = service.addDecoImagesToCollectionIfMissing(decoImagesCollection, undefined, null);
        expect(expectedResult).toEqual(decoImagesCollection);
      });
    });

    describe('compareDecoImages', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDecoImages(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDecoImages(entity1, entity2);
        const compareResult2 = service.compareDecoImages(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDecoImages(entity1, entity2);
        const compareResult2 = service.compareDecoImages(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDecoImages(entity1, entity2);
        const compareResult2 = service.compareDecoImages(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
