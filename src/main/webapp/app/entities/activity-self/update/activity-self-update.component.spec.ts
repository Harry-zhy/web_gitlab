import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActivitySelfFormService } from './activity-self-form.service';
import { ActivitySelfService } from '../service/activity-self.service';
import { IActivitySelf } from '../activity-self.model';
import { IActivitySaved } from 'app/entities/activity-saved/activity-saved.model';
import { ActivitySavedService } from 'app/entities/activity-saved/service/activity-saved.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { ActivitySelfUpdateComponent } from './activity-self-update.component';

describe('ActivitySelf Management Update Component', () => {
  let comp: ActivitySelfUpdateComponent;
  let fixture: ComponentFixture<ActivitySelfUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let activitySelfFormService: ActivitySelfFormService;
  let activitySelfService: ActivitySelfService;
  let activitySavedService: ActivitySavedService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActivitySelfUpdateComponent],
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
      .overrideTemplate(ActivitySelfUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivitySelfUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    activitySelfFormService = TestBed.inject(ActivitySelfFormService);
    activitySelfService = TestBed.inject(ActivitySelfService);
    activitySavedService = TestBed.inject(ActivitySavedService);
    eventService = TestBed.inject(EventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ActivitySaved query and add missing value', () => {
      const activitySelf: IActivitySelf = { id: 456 };
      const activitySaveds: IActivitySaved[] = [{ id: 39766 }];
      activitySelf.activitySaveds = activitySaveds;

      const activitySavedCollection: IActivitySaved[] = [{ id: 69027 }];
      jest.spyOn(activitySavedService, 'query').mockReturnValue(of(new HttpResponse({ body: activitySavedCollection })));
      const additionalActivitySaveds = [...activitySaveds];
      const expectedCollection: IActivitySaved[] = [...additionalActivitySaveds, ...activitySavedCollection];
      jest.spyOn(activitySavedService, 'addActivitySavedToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ activitySelf });
      comp.ngOnInit();

      expect(activitySavedService.query).toHaveBeenCalled();
      expect(activitySavedService.addActivitySavedToCollectionIfMissing).toHaveBeenCalledWith(
        activitySavedCollection,
        ...additionalActivitySaveds.map(expect.objectContaining)
      );
      expect(comp.activitySavedsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const activitySelf: IActivitySelf = { id: 456 };
      const event: IEvent = { id: 44787 };
      activitySelf.event = event;

      const eventCollection: IEvent[] = [{ id: 72016 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ activitySelf });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(
        eventCollection,
        ...additionalEvents.map(expect.objectContaining)
      );
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const activitySelf: IActivitySelf = { id: 456 };
      const activitySaved: IActivitySaved = { id: 73802 };
      activitySelf.activitySaveds = [activitySaved];
      const event: IEvent = { id: 36882 };
      activitySelf.event = event;

      activatedRoute.data = of({ activitySelf });
      comp.ngOnInit();

      expect(comp.activitySavedsSharedCollection).toContain(activitySaved);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.activitySelf).toEqual(activitySelf);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivitySelf>>();
      const activitySelf = { id: 123 };
      jest.spyOn(activitySelfFormService, 'getActivitySelf').mockReturnValue(activitySelf);
      jest.spyOn(activitySelfService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activitySelf });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activitySelf }));
      saveSubject.complete();

      // THEN
      expect(activitySelfFormService.getActivitySelf).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(activitySelfService.update).toHaveBeenCalledWith(expect.objectContaining(activitySelf));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivitySelf>>();
      const activitySelf = { id: 123 };
      jest.spyOn(activitySelfFormService, 'getActivitySelf').mockReturnValue({ id: null });
      jest.spyOn(activitySelfService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activitySelf: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activitySelf }));
      saveSubject.complete();

      // THEN
      expect(activitySelfFormService.getActivitySelf).toHaveBeenCalled();
      expect(activitySelfService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivitySelf>>();
      const activitySelf = { id: 123 };
      jest.spyOn(activitySelfService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activitySelf });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(activitySelfService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareActivitySaved', () => {
      it('Should forward to activitySavedService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(activitySavedService, 'compareActivitySaved');
        comp.compareActivitySaved(entity, entity2);
        expect(activitySavedService.compareActivitySaved).toHaveBeenCalledWith(entity, entity2);
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
