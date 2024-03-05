import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItineraryGuestFormService } from './itinerary-guest-form.service';
import { ItineraryGuestService } from '../service/itinerary-guest.service';
import { IItineraryGuest } from '../itinerary-guest.model';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { EventItineraryService } from 'app/entities/event-itinerary/service/event-itinerary.service';

import { ItineraryGuestUpdateComponent } from './itinerary-guest-update.component';

describe('ItineraryGuest Management Update Component', () => {
  let comp: ItineraryGuestUpdateComponent;
  let fixture: ComponentFixture<ItineraryGuestUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itineraryGuestFormService: ItineraryGuestFormService;
  let itineraryGuestService: ItineraryGuestService;
  let eventItineraryService: EventItineraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItineraryGuestUpdateComponent],
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
      .overrideTemplate(ItineraryGuestUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryGuestUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itineraryGuestFormService = TestBed.inject(ItineraryGuestFormService);
    itineraryGuestService = TestBed.inject(ItineraryGuestService);
    eventItineraryService = TestBed.inject(EventItineraryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call EventItinerary query and add missing value', () => {
      const itineraryGuest: IItineraryGuest = { id: 456 };
      const eventItineraries: IEventItinerary[] = [{ id: 45542 }];
      itineraryGuest.eventItineraries = eventItineraries;

      const eventItineraryCollection: IEventItinerary[] = [{ id: 27690 }];
      jest.spyOn(eventItineraryService, 'query').mockReturnValue(of(new HttpResponse({ body: eventItineraryCollection })));
      const additionalEventItineraries = [...eventItineraries];
      const expectedCollection: IEventItinerary[] = [...additionalEventItineraries, ...eventItineraryCollection];
      jest.spyOn(eventItineraryService, 'addEventItineraryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itineraryGuest });
      comp.ngOnInit();

      expect(eventItineraryService.query).toHaveBeenCalled();
      expect(eventItineraryService.addEventItineraryToCollectionIfMissing).toHaveBeenCalledWith(
        eventItineraryCollection,
        ...additionalEventItineraries.map(expect.objectContaining)
      );
      expect(comp.eventItinerariesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const itineraryGuest: IItineraryGuest = { id: 456 };
      const eventItinerary: IEventItinerary = { id: 19887 };
      itineraryGuest.eventItineraries = [eventItinerary];

      activatedRoute.data = of({ itineraryGuest });
      comp.ngOnInit();

      expect(comp.eventItinerariesSharedCollection).toContain(eventItinerary);
      expect(comp.itineraryGuest).toEqual(itineraryGuest);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryGuest>>();
      const itineraryGuest = { id: 123 };
      jest.spyOn(itineraryGuestFormService, 'getItineraryGuest').mockReturnValue(itineraryGuest);
      jest.spyOn(itineraryGuestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryGuest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itineraryGuest }));
      saveSubject.complete();

      // THEN
      expect(itineraryGuestFormService.getItineraryGuest).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itineraryGuestService.update).toHaveBeenCalledWith(expect.objectContaining(itineraryGuest));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryGuest>>();
      const itineraryGuest = { id: 123 };
      jest.spyOn(itineraryGuestFormService, 'getItineraryGuest').mockReturnValue({ id: null });
      jest.spyOn(itineraryGuestService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryGuest: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itineraryGuest }));
      saveSubject.complete();

      // THEN
      expect(itineraryGuestFormService.getItineraryGuest).toHaveBeenCalled();
      expect(itineraryGuestService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItineraryGuest>>();
      const itineraryGuest = { id: 123 };
      jest.spyOn(itineraryGuestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itineraryGuest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itineraryGuestService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEventItinerary', () => {
      it('Should forward to eventItineraryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(eventItineraryService, 'compareEventItinerary');
        comp.compareEventItinerary(entity, entity2);
        expect(eventItineraryService.compareEventItinerary).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
