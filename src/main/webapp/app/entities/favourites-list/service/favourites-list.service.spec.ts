import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFavouritesList } from '../favourites-list.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../favourites-list.test-samples';

import { FavouritesListService } from './favourites-list.service';

const requireRestSample: IFavouritesList = {
  ...sampleWithRequiredData,
};

describe('FavouritesList Service', () => {
  let service: FavouritesListService;
  let httpMock: HttpTestingController;
  let expectedResult: IFavouritesList | IFavouritesList[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FavouritesListService);
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

    it('should create a FavouritesList', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const favouritesList = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(favouritesList).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FavouritesList', () => {
      const favouritesList = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(favouritesList).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FavouritesList', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FavouritesList', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FavouritesList', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFavouritesListToCollectionIfMissing', () => {
      it('should add a FavouritesList to an empty array', () => {
        const favouritesList: IFavouritesList = sampleWithRequiredData;
        expectedResult = service.addFavouritesListToCollectionIfMissing([], favouritesList);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(favouritesList);
      });

      it('should not add a FavouritesList to an array that contains it', () => {
        const favouritesList: IFavouritesList = sampleWithRequiredData;
        const favouritesListCollection: IFavouritesList[] = [
          {
            ...favouritesList,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFavouritesListToCollectionIfMissing(favouritesListCollection, favouritesList);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FavouritesList to an array that doesn't contain it", () => {
        const favouritesList: IFavouritesList = sampleWithRequiredData;
        const favouritesListCollection: IFavouritesList[] = [sampleWithPartialData];
        expectedResult = service.addFavouritesListToCollectionIfMissing(favouritesListCollection, favouritesList);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(favouritesList);
      });

      it('should add only unique FavouritesList to an array', () => {
        const favouritesListArray: IFavouritesList[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const favouritesListCollection: IFavouritesList[] = [sampleWithRequiredData];
        expectedResult = service.addFavouritesListToCollectionIfMissing(favouritesListCollection, ...favouritesListArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const favouritesList: IFavouritesList = sampleWithRequiredData;
        const favouritesList2: IFavouritesList = sampleWithPartialData;
        expectedResult = service.addFavouritesListToCollectionIfMissing([], favouritesList, favouritesList2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(favouritesList);
        expect(expectedResult).toContain(favouritesList2);
      });

      it('should accept null and undefined values', () => {
        const favouritesList: IFavouritesList = sampleWithRequiredData;
        expectedResult = service.addFavouritesListToCollectionIfMissing([], null, favouritesList, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(favouritesList);
      });

      it('should return initial array if no FavouritesList is added', () => {
        const favouritesListCollection: IFavouritesList[] = [sampleWithRequiredData];
        expectedResult = service.addFavouritesListToCollectionIfMissing(favouritesListCollection, undefined, null);
        expect(expectedResult).toEqual(favouritesListCollection);
      });
    });

    describe('compareFavouritesList', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFavouritesList(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFavouritesList(entity1, entity2);
        const compareResult2 = service.compareFavouritesList(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFavouritesList(entity1, entity2);
        const compareResult2 = service.compareFavouritesList(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFavouritesList(entity1, entity2);
        const compareResult2 = service.compareFavouritesList(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
