import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EventItineraryFormService } from './event-itinerary-form.service';
import { EventItineraryService } from '../service/event-itinerary.service';
import { IEventItinerary } from '../event-itinerary.model';
import { IItineraryDateTime } from 'app/entities/itinerary-date-time/itinerary-date-time.model';
import { ItineraryDateTimeService } from 'app/entities/itinerary-date-time/service/itinerary-date-time.service';

import { EventItineraryUpdateComponent } from './event-itinerary-update.component';

describe('EventItinerary Management Update Component', () => {
  let comp: EventItineraryUpdateComponent;
  let fixture: ComponentFixture<EventItineraryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventItineraryFormService: EventItineraryFormService;
  let eventItineraryService: EventItineraryService;
  let itineraryDateTimeService: ItineraryDateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EventItineraryUpdateComponent],
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
      .overrideTemplate(EventItineraryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventItineraryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventItineraryFormService = TestBed.inject(EventItineraryFormService);
    eventItineraryService = TestBed.inject(EventItineraryService);
    itineraryDateTimeService = TestBed.inject(ItineraryDateTimeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ItineraryDateTime query and add missing value', () => {
      const eventItinerary: IEventItinerary = { id: 456 };
      const eventDate: IItineraryDateTime = { id: 37112 };
      eventItinerary.eventDate = eventDate;

      const itineraryDateTimeCollection: IItineraryDateTime[] = [{ id: 18190 }];
      jest.spyOn(itineraryDateTimeService, 'query').mockReturnValue(of(new HttpResponse({ body: itineraryDateTimeCollection })));
      const additionalItineraryDateTimes = [eventDate];
      const expectedCollection: IItineraryDateTime[] = [...additionalItineraryDateTimes, ...itineraryDateTimeCollection];
      jest.spyOn(itineraryDateTimeService, 'addItineraryDateTimeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventItinerary });
      comp.ngOnInit();

      expect(itineraryDateTimeService.query).toHaveBeenCalled();
      expect(itineraryDateTimeService.addItineraryDateTimeToCollectionIfMissing).toHaveBeenCalledWith(
        itineraryDateTimeCollection,
        ...additionalItineraryDateTimes.map(expect.objectContaining)
      );
      expect(comp.itineraryDateTimesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventItinerary: IEventItinerary = { id: 456 };
      const eventDate: IItineraryDateTime = { id: 40714 };
      eventItinerary.eventDate = eventDate;

      activatedRoute.data = of({ eventItinerary });
      comp.ngOnInit();

      expect(comp.itineraryDateTimesSharedCollection).toContain(eventDate);
      expect(comp.eventItinerary).toEqual(eventItinerary);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEventItinerary>>();
      const eventItinerary = { id: 123 };
      jest.spyOn(eventItineraryFormService, 'getEventItinerary').mockReturnValue(eventItinerary);
      jest.spyOn(eventItineraryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventItinerary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventItinerary }));
      saveSubject.complete();

      // THEN
      expect(eventItineraryFormService.getEventItinerary).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventItineraryService.update).toHaveBeenCalledWith(expect.objectContaining(eventItinerary));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEventItinerary>>();
      const eventItinerary = { id: 123 };
      jest.spyOn(eventItineraryFormService, 'getEventItinerary').mockReturnValue({ id: null });
      jest.spyOn(eventItineraryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventItinerary: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventItinerary }));
      saveSubject.complete();

      // THEN
      expect(eventItineraryFormService.getEventItinerary).toHaveBeenCalled();
      expect(eventItineraryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEventItinerary>>();
      const eventItinerary = { id: 123 };
      jest.spyOn(eventItineraryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventItinerary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventItineraryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareItineraryDateTime', () => {
      it('Should forward to itineraryDateTimeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(itineraryDateTimeService, 'compareItineraryDateTime');
        comp.compareItineraryDateTime(entity, entity2);
        expect(itineraryDateTimeService.compareItineraryDateTime).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
