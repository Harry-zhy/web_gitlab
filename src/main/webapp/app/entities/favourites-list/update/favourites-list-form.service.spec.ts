import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../favourites-list.test-samples';

import { FavouritesListFormService } from './favourites-list-form.service';

describe('FavouritesList Form Service', () => {
  let service: FavouritesListFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouritesListFormService);
  });

  describe('Service methods', () => {
    describe('createFavouritesListFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFavouritesListFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
          })
        );
      });

      it('passing IFavouritesList should create a new form with FormGroup', () => {
        const formGroup = service.createFavouritesListFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
          })
        );
      });
    });

    describe('getFavouritesList', () => {
      it('should return NewFavouritesList for default FavouritesList initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFavouritesListFormGroup(sampleWithNewData);

        const favouritesList = service.getFavouritesList(formGroup) as any;

        expect(favouritesList).toMatchObject(sampleWithNewData);
      });

      it('should return NewFavouritesList for empty FavouritesList initial value', () => {
        const formGroup = service.createFavouritesListFormGroup();

        const favouritesList = service.getFavouritesList(formGroup) as any;

        expect(favouritesList).toMatchObject({});
      });

      it('should return IFavouritesList', () => {
        const formGroup = service.createFavouritesListFormGroup(sampleWithRequiredData);

        const favouritesList = service.getFavouritesList(formGroup) as any;

        expect(favouritesList).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFavouritesList should not enable id FormControl', () => {
        const formGroup = service.createFavouritesListFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFavouritesList should disable id FormControl', () => {
        const formGroup = service.createFavouritesListFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
