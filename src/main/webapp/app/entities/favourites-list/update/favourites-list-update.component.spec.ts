import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FavouritesListFormService } from './favourites-list-form.service';
import { FavouritesListService } from '../service/favourites-list.service';
import { IFavouritesList } from '../favourites-list.model';

import { FavouritesListUpdateComponent } from './favourites-list-update.component';

describe('FavouritesList Management Update Component', () => {
  let comp: FavouritesListUpdateComponent;
  let fixture: ComponentFixture<FavouritesListUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let favouritesListFormService: FavouritesListFormService;
  let favouritesListService: FavouritesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FavouritesListUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FavouritesListUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FavouritesListUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    favouritesListFormService = TestBed.inject(FavouritesListFormService);
    favouritesListService = TestBed.inject(FavouritesListService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const favouritesList: IFavouritesList = { id: 456 };

      activatedRoute.data = of({ favouritesList });
      comp.ngOnInit();

      expect(comp.favouritesList).toEqual(favouritesList);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFavouritesList>>();
      const favouritesList = { id: 123 };
      jest.spyOn(favouritesListFormService, 'getFavouritesList').mockReturnValue(favouritesList);
      jest.spyOn(favouritesListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favouritesList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: favouritesList }));
      saveSubject.complete();

      // THEN
      expect(favouritesListFormService.getFavouritesList).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(favouritesListService.update).toHaveBeenCalledWith(expect.objectContaining(favouritesList));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFavouritesList>>();
      const favouritesList = { id: 123 };
      jest.spyOn(favouritesListFormService, 'getFavouritesList').mockReturnValue({ id: null });
      jest.spyOn(favouritesListService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favouritesList: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: favouritesList }));
      saveSubject.complete();

      // THEN
      expect(favouritesListFormService.getFavouritesList).toHaveBeenCalled();
      expect(favouritesListService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFavouritesList>>();
      const favouritesList = { id: 123 };
      jest.spyOn(favouritesListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favouritesList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(favouritesListService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
