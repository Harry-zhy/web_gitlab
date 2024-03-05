import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BookedActivityFormService } from './booked-activity-form.service';
import { BookedActivityService } from '../service/booked-activity.service';
import { IBookedActivity } from '../booked-activity.model';
import { IActivitySaved } from 'app/entities/activity-saved/activity-saved.model';
import { ActivitySavedService } from 'app/entities/activity-saved/service/activity-saved.service';

import { BookedActivityUpdateComponent } from './booked-activity-update.component';

describe('BookedActivity Management Update Component', () => {
  let comp: BookedActivityUpdateComponent;
  let fixture: ComponentFixture<BookedActivityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookedActivityFormService: BookedActivityFormService;
  let bookedActivityService: BookedActivityService;
  let activitySavedService: ActivitySavedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BookedActivityUpdateComponent],
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
      .overrideTemplate(BookedActivityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookedActivityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookedActivityFormService = TestBed.inject(BookedActivityFormService);
    bookedActivityService = TestBed.inject(BookedActivityService);
    activitySavedService = TestBed.inject(ActivitySavedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ActivitySaved query and add missing value', () => {
      const bookedActivity: IBookedActivity = { id: 456 };
      const activitySaveds: IActivitySaved[] = [{ id: 67640 }];
      bookedActivity.activitySaveds = activitySaveds;

      const activitySavedCollection: IActivitySaved[] = [{ id: 83613 }];
      jest.spyOn(activitySavedService, 'query').mockReturnValue(of(new HttpResponse({ body: activitySavedCollection })));
      const additionalActivitySaveds = [...activitySaveds];
      const expectedCollection: IActivitySaved[] = [...additionalActivitySaveds, ...activitySavedCollection];
      jest.spyOn(activitySavedService, 'addActivitySavedToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bookedActivity });
      comp.ngOnInit();

      expect(activitySavedService.query).toHaveBeenCalled();
      expect(activitySavedService.addActivitySavedToCollectionIfMissing).toHaveBeenCalledWith(
        activitySavedCollection,
        ...additionalActivitySaveds.map(expect.objectContaining)
      );
      expect(comp.activitySavedsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bookedActivity: IBookedActivity = { id: 456 };
      const activitySaved: IActivitySaved = { id: 77182 };
      bookedActivity.activitySaveds = [activitySaved];

      activatedRoute.data = of({ bookedActivity });
      comp.ngOnInit();

      expect(comp.activitySavedsSharedCollection).toContain(activitySaved);
      expect(comp.bookedActivity).toEqual(bookedActivity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookedActivity>>();
      const bookedActivity = { id: 123 };
      jest.spyOn(bookedActivityFormService, 'getBookedActivity').mockReturnValue(bookedActivity);
      jest.spyOn(bookedActivityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookedActivity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookedActivity }));
      saveSubject.complete();

      // THEN
      expect(bookedActivityFormService.getBookedActivity).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookedActivityService.update).toHaveBeenCalledWith(expect.objectContaining(bookedActivity));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookedActivity>>();
      const bookedActivity = { id: 123 };
      jest.spyOn(bookedActivityFormService, 'getBookedActivity').mockReturnValue({ id: null });
      jest.spyOn(bookedActivityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookedActivity: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookedActivity }));
      saveSubject.complete();

      // THEN
      expect(bookedActivityFormService.getBookedActivity).toHaveBeenCalled();
      expect(bookedActivityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookedActivity>>();
      const bookedActivity = { id: 123 };
      jest.spyOn(bookedActivityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookedActivity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookedActivityService.update).toHaveBeenCalled();
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
  });
});
