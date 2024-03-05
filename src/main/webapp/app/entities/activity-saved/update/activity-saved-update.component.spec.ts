import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActivitySavedFormService } from './activity-saved-form.service';
import { ActivitySavedService } from '../service/activity-saved.service';
import { IActivitySaved } from '../activity-saved.model';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { EventItineraryService } from 'app/entities/event-itinerary/service/event-itinerary.service';

import { ActivitySavedUpdateComponent } from './activity-saved-update.component';

describe('ActivitySaved Management Update Component', () => {
  let comp: ActivitySavedUpdateComponent;
  let fixture: ComponentFixture<ActivitySavedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let activitySavedFormService: ActivitySavedFormService;
  let activitySavedService: ActivitySavedService;
  let eventItineraryService: EventItineraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActivitySavedUpdateComponent],
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
      .overrideTemplate(ActivitySavedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivitySavedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    activitySavedFormService = TestBed.inject(ActivitySavedFormService);
    activitySavedService = TestBed.inject(ActivitySavedService);
    eventItineraryService = TestBed.inject(EventItineraryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call EventItinerary query and add missing value', () => {
      const activitySaved: IActivitySaved = { id: 456 };
      const eventItinerary: IEventItinerary = { id: 83618 };
      activitySaved.eventItinerary = eventItinerary;

      const eventItineraryCollection: IEventItinerary[] = [{ id: 55907 }];
      jest.spyOn(eventItineraryService, 'query').mockReturnValue(of(new HttpResponse({ body: eventItineraryCollection })));
      const additionalEventItineraries = [eventItinerary];
      const expectedCollection: IEventItinerary[] = [...additionalEventItineraries, ...eventItineraryCollection];
      jest.spyOn(eventItineraryService, 'addEventItineraryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ activitySaved });
      comp.ngOnInit();

      expect(eventItineraryService.query).toHaveBeenCalled();
      expect(eventItineraryService.addEventItineraryToCollectionIfMissing).toHaveBeenCalledWith(
        eventItineraryCollection,
        ...additionalEventItineraries.map(expect.objectContaining)
      );
      expect(comp.eventItinerariesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const activitySaved: IActivitySaved = { id: 456 };
      const eventItinerary: IEventItinerary = { id: 20524 };
      activitySaved.eventItinerary = eventItinerary;

      activatedRoute.data = of({ activitySaved });
      comp.ngOnInit();

      expect(comp.eventItinerariesSharedCollection).toContain(eventItinerary);
      expect(comp.activitySaved).toEqual(activitySaved);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivitySaved>>();
      const activitySaved = { id: 123 };
      jest.spyOn(activitySavedFormService, 'getActivitySaved').mockReturnValue(activitySaved);
      jest.spyOn(activitySavedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activitySaved });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activitySaved }));
      saveSubject.complete();

      // THEN
      expect(activitySavedFormService.getActivitySaved).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(activitySavedService.update).toHaveBeenCalledWith(expect.objectContaining(activitySaved));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivitySaved>>();
      const activitySaved = { id: 123 };
      jest.spyOn(activitySavedFormService, 'getActivitySaved').mockReturnValue({ id: null });
      jest.spyOn(activitySavedService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activitySaved: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activitySaved }));
      saveSubject.complete();

      // THEN
      expect(activitySavedFormService.getActivitySaved).toHaveBeenCalled();
      expect(activitySavedService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivitySaved>>();
      const activitySaved = { id: 123 };
      jest.spyOn(activitySavedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activitySaved });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(activitySavedService.update).toHaveBeenCalled();
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
