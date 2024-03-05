import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../favourites-list-item.test-samples';

import { FavouritesListItemFormService } from './favourites-list-item-form.service';

describe('FavouritesListItem Form Service', () => {
  let service: FavouritesListItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouritesListItemFormService);
  });

  describe('Service methods', () => {
    describe('createFavouritesListItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFavouritesListItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            category: expect.any(Object),
            description: expect.any(Object),
            caterer: expect.any(Object),
            activity: expect.any(Object),
            venue: expect.any(Object),
            favouritesList: expect.any(Object),
          })
        );
      });

      it('passing IFavouritesListItem should create a new form with FormGroup', () => {
        const formGroup = service.createFavouritesListItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            category: expect.any(Object),
            description: expect.any(Object),
            caterer: expect.any(Object),
            activity: expect.any(Object),
            venue: expect.any(Object),
            favouritesList: expect.any(Object),
          })
        );
      });
    });

    describe('getFavouritesListItem', () => {
      it('should return NewFavouritesListItem for default FavouritesListItem initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFavouritesListItemFormGroup(sampleWithNewData);

        const favouritesListItem = service.getFavouritesListItem(formGroup) as any;

        expect(favouritesListItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewFavouritesListItem for empty FavouritesListItem initial value', () => {
        const formGroup = service.createFavouritesListItemFormGroup();

        const favouritesListItem = service.getFavouritesListItem(formGroup) as any;

        expect(favouritesListItem).toMatchObject({});
      });

      it('should return IFavouritesListItem', () => {
        const formGroup = service.createFavouritesListItemFormGroup(sampleWithRequiredData);

        const favouritesListItem = service.getFavouritesListItem(formGroup) as any;

        expect(favouritesListItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFavouritesListItem should not enable id FormControl', () => {
        const formGroup = service.createFavouritesListItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFavouritesListItem should disable id FormControl', () => {
        const formGroup = service.createFavouritesListItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
