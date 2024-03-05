import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CaterersFormService } from './caterers-form.service';
import { CaterersService } from '../service/caterers.service';
import { ICaterers } from '../caterers.model';
import { IBookedCaterer } from 'app/entities/booked-caterer/booked-caterer.model';
import { BookedCatererService } from 'app/entities/booked-caterer/service/booked-caterer.service';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { EventItineraryService } from 'app/entities/event-itinerary/service/event-itinerary.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';
import { IDietaryRequirements } from 'app/entities/dietary-requirements/dietary-requirements.model';
import { DietaryRequirementsService } from 'app/entities/dietary-requirements/service/dietary-requirements.service';
import { ICuisine } from 'app/entities/cuisine/cuisine.model';
import { CuisineService } from 'app/entities/cuisine/service/cuisine.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { CaterersUpdateComponent } from './caterers-update.component';

describe('Caterers Management Update Component', () => {
  let comp: CaterersUpdateComponent;
  let fixture: ComponentFixture<CaterersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let caterersFormService: CaterersFormService;
  let caterersService: CaterersService;
  let bookedCatererService: BookedCatererService;
  let eventItineraryService: EventItineraryService;
  let supplierService: SupplierService;
  let dietaryRequirementsService: DietaryRequirementsService;
  let cuisineService: CuisineService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CaterersUpdateComponent],
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
      .overrideTemplate(CaterersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CaterersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    caterersFormService = TestBed.inject(CaterersFormService);
    caterersService = TestBed.inject(CaterersService);
    bookedCatererService = TestBed.inject(BookedCatererService);
    eventItineraryService = TestBed.inject(EventItineraryService);
    supplierService = TestBed.inject(SupplierService);
    dietaryRequirementsService = TestBed.inject(DietaryRequirementsService);
    cuisineService = TestBed.inject(CuisineService);
    eventService = TestBed.inject(EventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call bookedCaterer query and add missing value', () => {
      const caterers: ICaterers = { id: 456 };
      const bookedCaterer: IBookedCaterer = { id: 21277 };
      caterers.bookedCaterer = bookedCaterer;

      const bookedCatererCollection: IBookedCaterer[] = [{ id: 38787 }];
      jest.spyOn(bookedCatererService, 'query').mockReturnValue(of(new HttpResponse({ body: bookedCatererCollection })));
      const expectedCollection: IBookedCaterer[] = [bookedCaterer, ...bookedCatererCollection];
      jest.spyOn(bookedCatererService, 'addBookedCatererToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caterers });
      comp.ngOnInit();

      expect(bookedCatererService.query).toHaveBeenCalled();
      expect(bookedCatererService.addBookedCatererToCollectionIfMissing).toHaveBeenCalledWith(bookedCatererCollection, bookedCaterer);
      expect(comp.bookedCaterersCollection).toEqual(expectedCollection);
    });

    it('Should call EventItinerary query and add missing value', () => {
      const caterers: ICaterers = { id: 456 };
      const eventItinerary: IEventItinerary = { id: 86763 };
      caterers.eventItinerary = eventItinerary;

      const eventItineraryCollection: IEventItinerary[] = [{ id: 15006 }];
      jest.spyOn(eventItineraryService, 'query').mockReturnValue(of(new HttpResponse({ body: eventItineraryCollection })));
      const additionalEventItineraries = [eventItinerary];
      const expectedCollection: IEventItinerary[] = [...additionalEventItineraries, ...eventItineraryCollection];
      jest.spyOn(eventItineraryService, 'addEventItineraryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caterers });
      comp.ngOnInit();

      expect(eventItineraryService.query).toHaveBeenCalled();
      expect(eventItineraryService.addEventItineraryToCollectionIfMissing).toHaveBeenCalledWith(
        eventItineraryCollection,
        ...additionalEventItineraries.map(expect.objectContaining)
      );
      expect(comp.eventItinerariesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Supplier query and add missing value', () => {
      const caterers: ICaterers = { id: 456 };
      const supplier: ISupplier = { id: 39677 };
      caterers.supplier = supplier;

      const supplierCollection: ISupplier[] = [{ id: 58454 }];
      jest.spyOn(supplierService, 'query').mockReturnValue(of(new HttpResponse({ body: supplierCollection })));
      const additionalSuppliers = [supplier];
      const expectedCollection: ISupplier[] = [...additionalSuppliers, ...supplierCollection];
      jest.spyOn(supplierService, 'addSupplierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caterers });
      comp.ngOnInit();

      expect(supplierService.query).toHaveBeenCalled();
      expect(supplierService.addSupplierToCollectionIfMissing).toHaveBeenCalledWith(
        supplierCollection,
        ...additionalSuppliers.map(expect.objectContaining)
      );
      expect(comp.suppliersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call DietaryRequirements query and add missing value', () => {
      const caterers: ICaterers = { id: 456 };
      const dietaryRequirements: IDietaryRequirements[] = [{ id: 22962 }];
      caterers.dietaryRequirements = dietaryRequirements;

      const dietaryRequirementsCollection: IDietaryRequirements[] = [{ id: 40963 }];
      jest.spyOn(dietaryRequirementsService, 'query').mockReturnValue(of(new HttpResponse({ body: dietaryRequirementsCollection })));
      const additionalDietaryRequirements = [...dietaryRequirements];
      const expectedCollection: IDietaryRequirements[] = [...additionalDietaryRequirements, ...dietaryRequirementsCollection];
      jest.spyOn(dietaryRequirementsService, 'addDietaryRequirementsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caterers });
      comp.ngOnInit();

      expect(dietaryRequirementsService.query).toHaveBeenCalled();
      expect(dietaryRequirementsService.addDietaryRequirementsToCollectionIfMissing).toHaveBeenCalledWith(
        dietaryRequirementsCollection,
        ...additionalDietaryRequirements.map(expect.objectContaining)
      );
      expect(comp.dietaryRequirementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cuisine query and add missing value', () => {
      const caterers: ICaterers = { id: 456 };
      const cuisines: ICuisine[] = [{ id: 51096 }];
      caterers.cuisines = cuisines;

      const cuisineCollection: ICuisine[] = [{ id: 97620 }];
      jest.spyOn(cuisineService, 'query').mockReturnValue(of(new HttpResponse({ body: cuisineCollection })));
      const additionalCuisines = [...cuisines];
      const expectedCollection: ICuisine[] = [...additionalCuisines, ...cuisineCollection];
      jest.spyOn(cuisineService, 'addCuisineToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caterers });
      comp.ngOnInit();

      expect(cuisineService.query).toHaveBeenCalled();
      expect(cuisineService.addCuisineToCollectionIfMissing).toHaveBeenCalledWith(
        cuisineCollection,
        ...additionalCuisines.map(expect.objectContaining)
      );
      expect(comp.cuisinesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const caterers: ICaterers = { id: 456 };
      const event: IEvent = { id: 562 };
      caterers.event = event;

      const eventCollection: IEvent[] = [{ id: 94934 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caterers });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(
        eventCollection,
        ...additionalEvents.map(expect.objectContaining)
      );
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const caterers: ICaterers = { id: 456 };
      const bookedCaterer: IBookedCaterer = { id: 56408 };
      caterers.bookedCaterer = bookedCaterer;
      const eventItinerary: IEventItinerary = { id: 6879 };
      caterers.eventItinerary = eventItinerary;
      const supplier: ISupplier = { id: 79263 };
      caterers.supplier = supplier;
      const dietaryRequirements: IDietaryRequirements = { id: 86140 };
      caterers.dietaryRequirements = [dietaryRequirements];
      const cuisine: ICuisine = { id: 54273 };
      caterers.cuisines = [cuisine];
      const event: IEvent = { id: 66473 };
      caterers.event = event;

      activatedRoute.data = of({ caterers });
      comp.ngOnInit();

      expect(comp.bookedCaterersCollection).toContain(bookedCaterer);
      expect(comp.eventItinerariesSharedCollection).toContain(eventItinerary);
      expect(comp.suppliersSharedCollection).toContain(supplier);
      expect(comp.dietaryRequirementsSharedCollection).toContain(dietaryRequirements);
      expect(comp.cuisinesSharedCollection).toContain(cuisine);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.caterers).toEqual(caterers);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaterers>>();
      const caterers = { id: 123 };
      jest.spyOn(caterersFormService, 'getCaterers').mockReturnValue(caterers);
      jest.spyOn(caterersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caterers });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caterers }));
      saveSubject.complete();

      // THEN
      expect(caterersFormService.getCaterers).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(caterersService.update).toHaveBeenCalledWith(expect.objectContaining(caterers));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaterers>>();
      const caterers = { id: 123 };
      jest.spyOn(caterersFormService, 'getCaterers').mockReturnValue({ id: null });
      jest.spyOn(caterersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caterers: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caterers }));
      saveSubject.complete();

      // THEN
      expect(caterersFormService.getCaterers).toHaveBeenCalled();
      expect(caterersService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaterers>>();
      const caterers = { id: 123 };
      jest.spyOn(caterersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caterers });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(caterersService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBookedCaterer', () => {
      it('Should forward to bookedCatererService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(bookedCatererService, 'compareBookedCaterer');
        comp.compareBookedCaterer(entity, entity2);
        expect(bookedCatererService.compareBookedCaterer).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEventItinerary', () => {
      it('Should forward to eventItineraryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(eventItineraryService, 'compareEventItinerary');
        comp.compareEventItinerary(entity, entity2);
        expect(eventItineraryService.compareEventItinerary).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSupplier', () => {
      it('Should forward to supplierService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(supplierService, 'compareSupplier');
        comp.compareSupplier(entity, entity2);
        expect(supplierService.compareSupplier).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDietaryRequirements', () => {
      it('Should forward to dietaryRequirementsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(dietaryRequirementsService, 'compareDietaryRequirements');
        comp.compareDietaryRequirements(entity, entity2);
        expect(dietaryRequirementsService.compareDietaryRequirements).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCuisine', () => {
      it('Should forward to cuisineService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(cuisineService, 'compareCuisine');
        comp.compareCuisine(entity, entity2);
        expect(cuisineService.compareCuisine).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEvent', () => {
      it('Should forward to eventService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(eventService, 'compareEvent');
        comp.compareEvent(entity, entity2);
        expect(eventService.compareEvent).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
