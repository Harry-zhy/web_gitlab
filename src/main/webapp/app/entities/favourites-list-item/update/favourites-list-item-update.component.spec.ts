import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FavouritesListItemFormService } from './favourites-list-item-form.service';
import { FavouritesListItemService } from '../service/favourites-list-item.service';
import { IFavouritesListItem } from '../favourites-list-item.model';
import { ICaterers } from 'app/entities/caterers/caterers.model';
import { CaterersService } from 'app/entities/caterers/service/caterers.service';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';
import { ActivitySelfService } from 'app/entities/activity-self/service/activity-self.service';
import { IVenueInformation } from 'app/entities/venue-information/venue-information.model';
import { VenueInformationService } from 'app/entities/venue-information/service/venue-information.service';
import { IFavouritesList } from 'app/entities/favourites-list/favourites-list.model';
import { FavouritesListService } from 'app/entities/favourites-list/service/favourites-list.service';

import { FavouritesListItemUpdateComponent } from './favourites-list-item-update.component';

describe('FavouritesListItem Management Update Component', () => {
  let comp: FavouritesListItemUpdateComponent;
  let fixture: ComponentFixture<FavouritesListItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let favouritesListItemFormService: FavouritesListItemFormService;
  let favouritesListItemService: FavouritesListItemService;
  let caterersService: CaterersService;
  let activitySelfService: ActivitySelfService;
  let venueInformationService: VenueInformationService;
  let favouritesListService: FavouritesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FavouritesListItemUpdateComponent],
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
      .overrideTemplate(FavouritesListItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FavouritesListItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    favouritesListItemFormService = TestBed.inject(FavouritesListItemFormService);
    favouritesListItemService = TestBed.inject(FavouritesListItemService);
    caterersService = TestBed.inject(CaterersService);
    activitySelfService = TestBed.inject(ActivitySelfService);
    venueInformationService = TestBed.inject(VenueInformationService);
    favouritesListService = TestBed.inject(FavouritesListService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Caterers query and add missing value', () => {
      const favouritesListItem: IFavouritesListItem = { id: 456 };
      const caterer: ICaterers = { id: 93358 };
      favouritesListItem.caterer = caterer;

      const caterersCollection: ICaterers[] = [{ id: 67526 }];
      jest.spyOn(caterersService, 'query').mockReturnValue(of(new HttpResponse({ body: caterersCollection })));
      const additionalCaterers = [caterer];
      const expectedCollection: ICaterers[] = [...additionalCaterers, ...caterersCollection];
      jest.spyOn(caterersService, 'addCaterersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ favouritesListItem });
      comp.ngOnInit();

      expect(caterersService.query).toHaveBeenCalled();
      expect(caterersService.addCaterersToCollectionIfMissing).toHaveBeenCalledWith(
        caterersCollection,
        ...additionalCaterers.map(expect.objectContaining)
      );
      expect(comp.caterersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ActivitySelf query and add missing value', () => {
      const favouritesListItem: IFavouritesListItem = { id: 456 };
      const activity: IActivitySelf = { id: 81926 };
      favouritesListItem.activity = activity;

      const activitySelfCollection: IActivitySelf[] = [{ id: 30530 }];
      jest.spyOn(activitySelfService, 'query').mockReturnValue(of(new HttpResponse({ body: activitySelfCollection })));
      const additionalActivitySelves = [activity];
      const expectedCollection: IActivitySelf[] = [...additionalActivitySelves, ...activitySelfCollection];
      jest.spyOn(activitySelfService, 'addActivitySelfToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ favouritesListItem });
      comp.ngOnInit();

      expect(activitySelfService.query).toHaveBeenCalled();
      expect(activitySelfService.addActivitySelfToCollectionIfMissing).toHaveBeenCalledWith(
        activitySelfCollection,
        ...additionalActivitySelves.map(expect.objectContaining)
      );
      expect(comp.activitySelvesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call VenueInformation query and add missing value', () => {
      const favouritesListItem: IFavouritesListItem = { id: 456 };
      const venue: IVenueInformation = { id: 32039 };
      favouritesListItem.venue = venue;

      const venueInformationCollection: IVenueInformation[] = [{ id: 64186 }];
      jest.spyOn(venueInformationService, 'query').mockReturnValue(of(new HttpResponse({ body: venueInformationCollection })));
      const additionalVenueInformations = [venue];
      const expectedCollection: IVenueInformation[] = [...additionalVenueInformations, ...venueInformationCollection];
      jest.spyOn(venueInformationService, 'addVenueInformationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ favouritesListItem });
      comp.ngOnInit();

      expect(venueInformationService.query).toHaveBeenCalled();
      expect(venueInformationService.addVenueInformationToCollectionIfMissing).toHaveBeenCalledWith(
        venueInformationCollection,
        ...additionalVenueInformations.map(expect.objectContaining)
      );
      expect(comp.venueInformationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call FavouritesList query and add missing value', () => {
      const favouritesListItem: IFavouritesListItem = { id: 456 };
      const favouritesList: IFavouritesList = { id: 92398 };
      favouritesListItem.favouritesList = favouritesList;

      const favouritesListCollection: IFavouritesList[] = [{ id: 64629 }];
      jest.spyOn(favouritesListService, 'query').mockReturnValue(of(new HttpResponse({ body: favouritesListCollection })));
      const additionalFavouritesLists = [favouritesList];
      const expectedCollection: IFavouritesList[] = [...additionalFavouritesLists, ...favouritesListCollection];
      jest.spyOn(favouritesListService, 'addFavouritesListToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ favouritesListItem });
      comp.ngOnInit();

      expect(favouritesListService.query).toHaveBeenCalled();
      expect(favouritesListService.addFavouritesListToCollectionIfMissing).toHaveBeenCalledWith(
        favouritesListCollection,
        ...additionalFavouritesLists.map(expect.objectContaining)
      );
      expect(comp.favouritesListsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const favouritesListItem: IFavouritesListItem = { id: 456 };
      const caterer: ICaterers = { id: 72234 };
      favouritesListItem.caterer = caterer;
      const activity: IActivitySelf = { id: 43835 };
      favouritesListItem.activity = activity;
      const venue: IVenueInformation = { id: 40215 };
      favouritesListItem.venue = venue;
      const favouritesList: IFavouritesList = { id: 16816 };
      favouritesListItem.favouritesList = favouritesList;

      activatedRoute.data = of({ favouritesListItem });
      comp.ngOnInit();

      expect(comp.caterersSharedCollection).toContain(caterer);
      expect(comp.activitySelvesSharedCollection).toContain(activity);
      expect(comp.venueInformationsSharedCollection).toContain(venue);
      expect(comp.favouritesListsSharedCollection).toContain(favouritesList);
      expect(comp.favouritesListItem).toEqual(favouritesListItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFavouritesListItem>>();
      const favouritesListItem = { id: 123 };
      jest.spyOn(favouritesListItemFormService, 'getFavouritesListItem').mockReturnValue(favouritesListItem);
      jest.spyOn(favouritesListItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favouritesListItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: favouritesListItem }));
      saveSubject.complete();

      // THEN
      expect(favouritesListItemFormService.getFavouritesListItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(favouritesListItemService.update).toHaveBeenCalledWith(expect.objectContaining(favouritesListItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFavouritesListItem>>();
      const favouritesListItem = { id: 123 };
      jest.spyOn(favouritesListItemFormService, 'getFavouritesListItem').mockReturnValue({ id: null });
      jest.spyOn(favouritesListItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favouritesListItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: favouritesListItem }));
      saveSubject.complete();

      // THEN
      expect(favouritesListItemFormService.getFavouritesListItem).toHaveBeenCalled();
      expect(favouritesListItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFavouritesListItem>>();
      const favouritesListItem = { id: 123 };
      jest.spyOn(favouritesListItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favouritesListItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(favouritesListItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCaterers', () => {
      it('Should forward to caterersService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(caterersService, 'compareCaterers');
        comp.compareCaterers(entity, entity2);
        expect(caterersService.compareCaterers).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareActivitySelf', () => {
      it('Should forward to activitySelfService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(activitySelfService, 'compareActivitySelf');
        comp.compareActivitySelf(entity, entity2);
        expect(activitySelfService.compareActivitySelf).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareVenueInformation', () => {
      it('Should forward to venueInformationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(venueInformationService, 'compareVenueInformation');
        comp.compareVenueInformation(entity, entity2);
        expect(venueInformationService.compareVenueInformation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareFavouritesList', () => {
      it('Should forward to favouritesListService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(favouritesListService, 'compareFavouritesList');
        comp.compareFavouritesList(entity, entity2);
        expect(favouritesListService.compareFavouritesList).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
