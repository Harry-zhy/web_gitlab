import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BookedCatererFormService } from './booked-caterer-form.service';
import { BookedCatererService } from '../service/booked-caterer.service';
import { IBookedCaterer } from '../booked-caterer.model';
import { IItinerary } from 'app/entities/itinerary/itinerary.model';
import { ItineraryService } from 'app/entities/itinerary/service/itinerary.service';

import { BookedCatererUpdateComponent } from './booked-caterer-update.component';

describe('BookedCaterer Management Update Component', () => {
  let comp: BookedCatererUpdateComponent;
  let fixture: ComponentFixture<BookedCatererUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookedCatererFormService: BookedCatererFormService;
  let bookedCatererService: BookedCatererService;
  let itineraryService: ItineraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BookedCatererUpdateComponent],
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
      .overrideTemplate(BookedCatererUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookedCatererUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookedCatererFormService = TestBed.inject(BookedCatererFormService);
    bookedCatererService = TestBed.inject(BookedCatererService);
    itineraryService = TestBed.inject(ItineraryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Itinerary query and add missing value', () => {
      const bookedCaterer: IBookedCaterer = { id: 456 };
      const itinerary: IItinerary = { id: 79569 };
      bookedCaterer.itinerary = itinerary;

      const itineraryCollection: IItinerary[] = [{ id: 38049 }];
      jest.spyOn(itineraryService, 'query').mockReturnValue(of(new HttpResponse({ body: itineraryCollection })));
      const additionalItineraries = [itinerary];
      const expectedCollection: IItinerary[] = [...additionalItineraries, ...itineraryCollection];
      jest.spyOn(itineraryService, 'addItineraryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bookedCaterer });
      comp.ngOnInit();

      expect(itineraryService.query).toHaveBeenCalled();
      expect(itineraryService.addItineraryToCollectionIfMissing).toHaveBeenCalledWith(
        itineraryCollection,
        ...additionalItineraries.map(expect.objectContaining)
      );
      expect(comp.itinerariesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bookedCaterer: IBookedCaterer = { id: 456 };
      const itinerary: IItinerary = { id: 9537 };
      bookedCaterer.itinerary = itinerary;

      activatedRoute.data = of({ bookedCaterer });
      comp.ngOnInit();

      expect(comp.itinerariesSharedCollection).toContain(itinerary);
      expect(comp.bookedCaterer).toEqual(bookedCaterer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookedCaterer>>();
      const bookedCaterer = { id: 123 };
      jest.spyOn(bookedCatererFormService, 'getBookedCaterer').mockReturnValue(bookedCaterer);
      jest.spyOn(bookedCatererService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookedCaterer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookedCaterer }));
      saveSubject.complete();

      // THEN
      expect(bookedCatererFormService.getBookedCaterer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookedCatererService.update).toHaveBeenCalledWith(expect.objectContaining(bookedCaterer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookedCaterer>>();
      const bookedCaterer = { id: 123 };
      jest.spyOn(bookedCatererFormService, 'getBookedCaterer').mockReturnValue({ id: null });
      jest.spyOn(bookedCatererService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookedCaterer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookedCaterer }));
      saveSubject.complete();

      // THEN
      expect(bookedCatererFormService.getBookedCaterer).toHaveBeenCalled();
      expect(bookedCatererService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookedCaterer>>();
      const bookedCaterer = { id: 123 };
      jest.spyOn(bookedCatererService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookedCaterer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookedCatererService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareItinerary', () => {
      it('Should forward to itineraryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(itineraryService, 'compareItinerary');
        comp.compareItinerary(entity, entity2);
        expect(itineraryService.compareItinerary).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
